import React from 'react';
import { FeatureInfo } from '../types/FeatureInfo';
import * as d3 from 'd3' // can create problems with types! if so use the one below
import { text } from 'd3';
//var d3: any = require('d3')
import ErrorInfo from './ErrorInfo';
import { ClusteredFeatures } from '../types/ClusteredFeatures';
import { ClusteredErrors } from '../types/ClusteredErrors';
interface totalProps {
    clusteredFeatures: ClusteredFeatures | ClusteredErrors;
    showTitle?: boolean; // enable or disable to show the feature name
   // width, height are defined in index.css
}
const StackedGradients: React.FC<totalProps> = ({clusteredFeatures, showTitle=true}:totalProps) => {
    var total_string;
    total_string = [];
    // Here we assume that there are 3 features
    // const number = 5;
    // var height = Math.round(160/number);
    //for (let i = 0; i < number; i++) {
    //    var current_text; 
        // "key" is needed by react otherwise it complains
    //    current_text = <PctAvailGradient key={i} featureInfo={featureInfo} showTitle height={height} />;
    //    total_string.push(current_text);
    //  }
    // const tem = "</>"
    //total_string += tem;

    var arrayLength = clusteredFeatures.FeatureInfos.length;
    
    // sorting by cluster
    //featureInfosSorted= clusteredFeatures.FeatureInfos.sort((a, b) => (a.cluster_id > b.cluster_id) ? 1 : -1);
    
    // sorting by avg pct avail
    var featureInfosSorted= clusteredFeatures.FeatureInfos.sort((a, b) => (a.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/a.pct_avail_pp.length < b.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/b.pct_avail_pp.length ? 1 : -1));
    
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

    //return (<><div > {/* containing div with css class for styling */}
    //            {showTitle && <h3>{title}</h3>}
    //            <svg className="pctAvailGradient" width="100%" viewBox={"0 0 " + data.length + " 10"} preserveAspectRatio="none">${
    //                data.map((val, idx, arr) => (<rect x={idx} key={idx} width="2" height="10" fill={color(val)}></rect>))
    //            }</svg>
    //        </div>
    //        <div > {/* containing div with css class for styling */}
    //            {showTitle && <h3>{title}</h3>}
    //            <svg className="pctAvailGradient" width="100%" viewBox={"0 0 " + data.length + " 10"} preserveAspectRatio="none">${
    //                data.map((val, idx, arr) => (<rect x={idx} key={idx} width="2" height="10" fill={color(val)}></rect>))
    //            }</svg>
    //        </div>
    //        </>
    //        )
}


export default StackedGradients
