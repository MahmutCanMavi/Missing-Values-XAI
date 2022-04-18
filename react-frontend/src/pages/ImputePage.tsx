import React from "react";
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
}

export default ImputePage;