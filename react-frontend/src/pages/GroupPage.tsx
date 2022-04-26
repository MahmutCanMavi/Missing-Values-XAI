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
    render(){
        return (
        <div>
            Hello Grouping Page.
            {this.props.groups && <pre>has groups: {JSON.stringify(this.props.groups,null, 2)}</pre>}
            
            

        </div>)
    }
}

export default GroupPage;