import React from 'react';
import { FeatureInfo } from '../types/FeatureInfo';
import * as d3 from 'd3' // can create problems with types! if so use the one below
//var d3: any = require('d3')

interface Props {
    featureInfo: FeatureInfo;
    showTitle?: boolean; // enable or disable to show the feature name
   // width, height are defined in index.css

}
const PctAvailGradient: React.FC<Props> = ({featureInfo, showTitle=true}:Props) => {
    // extracting the data
    const data = featureInfo.pct_avail_pp.map(o=>o.pct_avail).sort()
    console.log(data)
    const title = featureInfo.feature_name
    // OTHER COLOR SCALES
    //const complete = ["#000000","#080808","#101010","#181818","#202020","#282828","#303030","#383838","#404040","#484848","#505050","#585858","#606060","#686868","#696969","#707070","#787878","#808080","#888888","#909090","#989898","#A0A0A0","#A8A8A8","#A9A9A9","#B0B0B0","#B8B8B8","#BEBEBE","#C0C0C0","#C8C8C8","#D0D0D0","#D3D3D3","#D8D8D8","#DCDCDC","#E0E0E0","#E8E8E8","#F0F0F0","#F5F5F5","#F8F8F8","#FFFFFF"]
    //const continuous = d3.scaleSequential(d3.interpolate("black", "white")).domain([0, 1]);

    // there is a bigger visual jump from 0 to 0.001 and 0.999 to 1 than in between (some colors removed after first and before last)
    // this is to differentiate clearly when all or none of the values are missing
    const color_scale = ["#303030","#383838","#404040","#484848","#505050","#585858","#606060","#686868","#696969","#707070","#787878","#808080","#888888","#909090","#989898","#A0A0A0","#A8A8A8","#A9A9A9","#B0B0B0","#B8B8B8","#BEBEBE","#C0C0C0","#C8C8C8","#D0D0D0","#D3D3D3","#D8D8D8","#DCDCDC"]
    const color_inbetween = d3.scaleQuantize(color_scale)
      .domain([0,1.01]);
    const color= (val:number)=>{ 
        if (val<=0){
            return "#000000"
        }
        else if (val==1){
            return "#FFFFFF"
        }
        else return color_inbetween(val)
    }

    return (<><div className="pctAvailGradient"> {/* containing div with css class for styling */}
                {showTitle && <h3>{title}</h3>}
                <svg width="100%" height="100%" viewBox={"0 0 " + data.length + " 10"} preserveAspectRatio="none">${
                    data.map((val, idx, arr) => (<rect x={idx} key={idx} width="20" height="10" fill={color(val)}></rect>))
                }</svg>
            </div></>)
}


export default PctAvailGradient
