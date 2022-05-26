import { METHODS } from 'http';
import React from 'react';
import { FeatureGroup, ImputationMethod } from "../types/feature_types";
import { IMPUTATION_METHODS } from '../types/feature_types';

// ImputationMenu: component to choose imputation method for all feature groups
class ClusterMenu extends React.Component<{},{}> {
    constructor() {
      super({});
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(group: FeatureGroup, imputation_method: ImputationMethod) {
    //   this.props.updateGroupOnChange(group.id, imputation_method);
    return
    }

    render() {
      return (
        <div className="ClusterMenu">
          <h3>Choose Cluster Method</h3>
          <div style={{margin: "10px"}} className="ImputationOptions">
          <label><em>Dimension reduction</em>:  </label>
                <select name="imputation"  >
                     <option value={""}> tnse </option>
                     <option value={""}> umap </option>

                </select>
            </div>
            <div style={{margin: "10px"}} className="ImputationOptions">
                <label><em>Transformation method</em>:  </label>
                <select name="imputation"  >
                     <option value={""}> one </option>
                     <option value={""}> two </option>
                     <option value={""}> three </option>
                </select>
            </div>
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

export default ClusterMenu;