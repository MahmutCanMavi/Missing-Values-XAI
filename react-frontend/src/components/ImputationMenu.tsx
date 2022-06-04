
import React from 'react';
import { FeatureGroup, ImputationMethod } from "../types/feature_types";
import { IMPUTATION_METHODS, Parameter } from '../types/feature_types';
import { groupcolor } from './groupcolor';

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
      
      // default value 0, in case it is not a number
      const new_val=Number(e.target.value) || 0;
      const old_imp_meth = this.props.feature_group.imputation_method
      if (old_imp_meth.parameters!==null){
        let new_imp_meth= {...old_imp_meth,parameters:[...old_imp_meth.parameters.filter(p_old=>p_old.name!==p.name),
        {...p,value:new_val}]}
        this.props.onChange(this.props.feature_group, new_imp_meth);
      }
      
      
    }
  
    render() {
      return(
        
      
        <div  className="group-row">
          <div style={{ backgroundColor: groupcolor(this.props.feature_group.id) }} className="group-colorbar"></div>
          
          <div className="group-name"><label><em>{this.props.feature_group.name}</em>:  </label></div>
          <select name="imputation" value={JSON.stringify(this.props.feature_group.imputation_method)} 
            onChange={this.handleChangeMethod}>
            {
              IMPUTATION_METHODS.map((method,ind) => {
                
              if (method.name===this.props.feature_group.imputation_method.name){
                method=this.props.feature_group.imputation_method;
              }
              return <option key={method.name} value={JSON.stringify(method)}> {method.display_name} </option>
              
              })
            }
          </select>
          

          {this.props.feature_group.imputation_method.parameters?.map(p=>{
            // shows why selection does not work
            console.log(JSON.stringify(this.props.feature_group.imputation_method),JSON.stringify(IMPUTATION_METHODS[1]))
            return <div className='imp-parameter'><label title={p.description}>{p.name}: </label><input type="text" name={p.name} defaultValue={p.value} size={1}
            onChange={(e)=>this.handleChangeParameter(e,p)}/>
            </div>
          })}
          
          
        </div>
      )
    }
}



export { ImputationMenu };