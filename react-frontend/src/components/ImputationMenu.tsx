import { METHODS } from 'http';
import React from 'react';
import { FeatureGroup } from "../types/feature_types";
import { IMPUTATION_METHODS } from '../types/feature_types';

// ImputationMenu: component to choose imputation method for all feature groups
class ImputationMenu extends React.Component<{ groups: FeatureGroup[] },{}> {
    constructor(props: { groups: FeatureGroup[] }) {
      super(props);
    }
  
    render() {
      return (
        <div className="ImputationMenu">
          <h3>Choose Imputation Methods</h3>
          {
            this.props.groups.map((grp,ind) => <ImputationOptions feature_group={grp}/>)
          }
      </div>
      )
    }
}
  
// ImputationOptions: component to choose imputation method for a single FeatureGroup
class ImputationOptions extends React.Component<{feature_group: FeatureGroup},{chosen_method: string}> {

    constructor(props: { feature_group: FeatureGroup }) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {chosen_method: this.props.feature_group.imputation_method.name}; // initialize chosen method to first method
    }

    handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState((state,props) => ({chosen_method: e.target.value}));
        console.log(this.state);
    }
  
    render() {
      return(
        <div style={{margin: "10px"}} className="ImputationOptions">
          <label>{this.props.feature_group.name}:  </label>
          <select name="imputation" onChange={this.handleChange}>
            {
              IMPUTATION_METHODS.map((method,ind) => <option value={method.name}> {method.name} </option>)
            }
          </select>
        </div>
      )
    }
}

export { ImputationMenu };