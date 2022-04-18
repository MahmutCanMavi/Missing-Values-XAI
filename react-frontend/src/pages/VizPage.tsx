import React from "react";
import { FeatureInfo, FeatureGroup } from "../types/feature_types";

interface VizPageProps {
    data: FeatureInfo[] | null;
    groups: FeatureGroup[] | null;
    handleDataUpload: Function;
}

class VizPage extends React.Component<VizPageProps,{}> {
    constructor(props: VizPageProps) {
        super(props);
    }
}

export default VizPage;