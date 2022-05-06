import React from "react";
import  { D3DetailSquaresPatient } from "../components/d3detailSquares";
import { FeatureInfo, FeatureGroup } from "../types/feature_types";

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
        <aside className="sidenav"><h1>Scatterplot Test</h1> No Imputing is happening yet. Only for testing the scatterplot viz</aside>
        <main className="main"><D3DetailSquaresPatient patient_id={122}/></main>
        
        </>
    }
}

export default ImputePage;