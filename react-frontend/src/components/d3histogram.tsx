import React from 'react';

import * as d3 from "d3";

import Histogram from './d3histogramObservableHQ';
import { FeatureInfo } from '../types/feature_types';

interface D3ComponentProps {
    featureInfo: FeatureInfo;

}
export default class D3Histogram extends React.Component<D3ComponentProps> {
  mySVG: React.MutableRefObject<SVGSVGElement | null>;
  featureInfo: FeatureInfo;

  constructor(props:D3ComponentProps) {

    super(props);
    this.mySVG = React.createRef();
    this.featureInfo=props.featureInfo;
  }


  componentDidMount() {

    this.update();

  }


  update() {

    var svg = d3.select(this.mySVG.current);

    svg.selectAll("*").remove()


    const data = this.featureInfo.pct_avail_pp.map(o=>o.pct_avail).sort()
    Histogram(svg,data)

  }


  render() {
    if (this.mySVG.current && this.featureInfo!=this.props.featureInfo){
      this.featureInfo=this.props.featureInfo
      this.update()
    }
    return (
      <div className="detailView histogram">
        <h3>Feature: {this.props.featureInfo.feature_name}</h3>
        <svg ref={this.mySVG}/>
      </div>
    );

  }

}
