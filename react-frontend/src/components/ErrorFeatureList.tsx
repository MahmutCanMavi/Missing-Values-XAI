import React from 'react';
import  {FeatureGroup, FeatureInfo} from '../types/feature_types';
import ErrorGradient from './ErrorGradient';
//import * as d3 from 'd3' // can create problems with types! if so use the one below
//var d3: any = require('d3')


import SelectPctAvailGradient from './SelectPctAvailGradient';


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
        const featureInfosSorted= this.props.data.sort((a, b) => {
            if (a.group_id==null || b.group_id == null){
                return 1; // this might not make sense
            }
            else{
                return (a.group_id > b.group_id) ? 1 : -1
            }
            
            }
            );
        
        // sorting by avg pct avail
        // const featureInfosSorted= this.props.data.sort((a, b) => (a.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/a.pct_avail_pp.length < b.pct_avail_pp.map(pct=>pct.pct_avail).reduce((a,b)=>a+b,0)/b.pct_avail_pp.length ? 1 : -1));
        
       
        return (<>
             <div className='gradients'>
             {this.props.groups.map( (group) =>{
                    
                    return <>
                    {group.name}
                    <ErrorGradient featureInfos={this.props.data.filter(f=>f.group_id===group.id)} group={group} height={30}/>
                    
                    {featureInfosSorted.filter(f=>f.group_id===group.id).map((featureInfo,i)=>

                    <div key={featureInfo.feature_name}> {featureInfo.feature_name} : {featureInfo.imputation_error}  </div>           
                    
                    )}


                    </>
                })

            }
            </div>
        </>)
    }
}

export default ErrorFeatureList
