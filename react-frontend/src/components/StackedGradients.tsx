import React from 'react';
import  {FeatureInfo} from '../types/feature_types';
//import * as d3 from 'd3' // can create problems with types! if so use the one below
//var d3: any = require('d3')


import SelectPctAvailGradient from './SelectPctAvailGradient';


type Gradients = {
    data: FeatureInfo[];
    showTitle?: boolean;
    onSelectFeature: Function;
  }


class StackedGradients extends React.Component<Gradients, {}> {

    current_number : number;
    constructor(props: Gradients) {
        super(props);
        this.current_number = 0;
        //this.onSelectFeature = this.onSelectFeature.bind(this)
    }

    onSelectFeature = (event: FeatureInfo) => {
        this.props.onSelectFeature(event);
    }

    render(){

        //console.log("props",typeof(this.props.clusteredFeatures));
        //console.log("infos",this.props.clusteredFeatures.FeatureInfos);
         // sorting by cluster
        //featureInfosSorted= clusteredFeatures.FeatureInfos.sort((a, b) => (a.cluster_id > b.cluster_id) ? 1 : -1);
        
        // sorting by avg pct avail
        const featureInfosSorted= this.props.data.sort((a, b) => (a.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/a.pct_avail_pp.length < b.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/b.pct_avail_pp.length ? 1 : -1));
        
       
        return (<>
            <div className="gradientLegend"><svg height={40}><rect height={30} width={30} fill="black"></rect><text height={130} width={130} x={40} y={20}>100% Missing</text>
                   <rect height={30} width={30} x={150} fill="white"></rect><text height={130} width={130} x={190} y={20}>100% Available</text></svg></div>
            <div className='gradients'>
                {featureInfosSorted.map((featureInfo,i)=>

                    <SelectPctAvailGradient key={featureInfo.feature_name} featureInfo={featureInfo} 
                    showTitle height={28} onSelectFeature={this.onSelectFeature} />            
                    
                    )
                }
            </div>
        </>)
    }
}

export default StackedGradients
