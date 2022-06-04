import React from 'react';
import  {FeatureGroup, FeatureInfo} from '../types/feature_types';
import ErrorGradient from './ErrorGradient';
import * as d3 from 'd3' // can create problems with types! if so use the one below
//var d3: any = require('d3')


import SelectPctAvailGradient from './SelectPctAvailGradient';

import {groupcolor} from './groupcolor'

function imputationColor(imp_err:number|null){
    const color_redYGreen= ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]
    
    const color_inbetween = d3.scaleQuantize(color_redYGreen.reverse()).domain([0,1.01]);
 
    const color= (val:number|null)=>{ 
        if (val===null){
            return "#666";
        }
        else if (val<=0){
            return "black"
        }
        else if (val>=1){
            return "#a50026"
        }
        else return color_inbetween(val)
        
    }
    return color(imp_err)
}
type ErrorListProps = {
    data: FeatureInfo[];
    showTitle?: boolean;
    groups:FeatureGroup[];
    
  }


class ErrorFeatureList extends React.Component<ErrorListProps, {}> {

    current_number : number;
    constructor(props: ErrorListProps) {
        super(props);
        this.current_number = 0;
        //this.onSelectFeature = this.onSelectFeature.bind(this)
    }

    

    render(){

        //console.log("props",typeof(this.props.clusteredFeatures));
        //console.log("infos",this.props.clusteredFeatures.FeatureInfos);
        
        // sorting by cluster
        // const featureInfosSorted= this.props.data.sort((a, b) => {
        //     if (a.group_id==null || b.group_id == null){
        //         return 1; // this might not make sense
        //     }
        //     else{
        //         return (a.group_id > b.group_id) ? 1 : -1
        //     }
            
        //     }
        //     );
        
        // sorting by avg pct avail
        // const featureInfosSorted= this.props.data.sort((a, b) => (a.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/a.pct_avail_pp.length < b.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/b.pct_avail_pp.length ? 1 : -1));
        
{/* <div className="feature-row" key={feature.feature_name}>
                                            <div style={{ backgroundColor: groupcolor(feature.group_id) }} className="feature-colorbar"></div>
                                            <div className="feature-name">

                                                {feature.feature_name}
                                            </div>
                                            <SelectPctAvailGradient featureInfo={feature} height={20} onSelectFeature={() => null} />

                                            <div className="feature-buttons">
                                                <div className="iconbutton" onClick={() => this.removeFromGroup(feature.feature_name)}><Icons icon="X" /></div>
                                            </div>
                                        </div> */}

       
        return (<>
                <h3>Overall loss score avg: {arrayAverage(this.props.data.filter(f=>f.imputation_error!==null).map(f=>f.imputation_error)).toFixed(3)}</h3>
             <div className='imp-err-wrapper'>
             {this.props.groups.map( (group) =>{
                    
                 const groupdata = this.props.data.filter(f => f.group_id === group.id);
                 if (groupdata.filter(f=>f.imputation_error!==null).length===0){
                     return <div key={group.id}></div>
                 }
                 else {
                    return <div key={group.id} className="group-row" onClick={()=>{}}>
                    {/* <div style={{ backgroundColor: groupcolor(group.id) }} className="group-colorbar"></div> */}
                    <div className='group-name'> {group.name} </div>
                    {/* <ErrorGradient featureInfos={groupdata} group={group} height={30}/> */}
                    <div className='group-features'>
                    {groupdata.sort((a,b)=>{
                        if (a.imputation_error===null || b.imputation_error===null){
                            return 1
                        }
                        else{
                            return (a.imputation_error>b.imputation_error)?-1:1;
                        }
                    }
                        ).map((featureInfo,i)=>

                    <div key={featureInfo.feature_name} className="feature-imp-error"> 
                        <span className='imp-error-colorbox' style={{backgroundColor:imputationColor(featureInfo.imputation_error)}}></span> 
                        {featureInfo.feature_name} : {featureInfo.imputation_error?.toFixed(2)} 
                        <div className='is-string-box'>{featureInfo.is_string && <>String</>}</div> 
                    </div>           
                    
                    )}
</div>

                    </div>          
                 }
                })

            }
            </div>
        </>)
    }
}
function arrayAverage(arr:any){
    //Find the sum
    var sum = 0;
    for(var i in arr) {
        sum += arr[i];
    }
    //Get the length of the array
    var numbersCnt = arr.length;
    //Return the average / mean.
    return (sum / numbersCnt);
}




export default ErrorFeatureList
