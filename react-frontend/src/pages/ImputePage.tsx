import React from "react";
import D3Scatterplot from "../components/d3scatterplot";
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
        <main className="main"><D3Scatterplot/></main>
        
        </>
    }
}

export default ImputePage;