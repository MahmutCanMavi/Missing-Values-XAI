import React from 'react';
import  {FeatureInfo, tsneDataPoint} from '../types/feature_types';
import D3Scatterplot from './d3scatterplot';
//import * as d3 from 'd3' // can create problems with types! if so use the one below
//var d3: any = require('d3')





interface ClusterVizProps {
    tsnedata: tsneDataPoint[];
  }


class ClusterViz extends React.Component<ClusterVizProps, {}> {
    constructor(props: ClusterVizProps) {
        super(props);
        
        //this.onSelectFeature = this.onSelectFeature.bind(this)
    }



    render(){

        //console.log("props",typeof(this.props.clusteredFeatures));
        //console.log("infos",this.props.clusteredFeatures.FeatureInfos);
         // sorting by cluster
        //featureInfosSorted= clusteredFeatures.FeatureInfos.sort((a, b) => (a.cluster_id > b.cluster_id) ? 1 : -1);
        

        return (<>

            <D3Scatterplot tsnedata={this.props.tsnedata}/>
        </>)
    }
}

export default ClusterViz
