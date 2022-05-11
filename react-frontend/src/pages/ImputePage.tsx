import { range } from "d3";
import React from "react";
import  { D3DetailSquaresPatient } from "../components/d3detailSquares";
import { FeatureInfo, FeatureGroup } from "../types/feature_types";
import { ImputationMenu } from "../components/ImputationMenu";

interface ImputePageProps {
    data: FeatureInfo[] | null;
    groups: FeatureGroup[] | null;
    handleImputationScore: Function;
}



class ImputePage extends React.Component<ImputePageProps,{}> {
    constructor(props: ImputePageProps) {
        super(props);
    }
    render(){
        return <>
        <aside className="sidenav">
            {this.props.groups && <ImputationMenu groups={this.props.groups}/>}
        </aside>
        <main className="main">
            <h3>Visualize Imputation Performance Here!</h3>
        </main>
        
        </>
    }
}

export default ImputePage;