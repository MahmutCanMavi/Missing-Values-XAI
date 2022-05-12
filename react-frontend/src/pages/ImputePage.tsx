import { range } from "d3";
import React from "react";
import  { D3DetailSquaresPatient } from "../components/d3detailSquares";
import { FeatureInfo, FeatureGroup, ImputationMethod } from "../types/feature_types";
import { ImputationMenu } from "../components/ImputationMenu";

interface ImputePageProps {
    data: FeatureInfo[] | null;
    groups: FeatureGroup[] | null;
    handleImputationScore: Function;
    setGroups: Function;
    setFeatures: Function;
}

class ImputePage extends React.Component<ImputePageProps,{}> {
    constructor(props: ImputePageProps) {
        super(props);
        this.changeGroupAttribute = this.changeGroupAttribute.bind(this);
        this.handleImputation = this.handleImputation.bind(this);
    }

    changeGroupAttribute(group_id: number | null, attribute_name: string, new_value: any) {
        if (this.props.groups && (group_id !== null)) {
            let newGroups = this.props.groups
            if (newGroups.filter(group => group.id === group_id).length !== 1) {
                Error("Group not found or duplicates" + group_id)
            }

            // check if attribute exists, if yes set its new value
            if (Object.keys(this.props.groups[0]).includes(attribute_name)) {
                console.log("got here!");
                (newGroups.filter(group => group.id === group_id)[0])[
                    attribute_name as "imputation_method" | "name"] = new_value;
            } else {
                throw new Error("specified invalid attribute of FeatureGroup");
            }

            this.props.setGroups(newGroups)
        }
        else {
            return null
        }
    }

    handleImputation() {
        console.log("clicked the Impute! button");
    }

    render(){
        return <>
        <aside className="sidenav">
            {this.props.groups && <ImputationMenu groups={this.props.groups} 
                updateGroupOnChange={(group_id: number, imputation_method: ImputationMethod) => 
                    this.changeGroupAttribute(group_id, "imputation_method", imputation_method)}/>}
            <button className="FullWidthButton" onClick={this.handleImputation}>Impute!</button>
        </aside>
        <main className="main">
            <h3>Visualize Imputation Performance Here!</h3>
        </main>
        
        </>
    }
}

export default ImputePage;