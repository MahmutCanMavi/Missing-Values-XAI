import { METHODS } from 'http';
import React from 'react';
import { FeatureGroup, ImputationMethod } from "../types/feature_types";
import { IMPUTATION_METHODS } from '../types/feature_types';

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
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
      this.props.onChange(this.props.feature_group, JSON.parse(e.target.value));
    }
  
    render() {
      return(
        <div style={{margin: "10px"}} className="ImputationOptions">
          <label><em>{this.props.feature_group.name}</em>:  </label>
          <select name="imputation" value={JSON.stringify(this.props.feature_group.imputation_method)} 
            onChange={this.handleChange}>
            {
              IMPUTATION_METHODS.map((method,ind) => <option value={JSON.stringify(method)}> {method.name} </option>)
            }
          </select>
        </div>
      )
    }
}

export { ImputationMenu };