import React from 'react';

import * as d3 from "d3";

import Scatterplot2 from './d3ScatterPlotObservableHQ';
import { FeatureInfo } from '../types/feature_types';



interface D3ComponentProps {
    featureInfo: FeatureInfo;

}
export default class D3Scatterplot extends React.Component<{scatterdata:any},{}> {
  mySVG: React.MutableRefObject<SVGSVGElement | null>;
  featureInfo: FeatureInfo;
  cars:any;
  scatterdata:any;
  constructor(props:any) {

    super(props);
    this.scatterdata=this.props.scatterdata;
    this.mySVG = React.createRef();
    this.featureInfo={"feature_name":"Cars","group_id":0,"description":"description 1: lorem ipsum dolores supametrarekdjfnkadn fsdflkajns lkfjadf","imputation_error":null,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.2},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}]};
    this.cars =  [ {name: "Mazda RX4", mpg: 30, cyl: 6, disp: 160, hp: 150, drat: 3.9, wt: 2.62, qsec: 16.46, vs: 0, am: 1, group_id: 1, carb: 4},
             {name: "Mazda RX4 Wag", mpg: 21, cyl: 6, disp: 160, hp: 110, drat: 3.9, wt: 2.875, qsec: 17.02, vs: 0, am: 1, group_id: 2, carb: 4},
             {name: "Merc 240D", mpg: 24.4, cyl: 4, disp: 146.7, hp: 62, drat: 3.69, wt: 3.19, qsec: 20, vs: 1, am: 0, group_id: 3, carb: 2}

      ] ;

    



  }


  componentDidMount() {

    this.update();

  }


  update() {

    var svg = d3.select(this.mySVG.current);

    svg.selectAll("*").remove()


    const data = this.featureInfo.pct_avail_pp.map(o=>o.pct_avail).sort()
    Scatterplot2(svg,this.scatterdata);

  }


  render() {
    if (this.mySVG.current && this.featureInfo!=this.featureInfo){
      this.featureInfo=this.featureInfo
      this.update()
    }
    return (
      <div className="detailView histogram">
        <h3>Feature: {this.featureInfo.feature_name}</h3>
        <svg ref={this.mySVG}/>
      </div>
    );

  }

}
