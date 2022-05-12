import React from 'react';

import * as d3 from "d3";


import { FeatureInfo } from '../types/feature_types';
import queryBackend from '../backend/BackendQueryEngine';
import DetailSquares from './d3detailSquaresHQ';



interface D3ComponentProps {
    featureInfo: FeatureInfo;
    setSelectedPatient: Function;

}
class D3DetailSquares extends React.Component<D3ComponentProps,{}> {
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
    
    let ylabel= "patient_id" 
    // const data = this.featureInfo.pct_avail_pp.map(o=>o.pct_avail).sort()
    DetailSquares(svg,data,ylabel,this.props.setSelectedPatient);
    console.log(this.props.setSelectedPatient)

  }

  
  render() {
    if (this.mySVG.current && this.featureInfo!=this.props.featureInfo){
      this.featureInfo=this.props.featureInfo
      this.update()
    }
    return (
      <div className="detailView d3detailSquares d3detailSquares-feature">
        <h3>Feature: {this.featureInfo.feature_name}</h3>
        <svg ref={this.mySVG}/>
      </div>
    );

  }



}




interface D3ComponentPropsPat {
  patient_id: number;
  

}
export class D3DetailSquaresPatient extends React.Component<D3ComponentPropsPat,{}> {
mySVG: React.MutableRefObject<SVGSVGElement | null>;
patient_id: number;

constructor(props:D3ComponentPropsPat) {

  super(props);
  this.mySVG = React.createRef();
  this.patient_id=this.props.patient_id;

  



}


componentDidMount() {

  this.update();

}


async update() {
  

  var svg = d3.select(this.mySVG.current);


  svg.selectAll("*").remove()

  let data = await queryBackend("get-fulldata-patient?patient_id="+this.patient_id) as any;
  // data.values= data.values.map((r: any[])=>r.map((v: string)=>typeof(v)==="string"?v.charCodeAt(0):v))
  let ylabel= "feature name"
  // const data = this.featureInfo.pct_avail_pp.map(o=>o.pct_avail).sort()
  DetailSquares(svg,data,ylabel); 

}


render() {
  
  if (this.mySVG.current && this.patient_id!=this.props.patient_id){
    this.patient_id=this.props.patient_id
    this.update()
  }
  return (
    <div className="detailView d3detailSquares patient">
      <h3>Patient: {this.patient_id} (Experimental feature of the app)</h3>  
      <svg ref={this.mySVG}/>
    </div>
  );

}

}

export default D3DetailSquares
