import React from 'react';
import { ErrorInfo } from '../types/ErrorInfo';
import * as d3 from 'd3' // can create problems with types! if so use the one below
//var d3: any = require('d3')

interface Props {
    featureInfo: ErrorInfo;
    showTitle?: boolean; // enable or disable to show the feature name
   // width, height are defined in index.css
    height: number;
}
const PctAvailGradient: React.FC<Props> = ({featureInfo, showTitle=true, height}:Props) => {
    // extracting the data
    const data = featureInfo.pct_avail_pp.map(o=>o.pct_avail).sort()

    const title = featureInfo.feature_name


    // OTHER COLOR SCALES
    //const complete = ["#000000","#080808","#101010","#181818","#202020","#282828","#303030","#383838","#404040","#484848","#505050","#585858","#606060","#686868","#696969","#707070","#787878","#808080","#888888","#909090","#989898","#A0A0A0","#A8A8A8","#A9A9A9","#B0B0B0","#B8B8B8","#BEBEBE","#C0C0C0","#C8C8C8","#D0D0D0","#D3D3D3","#D8D8D8","#DCDCDC","#E0E0E0","#E8E8E8","#F0F0F0","#F5F5F5","#F8F8F8","#FFFFFF"]
    //const continuous = d3.scaleSequential(d3.interpolate("black", "white")).domain([0, 1]);

    // Used color scale
    // there is a bigger visual jump from 0 to 0.001 and 0.999 to 1 than in between (some colors removed after first and before last)
    // this is to differentiate clearly when all or none of the values are missing
    //var color_grays = ["#303030","#383838","#404040","#484848","#505050","#585858","#606060","#686868","#696969","#707070","#787878","#808080","#888888","#909090","#989898","#A0A0A0","#A8A8A8","#A9A9A9","#B0B0B0","#B8B8B8","#BEBEBE","#C0C0C0","#C8C8C8","#D0D0D0","#D3D3D3","#D8D8D8","#DCDCDC"]
    var color_redYGreen= ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]
   
   
    const max_error = 1;
    const color_inbetween = d3.scaleQuantize(color_redYGreen).domain([0,max_error]);
 
    const color= (val:number)=>{ 
        if (val<0){
            return "#000000"
        }
        else if (val>1){
            return "#FFFFFF"
        }
        else return color_inbetween(val)
        //else return continuous(val)
    }
    // TODO: replace 7 with dataChoice (as argument)
    const cluster_color=d3.scaleSequential().domain([0,7]).interpolator(d3.interpolateRainbow)
    //return (<><div > {/* containing div with css class for styling */}
    //            {showTitle && <h3>{title}</h3>}
    //            <svg className="pctAvailGradient" width="100%" viewBox={"0 0 " + data.length + " 10"} preserveAspectRatio="none">${
    //                data.map((val, idx, arr) => (<rect x={idx} key={idx} width="2" height="10" fill={color(val)}></rect>))
    //            }</svg>
    //        </div>
    //        <div > {/* containing div with css class for styling */}
    //            {showTitle && <h3>{title}</h3>}
    //            <svg className="pctAvailGradient" width="100%" viewBox={"0 0 " + data.length + " 10"} preserveAspectRatio="none">${
    //                data.map((val, idx, arr) => (<rect x={idx} key={idx} width="2" height="5" fill={color(val)}></rect>))
    //            }</svg>
    //        </div>
    //        </>
    //        )
    const string_height = String(height)
    //return (<div > {/* containing div with css class for styling */}
    //                {showTitle && <h3>{title}</h3>}
    //                <svg className="pctAvailGradient" width="100%" viewBox={"0 0 " + data.length + " 10"} preserveAspectRatio="none">${
    //                    data.map((val, idx, arr) => (<rect x={idx} key={idx} width="2" height={string_height} fill={color(val)}></rect>))
    //                }</svg>
    //            </div>)
    return (<div className="pctAvailGradient" style={{height: string_height+"px"}} > {/* containing div with css class for styling */}
        <svg className='gradient'  viewBox={"0 0 " + data.length + " 10"} preserveAspectRatio="none">${
            data.map((val, idx, arr) => (<rect x={idx} key={idx} width="2" height="10" fill={color(val)}></rect>))
        }</svg><svg className="cluster"><circle cx={10} cy={8} r={7} fill={cluster_color(featureInfo.cluster_id)} ></circle></svg> {showTitle && <span>{title}</span>} 
    </div>)
}


export default PctAvailGradient
