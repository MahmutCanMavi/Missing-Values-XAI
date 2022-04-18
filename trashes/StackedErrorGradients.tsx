import React from 'react';
import { FeatureInfo } from '../types/FeatureInfo';
import * as d3 from 'd3' // can create problems with types! if so use the one below
//var d3: any = require('d3')
import ErrorGradient from './ErrorGradient';

import { ClusteredErrors } from '../types/ClusteredErrors';
interface totalProps {
    clusteredFeatures: ClusteredErrors;
    showTitle?: boolean; // enable or disable to show the feature name
   // width, height are defined in index.css
}
const StackedGradients: React.FC<totalProps> = ({clusteredFeatures, showTitle=true}:totalProps) => {
    var total_string;
    total_string = [];

    
    var arrayLength = clusteredFeatures.ErrorInfos.length;
    
    // sorting by cluster
    //featureInfosSorted= clusteredFeatures.FeatureInfos.sort((a, b) => (a.cluster_id > b.cluster_id) ? 1 : -1);
    
    // sorting by avg pct avail
    var featureInfosSorted= clusteredFeatures.ErrorInfos.sort((a, b) => (a.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/a.pct_avail_pp.length < b.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/b.pct_avail_pp.length ? 1 : -1));
    
    for (var i = 0; i < arrayLength; i++) {
        var featureInfo = featureInfosSorted[i];
        var current_text = <ErrorGradient key={i} featureInfo={featureInfo} showTitle height={20} />;
        total_string.push(current_text);
    }

    // return(total_string);
    return (<div className='gradients'>
        {total_string}
        </div>
        )
}


export default StackedGradients
