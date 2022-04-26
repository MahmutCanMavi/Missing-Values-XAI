import React from "react";
import { FeatureInfo, FeatureGroup } from "../types/feature_types";


interface GroupPageProps {
    data: FeatureInfo[] | null;
    groups: FeatureGroup[] | null;
    handleGroupSelection: Function;
}

class GroupPage extends React.Component<GroupPageProps,{textarea:string,error:string|null}> {
    constructor(props: GroupPageProps) {
        super(props);
        this.state={textarea: JSON.stringify(this.props.groups,null, 2),error:null}
        this.handleChange = this.handleChange.bind(this);
        this.handleChoice = this.handleChoice.bind(this);
        this.resetTextarea = this.resetTextarea.bind(this);
        
    }
    handleChange(e : any) {
        this.setState({ textarea: e.target.value,error:null });
    }
    resetTextarea() {

        this.setState({textarea: JSON.stringify(this.props.groups,null, 2),error:null})
    }
    handleChoice(e : any){
        
        
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
    
    render(){
        return (
        <div style={{padding:10}}>
            Hello Grouping Page.
            {this.state.error && <pre>error : {this.state.error}</pre>}
            
            <div>
            <label htmlFor="data-choice">
            
            </label>
                <textarea
                style={{width:500, height:300}}
                id="data-choice"
                onChange={this.handleChange}
                value={this.state.textarea}
                />
            <button onClick={this.handleChoice}>
            Confirm 
            </button>
            <button onClick={this.resetTextarea}>
            reset text to groups state
            </button>
        </div>
            

        </div>)
    }
    

}

export default GroupPage;