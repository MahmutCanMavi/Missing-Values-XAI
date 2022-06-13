import React from 'react';
import  {FeatureGroup, FeatureInfo, tsneDataPoint} from '../types/feature_types';
import D3Scatterplot from './d3scatterplot';
//import * as d3 from 'd3' // can create problems with types! if so use the one below
//var d3: any = require('d3')





interface ClusterVizProps {
    tsnedata: tsneDataPoint[];
    // features: FeatureInfo[];
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
        // let new_tsnedata=this.props.tsnedata.map(t=>{
        //     let in_features=this.props.features.filter(f=>f.feature_name===t.feature_name)
        //     if (in_features.length!==1 || in_features[0].group_id === null){
        //         return t
        //     }
        //     else{
        //         return {...t, group_id: in_features[0].group_id}
        //     }
        // })
        // console.log(new_tsnedata.filter(f=>f.feature_name==="pCO2")[0].group_id)

        return (<>

            <D3Scatterplot tsnedata={this.props.tsnedata}/>
        </>)
    }
}

export default ClusterViz
