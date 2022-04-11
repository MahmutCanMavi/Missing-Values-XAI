import React from 'react';

import * as d3 from "d3";

import Histogram from './d3histogramObservableHQ';
import { FeatureInfo } from '../types/FeatureInfo';

interface D3ComponentProps {
    featureInfo: FeatureInfo;

}
export default class MyD3Component extends React.Component<D3ComponentProps> {
  mySVG: React.MutableRefObject<SVGSVGElement | null>;
  featureInfo: FeatureInfo;

  constructor(props:D3ComponentProps) {

    super(props);
    this.mySVG = React.createRef();
    this.featureInfo=props.featureInfo;
    console.log(props.featureInfo)
  }


  componentDidMount() {

    this.update();

  }


  update() {

    var svg = d3.select(this.mySVG.current);

    console.log(this.props.featureInfo.feature_name);
    const data = this.featureInfo.pct_avail_pp.map(o=>o.pct_avail).sort()
    Histogram(svg,data)

  }


  render() {

    return (
      <div className="detailView histogram">
        <h3>Feature: {this.props.featureInfo.feature_name}</h3>
        <svg ref={this.mySVG}/>
      </div>
    );

  }

}
