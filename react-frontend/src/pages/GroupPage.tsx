import React from "react";
import { FeatureInfo, FeatureGroup } from "../types/feature_types";



class NameChoiceComponent extends React.Component<{onChoiceMade: any, oldtext:string, onClickGroup:any}, {text: string,isEditing:boolean}>{

    constructor(props: any) {
      super(props);
      this.state = {text: this.props.oldtext, isEditing:false};
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
        <div className="groupName" onClick={this.props.onClickGroup}>
          {this.state.isEditing==false &&<><label htmlFor="data-choice">
            {this.props.oldtext}    
          </label><span>&nbsp;&nbsp;</span>
          <button onClick={()=>this.setState({isEditing:true})}>edit</button>
          </>
            }
          {this.state.isEditing && <> <input
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
}

class GroupPage extends React.Component<GroupPageProps,{textarea:string,error:string|null, activeGroup:number|null}> {
    constructor(props: GroupPageProps) {
        super(props);
        this.state={textarea: JSON.stringify(this.props.groups,null, 2),error:null,activeGroup:null}
        this.handleTextareaChange = this.handleTextareaChange.bind(this);
        this.handleTextareaChoice = this.handleTextareaChoice.bind(this);
        this.resetTextarea = this.resetTextarea.bind(this);
        this.selectActiveGroup=this.selectActiveGroup.bind(this);
        
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
    changeGroupName(index:number, newName:string){
        // console.log(index,newName)
        if (this.props.groups){
            let newGroups = this.props.groups
            newGroups[index].name=newName
            // console.log(groups)
            this.props.handleGroupSelection(newGroups)
        }
        else {
            return null
        }


    }
    selectActiveGroup(index:number){
        // console.log(index)
        this.setState({activeGroup:index})
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
                Hello Grouping Page.
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
            </aside>
            <main className="main">
                <div>{this.props.groups?.map(
                    (featureGroup,i) => <NameChoiceComponent 
                        key={i} 
                        oldtext={featureGroup.name} 
                        onChoiceMade={(newName:string)=>this.changeGroupName(i,newName)}
                        onClickGroup={ ()=>this.selectActiveGroup(i) } />
                    )
                }
                </div>
                <div>
                    { this.props.groups && this.state.activeGroup!=null && <> {this.props.groups[this.state.activeGroup].name}  has the following features </> }
                     

                <ul>
                {  this.props.groups && this.state.activeGroup!=null && 
                        this.props.groups[this.state.activeGroup].features.map(
                            (feature,i) => <li key={i}>{feature}</li> 
                        )}
                </ul>
                </div>

            </main>
            
        </>
            

        )
    }

    
}

export default GroupPage;