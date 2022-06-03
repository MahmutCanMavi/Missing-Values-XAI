import { range } from "d3";
import React from "react";
import  { D3DetailSquaresPatient } from "../components/d3detailSquares";
import { FeatureInfo, FeatureGroup, ImputationMethod } from "../types/feature_types";
import { ImputationMenu } from "../components/ImputationMenu";
import ErrorFeatureList from "../components/ErrorFeatureList";




interface ImputePageProps {
    features: FeatureInfo[] | null;
    groups: FeatureGroup[] | null;
    handleImputationScore: Function;
    setGroups: Function;
    setFeatures: Function;
}

class ImputePage extends React.Component<ImputePageProps,{loading:boolean,appError:string}> {
    constructor(props: ImputePageProps) {
        super(props);
        this.changeGroupAttribute = this.changeGroupAttribute.bind(this);
        this.handleImputation = this.handleImputation.bind(this);
        this.state= {loading:false,appError:""};
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

    async handleImputation() {
        
        // Example of how to prepare the data to send it to the backend
        // if (this.props.features && this.props.groups){
        //     let request = {featureInfos: this.props.features.filter(f=>f.group_id!==null).map((f)=>{return {...f,pct_avail_pp:[]}}), 
        //        // groups differ in format: string (name) or object?
        //         groups: this.props.groups.map(g=>{return {...g,imputation_method:g.imputation_method.name}})}
        //     console.log(JSON.stringify(request))
        // }
        // else {
        //     console.log("cannot impute, props are null")
        // }
        this.setState({loading:true})
        try{
        const done= await this.props.handleImputationScore();
        
        if (!done){
            this.setState({loading:false,appError:"Error: imputation failed"})
        }}
        catch {
            this.setState({loading:false,appError:"Error: imputation failed"})
        }
        this.setState({loading:false})
        
        
    }

    render(){
        return <>
        <aside className="sidenav with-padding">
            {this.props.groups && <ImputationMenu groups={this.props.groups} 
                updateGroupOnChange={(group_id: number, imputation_method: ImputationMethod) => 
                    this.changeGroupAttribute(group_id, "imputation_method", imputation_method)}/>}
            <button className="FullWidthButton" disabled={this.state.loading===false?undefined:true} onClick={this.handleImputation}>Impute!</button>
            {this.state.loading===true && <h3><img src="/loading.gif" width={20}></img>Imputing... please wait</h3>}
            {this.state.appError && <span className="uploadError">{this.state.appError}</span>}
        </aside>
        <main className="main">
            <h2>Estimated imputation performance</h2>
            
            {this.props.features && this.props.groups && <ErrorFeatureList 
                    data={this.props.features} 
                    groups={this.props.groups}
                    />}
        </main>
        
        </>
    }
}

export default ImputePage;