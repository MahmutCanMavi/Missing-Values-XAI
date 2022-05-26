import React from 'react';

import * as d3 from "d3";

import Scatterplot2 from './d3ScatterPlotObservableHQ';
import { tsneDataPoint } from '../types/feature_types';




export default class D3Scatterplot extends React.Component<{tsnedata:tsneDataPoint[]},{}> {
  mySVG: React.MutableRefObject<SVGSVGElement | null>;

  tsnedata:tsneDataPoint[];
  constructor(props:any) {

    super(props);
    this.tsnedata=this.props.tsnedata;
    this.mySVG = React.createRef();
    

    



  }


  componentDidMount() {

    this.update();

  }


  update() {

    var svg = d3.select(this.mySVG.current);

    svg.selectAll("*").remove()


    Scatterplot2(svg,this.tsnedata);

  }


  render() {
    if (this.mySVG.current && this.tsnedata!=this.props.tsnedata){
      this.tsnedata=this.tsnedata
      this.update()
    }
    return (
      <div className="detailView scatterplot">
        <h3>TSNE of the automatic clusters</h3>
        <svg ref={this.mySVG}/>
      </div>
    );

  }

}
