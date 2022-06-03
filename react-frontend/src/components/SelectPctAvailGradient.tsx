import React from 'react';
import { FeatureInfo } from '../types/feature_types';
import * as d3 from 'd3' // can create problems with types! if so use the one below
//var d3: any = require('d3')
import ReactDOM from 'react-dom';


type SingleBar = {
    featureInfo: FeatureInfo;
    showTitle?: boolean; // enable or disable to show the feature name
    height: number;
    onSelectFeature: any;
  }


class SelectPctAvailGradient extends React.Component<SingleBar,{}> {
    
    featureInfo: FeatureInfo;
    showTitle?: boolean;
    height: number;

    constructor(props: SingleBar) {
        super(props);
        this.featureInfo = this.props.featureInfo;
        this.showTitle = this.props.showTitle;
        this.height = this.props.height;
    }

    componentDidMount() {
        //document.addEventListener("mousedown", this.handleChange.bind(this));
    }

    onSelectFeature(){
        // console.log(this.featureInfo);
        this.props.onSelectFeature(this.featureInfo);
    }

    render() {
        const data = this.featureInfo.pct_avail_pp.map(o=>o.pct_avail).sort()
        const title = this.featureInfo.feature_name
        const color_grays = ["#303030","#383838","#404040","#484848","#505050","#585858","#606060","#686868","#696969","#707070","#787878","#808080","#888888","#909090","#989898","#A0A0A0","#A8A8A8","#A9A9A9","#B0B0B0","#B8B8B8","#BEBEBE","#C0C0C0","#C8C8C8","#D0D0D0","#D3D3D3","#D8D8D8","#DCDCDC"]
        const color_inbetween = d3.scaleQuantize(color_grays).domain([0,1.01]);
     
        const color= (val:number)=>{ 
            if (val<=0){
                return "#000000"
            }
            else if (val>=1){
                return "#FFFFFF"
            }
            else return color_inbetween(val)
            //else return continuous(val)
        }
        
        const cluster_color=d3.scaleSequential().domain([0,7]).interpolator(d3.interpolateRainbow)
        const string_height = String(this.height)
        const clearStyle = { height: 20, bottom: 5, }
        
        return (<div className="pctAvailGradient selectable" style={{height: string_height+"px"}} onClick={this.onSelectFeature.bind(this)}  > {/* containing div with css class for styling */}
            <svg className='gradient'  viewBox={"0 0 " + data.length + " 10"} preserveAspectRatio="none">${
                data.map((val, idx, arr) => (<rect x={idx} key={idx} width="2" height="10" fill={color(val)}></rect> 
                
                ))
            }</svg>
            {this.showTitle &&  <span>&nbsp;&nbsp;{title}</span>} 

        </div>)
        /* <button  style = {clearStyle} >
                Show
            </button> 
            
            <svg className="cluster"><circle cx={10} cy={8} r={7} fill={cluster_color(this.featureInfo.cluster_id)} ></circle></svg> {this.showTitle && <span>{title}</span>} 
            */
    }
    
}

export default SelectPctAvailGradient
