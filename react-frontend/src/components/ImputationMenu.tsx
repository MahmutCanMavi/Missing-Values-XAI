import { METHODS } from 'http';
import React from 'react';
import { FeatureGroup, ImputationMethod } from "../types/feature_types";
import { IMPUTATION_METHODS, Parameter } from '../types/feature_types';

// ImputationMenu: component to choose imputation method for all feature groups
class ImputationMenu extends React.Component<{ groups: FeatureGroup[], updateGroupOnChange: Function },{}> {
    constructor(props: { groups: FeatureGroup[], updateGroupOnChange: Function }) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(group: FeatureGroup, imputation_method: ImputationMethod) {
      this.props.updateGroupOnChange(group.id, imputation_method);
    }

    render() {
      return (
        <div className="ImputationMenu">
          <h3>Choose Imputation Methods</h3>
          {
            this.props.groups.map((grp,ind) => <ImputationOptions feature_group={grp} 
                                                  onChange={this.handleChange}/>)
          }
      </div>
      )
    }
}
  
// ImputationOptions: component to choose imputation method for a single FeatureGroup
class ImputationOptions extends React.Component<{feature_group: FeatureGroup, onChange: Function},{}> {

    constructor(props: {feature_group: FeatureGroup, onChange: Function}) {
      super(props);
      this.handleChangeMethod = this.handleChangeMethod.bind(this);
      this.handleChangeParameter= this.handleChangeParameter.bind(this);
    }

    handleChangeMethod(e: React.ChangeEvent<HTMLSelectElement>) {
      this.props.onChange(this.props.feature_group, JSON.parse(e.target.value));
    }
    handleChangeParameter(e: React.ChangeEvent<HTMLInputElement>,p:Parameter) {
      // this.props.onChange(this.props.feature_group, JSON.parse(e.target.value));
      console.log(e.target.value,p,this.props.feature_group)
      const new_val=e.target.value
      const old_imp_meth = this.props.feature_group.imputation_method
      if (old_imp_meth.parameters!==null){
        let new_imp_meth= {...old_imp_meth,parameters:[...old_imp_meth.parameters.filter(p_old=>p_old.name!==p.name),
        {...p,value:new_val}]}
        // console.log({...this.props.feature_group,imputation_method:new_imp_meth})
        this.props.onChange(this.props.feature_group, new_imp_meth);
      }
      
      
    }
  
    render() {
      return(
        <div style={{margin: "10px"}} className="ImputationOptions">
          <label><em>{this.props.feature_group.name}</em>:  </label>
          <select name="imputation" value={JSON.stringify(this.props.feature_group.imputation_method)} 
            onChange={this.handleChangeMethod}>
            {
              IMPUTATION_METHODS.map((method,ind) => <option value={JSON.stringify(method)}> {method.name} </option>)
            }
          </select>
          

          {this.props.feature_group.imputation_method.parameters?.map(p=>{
            console.log(JSON.stringify(this.props.feature_group.imputation_method),JSON.stringify(IMPUTATION_METHODS[1]))
            return <div className='imp-parameter'><label title={p.description}>{p.name}: </label><input type="text" name={p.name} defaultValue={p.value} size={1}
            onChange={(e)=>this.handleChangeParameter(e,p)}/>
            </div>
          })}
          
          
        </div>
      )
    }
}

class TextChoice extends React.Component<{onChoiceMade: any}, {text: string}>{

  constructor(props: any) {
    super(props);
    this.state = {text: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
  }

  render() { // Old Text: Which feature do you want to use? (adre_bol, adre_iv, PAPs, HR, CVPm, PVR, urine, Na, temp, pH, pO2)
        
    return (
      <div>
        <label htmlFor="data-choice">
          Number of clusters. Clusters are shown as colored dots.    
        </label>
        <input
          id="data-choice"
          onChange={this.handleChange}
          value={this.state.text}
        />
        <button onClick={this.handleChoice}>
          Confirm 
        </button>
      </div>
    );
  }

  handleChange(e : any) {
    this.setState({ text: e.target.value});
  }

  handleChoice(e : any){
    console.log('Previous state: ', this.state);
    console.log('text: ', this.state.text);
    this.props.onChoiceMade(this.state.text);
    /*this.setState({
      text: '',
    }); */           
  }
}

export { ImputationMenu };