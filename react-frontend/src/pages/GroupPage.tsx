import { group } from "console";
import React from "react";
import FilterFeatures from "../components/FilterNamesComponent";
import Icons from "../components/icons";
import SelectPctAvailGradient from "../components/SelectPctAvailGradient";
import { FeatureInfo, FeatureGroup } from "../types/feature_types";

function groupcolor(id:number|null){
    if (id==null){
        return "#fff";
    }
    else {
        const colors = ["#07c4b2","#6f5ed3","#ce3665","#ffcd1c","#3896e3","#db61db","#929a9b","#59cb59","#fc8943","#db3e3e"];
        return colors[id%10];
    }
}

class NameChoiceComponent extends React.Component<{group:FeatureGroup, N:number, onChoiceMade: any, onClickGroup:any, onRemoveGroup: Function}, {text: string,isEditing:boolean}>{

    constructor(props: any) {
      super(props);
      this.state = {text: this.props.group.name, isEditing:false};
      this.handleChange = this.handleChange.bind(this);
      this.handleChoice = this.handleChoice.bind(this);
    }
    handleChange(e : any) {
        this.setState({ text: e.target.value});
    }

    handleChoice(e : any){
        this.props.onChoiceMade(this.state.text);
        this.setState({isEditing:false})          
    }
    render() { // Old Text: Which feature do you want to use? (adre_bol, adre_iv, PAPs, HR, CVPm, PVR, urine, Na, temp, pH, pO2)
        // console.log("name choice component rendered")    
      return (
        <div className="group-row" onClick={this.props.onClickGroup}>
            <div style={{backgroundColor:groupcolor(this.props.group.id)}} className="group-colorbar"></div>
            
            
            {this.state.isEditing===false &&
            
            <>
            <div className="group-name">
            <label>
                {this.props.group.name}, N: {this.props.N}    
            </label><span>&nbsp;&nbsp;</span>
            <div className="iconbutton" onClick={()=>this.setState({isEditing:true})}><Icons icon="edit"/></div>
            </div>
            <div className="group-buttons">
                      
                      <div className="iconbutton" onClick={()=>this.props.onRemoveGroup()}><Icons icon="trash"/></div>
            </div>
            </>
                }
            {this.state.isEditing && 
            <> <input
                id="data-choice"
                onChange={this.handleChange}
                value={this.state.text}
            />   <span>&nbsp;&nbsp;</span>
            <button onClick={this.handleChoice}>
                Confirm 
            </button></>}
        </div>
        
      );
    }
  }

interface GroupPageProps {
    data: FeatureInfo[] | null;
    groups: FeatureGroup[] | null;
    handleGroupSelection: Function;
    handleDataChange: Function;
}

class GroupPage extends React.Component<GroupPageProps,{textarea:string,error:string|null, activeGroup:number|null}> {
    constructor(props: GroupPageProps) {
        super(props);
        this.state={textarea: JSON.stringify(this.props.groups,null, 2),error:null,activeGroup:null}
        this.handleTextareaChange = this.handleTextareaChange.bind(this);
        this.handleTextareaChoice = this.handleTextareaChoice.bind(this);
        this.resetTextarea = this.resetTextarea.bind(this);
        this.selectActiveGroup=this.selectActiveGroup.bind(this);
        this.removeGroup=this.removeGroup.bind(this);
        this.removeFromGroup=this.removeFromGroup.bind(this);
        this.addToActiveGroup=this.addToActiveGroup.bind(this);
        
    }
    handleTextareaChange(e : any) {
        this.setState({ textarea: e.target.value,error:null });
    }
    resetTextarea() {

        this.setState({textarea: JSON.stringify(this.props.groups,null, 2),error:null})
    }

    handleTextareaChoice(e : any){
        
        
        let groups = null;
        try {
            groups = JSON.parse(this.state.textarea)
            this.props.handleGroupSelection(groups)  
        }
        catch(error:any) {
            console.log(error)
            this.setState({error:error.message})
            return
        }
        
          
    }
    checkTextareaHasChanged() {
        return JSON.stringify(this.props.groups,null, 2) != this.state.textarea;
    }
    changeGroupName(group_id:number, newName:string){
        // console.log(index,newName)
        if (this.props.groups){
            let newGroups = this.props.groups
            if (newGroups.filter(group=>group.id===group_id).length!==1){
                Error("Group not found or duplicates"+group_id)
            }
            newGroups.filter(group=>group.id===group_id)[0].name=newName
            // console.log(groups)
            this.props.handleGroupSelection(newGroups)
        }
        else {
            return null
        }


    }
    removeGroup(group_id:number){
        
        // const group_id=0;
        const newgroups = this.props.groups?.filter(group => group.id !== group_id);
        const newdata = this.props.data?.map(feature => {
            if (feature.group_id === group_id){
                // console.log({...feature, group_id:null});
                return {...feature, group_id:null};

            }
            else return feature
        })
        this.setState({activeGroup:null})
        this.props.handleDataChange(newdata);
        this.props.handleGroupSelection(newgroups);
    }
    selectActiveGroup(index:number){
        // console.log(index)
        this.setState({activeGroup:index})
    }
    removeFromGroup(feature_name:string){
        const newdata = this.props.data?.map(feature => {
            if (feature.feature_name === feature_name){
                // console.log({...feature, group_id:null});
                return {...feature, group_id:null};

            }
            else return feature
        })
        
        this.props.handleDataChange(newdata);
        return
    }
    addToActiveGroup(feature_name:string) {
        if (this.state.activeGroup === null){
            console.log("no active group to add to");
            return
        }
        const newdata = this.props.data?.map(feature => {
            if (feature.feature_name === feature_name){
                // console.log({...feature, group_id:null});
                return {...feature, group_id:this.state.activeGroup };

            }
            else return feature
        })
        
        this.props.handleDataChange(newdata);
    }
    
    render(){
        // <div className="group">{featureGroup.feature_name} 
        //             <input defaultValue={featureGroup.feature_name}></input> 
        //             <button onClick={this.changeGroupName(featureGroup.feature_name)}>Save</button>
        //         </div>
        // style={{padding:10}}
        // console.log("group page rendered")
        return (
        <>
            <aside className="sidenav">
            <div>{this.props.groups?.map(
                    (featureGroup,i) => <NameChoiceComponent 
                        key={featureGroup.id} 
                        group={featureGroup} 
                        N={this.props.data?.filter(feature=>feature.group_id===featureGroup.id).length || 0} 
                        onChoiceMade={(newName:string)=>this.changeGroupName(featureGroup.id,newName)}
                        onClickGroup={ ()=>this.selectActiveGroup(featureGroup.id)}
                        onRemoveGroup={()=> this.removeGroup(featureGroup.id)} 
                        />
                    )
                }
                </div>
                <br></br>
                <div className="JSON-group-editor">
                    {this.state.error && <pre>error : {this.state.error}</pre>}
                    <div>
                    {this.checkTextareaHasChanged() && <span>Unsaved Changes</span>}
                    </div>
                    

                    <textarea
                    style={{width:300, height:400}}
                    id="data-choice"
                    onChange={this.handleTextareaChange}
                    value={this.state.textarea}
                    />
                    <button onClick={this.handleTextareaChoice}>
                    Confirm 
                    </button>
                    <button onClick={this.resetTextarea}>
                    reset text to groups state
                    </button>
                </div>
            </aside>
            <main className="main maingrid">
                
                <div>
                    { this.props.groups && this.state.activeGroup!==null && 
                    this.props.groups.filter(group=>group.id===this.state.activeGroup).length !== 0 && 
                    
                    <h2> {this.props.groups.filter(group=>group.id===this.state.activeGroup)[0].name}  </h2> }
                    
                
                
                <ul>
                {  this.props.groups && this.props.data && this.state.activeGroup!==null && 
                this.props.groups.filter(group=>group.id===this.state.activeGroup).length !== 0&&
                        // for each feature that is in the active group
                        this.props.data.filter(feature => feature.group_id === this.state.activeGroup).map((feature,i)=>{
                            return(
                            <div className="group-row" key={feature.feature_name}>
                                <div style={{backgroundColor:groupcolor(feature.group_id)}} className="group-colorbar"></div>
                                <div className="group-name">
                                
                                    {feature.feature_name}    
                               
                                </div>
                                <div className="group-buttons">
                                        <div className="iconbutton" onClick={()=>this.removeFromGroup(feature.feature_name)}><Icons icon="X"/></div>
                                </div>
                            </div>)
                        }) 

                }
                        
                        
                        
                        {/* this.props.groups.filter(group => group.id === this.state.activeGroup)[0].map(group=>{
                            this.props.data && this.props.data..features.map(
                                (feature,i) => <li key={i}>{feature}</li> 
                            )}
                        }. */}
                </ul>
                </div>
                <div className="group-search">
                { this.props.groups && this.state.activeGroup!==null && 
                    this.props.groups.filter(group=>group.id===this.state.activeGroup).length !== 0 && 
                    
                    <h2> Add elements to Group "{this.props.groups.filter(group=>group.id===this.state.activeGroup)[0].name}"  </h2> }
                
                {  this.props.groups && this.props.data  && this.state.activeGroup!==null &&  
                this.props.data.filter(feature => feature.group_id === null).map((feature,i)=>{
                            return(
                            <div className="group-row"  key={feature.feature_name}>
                                <div style={{backgroundColor:groupcolor(feature.group_id)}} className="group-colorbar"></div>
                                <div className="group-name">
                                
                                    {feature.feature_name}    
                               
                                </div>
                                <div className="group-buttons">
                                        <div className="iconbutton" onClick={()=>this.addToActiveGroup(feature.feature_name)}><Icons icon="plus"/></div>
                                </div>
                            </div>)
                        })
                        
                        // this.props.data.map((feature,i)=>{
                        //     return <li className="groupName" key={i}><SelectPctAvailGradient featureInfo={feature} showTitle={true} height={20} onSelectFeature={()=>null}/></li>
                        // })
                }

                </div>
                

            </main>

            // testing
            {(this.props.data && this.props.groups) &&
            <FilterFeatures data={this.props.data} groups={this.props.groups} 
                activeGroup={this.props.groups?.filter(group => (group.id === 0))[0]} 
                setData={console.log} setGroups={console.log}/>}
            
        </>
            

        )
    }

    
}

export default GroupPage;