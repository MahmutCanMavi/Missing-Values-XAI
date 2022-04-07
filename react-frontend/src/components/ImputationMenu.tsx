import React from 'react';

// Type for Feature Group
type FeatureGroup = {
    name: string, // name of the group, for example "Cluster1"
    features: string[] // features contained in the group
  }

// ImputationMenu: component to choose imputation method for all feature groups
class ImputationMenu extends React.Component<{ groups: FeatureGroup[] },{}> {
    constructor(props: { groups: FeatureGroup[] }) {
      super(props);
    }
  
    render() {
      return (
        <div className="ImputationMenu">
          {
            this.props.groups.map((grp,ind) => <ImputationOptions feature_group={grp}/>)
          }
      </div>
      )
    }
}
  
// ImputationOptions: component to choose imputation method for a single FeatureGroup
class ImputationOptions extends React.Component<{feature_group: FeatureGroup},{chosen_method: string}> {
    imputation_methods: string[];
  
    constructor(props: { feature_group: FeatureGroup }) {
      super(props);
      this.imputation_methods = ["Method1", "Method2", "Method3"];
      this.handleChange = this.handleChange.bind(this);
      this.state = {chosen_method: this.imputation_methods[0]}; // initialize chosen method to first method
    }

    handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState((state,props) => ({chosen_method: e.target.value}));
        console.log(this.state);
    }
  
    render() {
      return(
        <div style={{margin: "10px"}} className="ImputationOptions">
          <label style={{padding: "10px"}}>Select the Imputation Method for {this.props.feature_group.name}:</label>
          <select name="imputation" onChange={this.handleChange}>
            {
              this.imputation_methods.map((val,ind) => <option value={val}> {val} </option>)
            }
          </select>
          <label style={{padding: "10px"}}> {this.state.chosen_method} </label>
        </div>
      )
    }
}

export default ImputationMenu;