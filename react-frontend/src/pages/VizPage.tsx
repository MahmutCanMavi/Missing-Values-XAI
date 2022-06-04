import React from "react";
import D3DetailSquares, { D3DetailSquaresPatient } from "../components/d3detailSquares";
import D3Histogram from "../components/d3histogram";
import DataUploadPane from "../components/DataUploadPane";
import { groupcolor } from "../components/groupcolor";
import StackedGradients from "../components/StackedGradients";
import { FeatureInfo, FeatureGroup } from "../types/feature_types";

interface VizPageProps {
    data: FeatureInfo[] | null;
    groups: FeatureGroup[] | null;
    handleDataUpload: Function;
}

interface VizState {
    isLoading: boolean, 
    selectedFeature:FeatureInfo | null
    selectedPatient: number | null
}
  
class VizPage extends React.Component<VizPageProps,VizState> {
    constructor(props: VizPageProps) {
        super(props);
        this.state={isLoading:false, selectedFeature:null, selectedPatient:null}
    }
    setSelectedFeature(selectedFeature: FeatureInfo){
        this.setState({selectedFeature: selectedFeature, selectedPatient:null}, () => {
         
        });
    }
    render(){

        //sorting by cluster
        //const featureInfosSorted= this.props.data.sort((a, b) => (a.cluster_id > b.cluster_id) ? 1 : -1);
        
        // sorting by avg pct avail
        //  console.log(this.props.data)
         let feature_names = (this.props.data) ? (this.props.data).map( (val: FeatureInfo,idx: number) => val.feature_name ) : [];
         if (feature_names.length > 5) {
             feature_names = feature_names.slice(0,5)
             feature_names.push("...");
         }
        return (<>
            <aside className="sidenav with-padding">  
            <div className="infobox">For each of the features (medical variables), the following gradients illustrate the percentage of missing data over patients. 
              <br></br>In every <em>feature gradient</em>, each patient is represented by one narrow vertical bar. If the data of this patient for this specific feature is completely missing, the narrow vertical bar will be black, if is is available for the entire timespan, it will be white. </div>
            <div className="gradientLegend"><svg height={40}><rect height={30} width={30} fill="black"></rect><text height={130} width={130} x={40} y={20}>100% Missing</text>
                   <rect height={30} width={30} x={150} fill="white"></rect><text height={130} width={130} x={190} y={20}>100% Available</text></svg></div>
            
                {this.props.data && this.props.groups===null &&  <StackedGradients 
                    data={this.props.data} 
                    onSelectFeature={this.setSelectedFeature.bind(this)}/>}
                
                {this.props.data && this.props.groups && this.props.groups.map( (group) =>{
                    
                    return <div key={group.id}>
                      <div className="gradient-group-title"><div className="group-colorbar" style={{ backgroundColor: groupcolor(group.id) }}></div><h4>{group.name}</h4></div>
                      {this.props.data && <StackedGradients 
                          data={this.props.data.filter(f=>f.group_id===group.id)}  
                          onSelectFeature={this.setSelectedFeature.bind(this)}/>}

                    </div>
                })

                }
            </aside>

            <main className="main">   
            Choose a csv file from the folder example-data.        
                <DataUploadPane features={feature_names} onChange={this.props.handleDataUpload}/>
                <hr/>
                {this.state.selectedFeature && <D3Histogram featureInfo={this.state.selectedFeature}/>}
                <hr/>
                {this.state.selectedFeature && <D3DetailSquares featureInfo={this.state.selectedFeature} 
                    setSelectedPatient={((patient_id:number)=>{window.scrollTo({top:4100}); this.setState({selectedPatient:patient_id})}).bind(this)} />}
                {this.state.selectedPatient && <D3DetailSquaresPatient patient_id={this.state.selectedPatient}/>}
            </main>
        </>)
    }
}
let a: ScrollToOptions 

export default VizPage;



/*

interface AppState {
    dataChoice: string, 
    variables: string[], // names of variables in the data
    isLoading: boolean, 
    clusteredFeatures: ClusteredFeatures, 
    selectedPct:FeatureInfo
  }
  
  
  class App extends React.Component<{}, AppState> {
    
    constructor(props: any) {
      super(props);
      this.handleImputation = this.handleImputation.bind(this);
      var temClusteredFeatures = {"FeatureInfos": [
        {"feature_name":"SvO1","cluster_id":1,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.2},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}]},
        {"feature_name":"SvO2","cluster_id":2,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.4},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}]},
        {"feature_name":"SvO3","cluster_id":3,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.6},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}]},
        {"feature_name":"SvO4","cluster_id":4,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.8},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}]}
      ]}
      // var temClusteredFeatures = {"FeatureInfos": [{"feature_name":"SvO1","cluster_id":1,"pct_avail_pp":[]}]};
       
      this.state = {dataChoice: '4',
                    variables: [],
                    isLoading: false,
                    clusteredFeatures: temClusteredFeatures,
                    selectedPct: temClusteredFeatures?.FeatureInfos[0],
                  };
     
    }
  
    handleImputation(){
      alert("We're imputing for you! Proud to serve.")
      // To implement the imputation, set the state to reflect the imputation performance, etc.
      // this.setState()
    }
  
    setDataChoice = (n_clusters: string) => {
      this.setIsLoading(true);
      console.log(n_clusters);
      
      var queryStr = `get-clusters?n_clusters=`;
      //callback
      if (n_clusters == "d" ){
        var queryStr = `get-dummy?`;
      }
  
      queryBackend(queryStr + n_clusters).then((clusteredvalues) => {
     
        
        this.setState({clusteredFeatures: clusteredvalues}, () => {
          
        });
        
        this.setIsLoading(false);
      });
  
      
    }
    
*/