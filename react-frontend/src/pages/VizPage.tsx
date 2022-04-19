import React from "react";
import D3Histogram from "../components/d3histogram";
import DataUploadPane from "../components/DataUploadPane";
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
}
  
class VizPage extends React.Component<VizPageProps,VizState> {
    constructor(props: VizPageProps) {
        super(props);
        this.state={isLoading:false, selectedFeature:null}
    }
    setSelectedFeature(selectedFeature: FeatureInfo){
        this.setState({selectedFeature: selectedFeature}, () => {
         
        });
    }
    render(){

        //sorting by cluster
        //const featureInfosSorted= this.props.data.sort((a, b) => (a.cluster_id > b.cluster_id) ? 1 : -1);
        
        // sorting by avg pct avail
        console.log(this.props.data)
         let feature_names = (this.props.data) ? (this.props.data).map( (val: FeatureInfo,idx: number) => val.feature_name ) : [];
         if (feature_names.length > 5) {
             feature_names = feature_names.slice(0,5)
             feature_names.push("...");
         }
        return (<>
<<<<<<< HEAD

            <aside className="sidenav">        
=======
            <aside className="sidenav">  
              At the moment, the upload is not yet connected with the backend, and when you upload a file, it only requests a static dataset trom the backend      
>>>>>>> ed54326437e22dd03246a2d7c42833bfdc2ea9dd
                {this.props.data && <StackedGradients 
                    data={this.props.data} 
                    onSelectFeature={this.setSelectedFeature.bind(this)}/>}
            </aside>

            <main className="main">          
                <DataUploadPane features={feature_names} onChange={this.props.handleDataUpload}/>
                <hr/>
                {this.state.selectedFeature && <D3Histogram featureInfo={this.state.selectedFeature}/>}
            </main>
        </>)
    }
}

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