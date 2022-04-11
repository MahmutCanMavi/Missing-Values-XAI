import React from 'react';
import { FeatureInfo } from '../types/FeatureInfo';
import * as d3 from 'd3' // can create problems with types! if so use the one below

//var d3: any = require('d3')

import { ClusteredFeatures } from '../types/ClusteredFeatures';
import SelectPctAvailGradient from './SelectPctAvailGradient';

type Gradients = {
    clusteredFeatures: ClusteredFeatures;
    showTitle?: boolean;
    onSelect: any;
  }


class StackedGradients extends React.Component<Gradients, {}> {

    current_number : number;
    constructor(props: Gradients) {
        super(props);
        this.current_number = 0;
    }

    choosePct = (event: FeatureInfo) => {
        this.props.onSelect(event);
    }

    render(){
        var total_string;
        total_string = [];
        var arrayLength = this.props.clusteredFeatures.FeatureInfos.length;
        var featureInfosSorted= this.props.clusteredFeatures.FeatureInfos.sort((a, b) => (a.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/a.pct_avail_pp.length < b.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/b.pct_avail_pp.length ? 1 : -1));
        
        for (var i = 0; i < arrayLength; i++) {
            // console.log(this.current_number);
            this.current_number = i; 
            var featureInfo = featureInfosSorted[i];
            var current_text = <SelectPctAvailGradient key={i} featureInfo={featureInfo} showTitle height={28} onMouseDown={this.choosePct.bind(this)} />;
            total_string.push(current_text);
        }

        return (<div className='gradients'>
            {total_string}
            </div>
            )
    }
}

export default StackedGradients
