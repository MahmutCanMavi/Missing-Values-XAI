import React from 'react';

import * as d3 from "d3";


import { FeatureInfo } from '../types/feature_types';
import queryBackend from '../backend/BackendQueryEngine';
import DetailSquares from './d3detailSquaresHQ';



interface D3ComponentProps {
    featureInfo: FeatureInfo;

}
export default class D3DetailSquares extends React.Component<D3ComponentProps,{}> {
  mySVG: React.MutableRefObject<SVGSVGElement | null>;
  featureInfo: FeatureInfo;
  
  constructor(props:D3ComponentProps) {

    super(props);
    this.mySVG = React.createRef();
    this.featureInfo=this.props.featureInfo;

    



  }


  componentDidMount() {

    this.update();

  }


  async update() {

    var svg = d3.select(this.mySVG.current);

    svg.selectAll("*").remove()

    const data = await queryBackend("get-fulldata?feature_name="+this.featureInfo.feature_name)
    console.log(data)
    // const data = this.featureInfo.pct_avail_pp.map(o=>o.pct_avail).sort()
    DetailSquares(svg,data);

  }


  render() {
    if (this.mySVG.current && this.featureInfo!=this.props.featureInfo){
      this.featureInfo=this.props.featureInfo
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
