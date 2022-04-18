import React from "react";
import { FeatureInfo, FeatureGroup } from "../types/feature_types";

interface GroupPageProps {
    data: FeatureInfo[] | null;
    groups: FeatureGroup[] | null;
    handleGroupSelection: Function;
}

class GroupPage extends React.Component<GroupPageProps,{}> {
    constructor(props: GroupPageProps) {
        super(props);
    }
}

export default GroupPage;