import React from "react";
import { FeatureInfo, FeatureGroup } from '../types/feature_types';
import '../App.css';
import Icons from "./icons";
import SelectPctAvailGradient from "./SelectPctAvailGradient";

import {groupcolor} from './groupcolor'



interface FilterFeaturesProps {
    data: FeatureInfo[],
    setData: Function, 
    groups: FeatureGroup[], 
    activeGroup: FeatureGroup, 
    setGroups: Function, 
    addToActiveGroup:Function,
}

interface FilterFeaturesState {
    textInput: string;
    selectedFeatures: FeatureInfo[];
    mode: "normal" | "startsWith" | "endsWith";
}

class FilterFeatures extends React.Component<FilterFeaturesProps,FilterFeaturesState> {
    constructor(props: FilterFeaturesProps) {
        super(props);
        this.handleAddAll = this.handleAddAll.bind(this);
        this.updateSelectedFeatures = this.updateSelectedFeatures.bind(this);
        this.toggleMode = this.toggleMode.bind(this);
        this.state = {textInput: "", selectedFeatures: this.props.data, mode: "normal"};
    }

    updateSelectedFeatures(input: string, mode: "normal" | "startsWith" | "endsWith") {
        // filter features to include only the features containing input string
        const filteredFeatures = this.props.data.filter(
            feature_info => {
                if (mode === "normal") {
                    return feature_info.feature_name.includes(input);
                } else if (mode === "startsWith") {
                    return feature_info.feature_name.startsWith(input);
                } else if (mode === "endsWith") {
                    return feature_info.feature_name.endsWith(input);
                }
            });
        this.setState({selectedFeatures: filteredFeatures, textInput: input, mode: mode});
    }

    handleAddAll(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        // set group id of selected features to the id of activeGroup
        const selected_features_names = this.state.selectedFeatures.map(feat => feat.feature_name);
        const new_data = this.props.data.map(
            (feature_info) => {
                if (selected_features_names.includes(feature_info.feature_name)) {
                    return {...feature_info, group_id: this.props.activeGroup.id};
                } else {
                    return feature_info;
                }
            }
        )
        // pass the changes in the data upwards
        this.props.setData(new_data);

        // if using a filter, record filter usage in "filter" attribute of activeGroup
        if (this.state.mode !== "normal") {
            


            const new_groups = this.props.groups.map(
                group => {
                    if (group.id === this.props.activeGroup.id) {
                        
                        const filter: string = this.state.mode + ": " + this.state.textInput;
                        const previous_filters = group.filters
                        // check if filters is still undefined
                        const new_filters = previous_filters ? [...previous_filters, filter] : [filter];
                        return {...group, filters: new_filters};
                    } else {
                        return group;
                    }
                }
            );
            console.log(new_groups)
            this.props.setGroups(new_groups);
        }
    }

    toggleMode(mode: "normal" | "startsWith" | "endsWith") {
        if (this.state.mode === mode) {
            this.setState({mode: "normal"});
            return "normal";
        } else {
            this.setState({mode: mode});
            return mode;
        }
    }



    render() {
        return (
            <div>
                <input type="text" onChange={(e) => this.updateSelectedFeatures(
                    e.target.value, this.state.mode)}></input>
                <button className={this.state.mode === "startsWith" ? "active" : "inactive"}
                    onClick={() => this.updateSelectedFeatures(
                        this.state.textInput, this.toggleMode("startsWith"))}>Starts With</button>

                <button className={this.state.mode === "endsWith" ? "active" : "inactive"}
                    onClick={() => this.updateSelectedFeatures(
                        this.state.textInput, this.toggleMode("endsWith"))}>Ends With</button>

                <button onClick={this.handleAddAll}>Add All</button>
                <FeatureList features={this.state.selectedFeatures} addToActiveGroup={this.props.addToActiveGroup}/>


            </div>
        )
    }
}


class FeatureList extends React.Component<{features: FeatureInfo[], addToActiveGroup:Function},{}> {
    constructor(props:{features: FeatureInfo[], addToActiveGroup:Function}) {
        super(props);
    }

    render() {
        return (
            <div className="feature-list">
                { this.props.features.map(feature => 
                    <div className="feature-row"  key={feature.feature_name}>
                                <div style={{backgroundColor:groupcolor(feature.group_id)}} className="feature-colorbar"></div>
                                <div className="feature-name">
                                
                                    {feature.feature_name}    
                               
                                </div>
                                <SelectPctAvailGradient featureInfo={feature} height={20} onSelectFeature={() => null} />
                                <div className="feature-buttons">
                                        <div className="iconbutton" onClick={()=>this.props.addToActiveGroup(feature.feature_name)}><Icons icon="plus"/></div>
                                </div>
                            </div>
                ) }
            </div>
            
        )
    }
}

export default FilterFeatures;