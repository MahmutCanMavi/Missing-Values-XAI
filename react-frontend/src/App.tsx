import React, { useEffect, useState } from 'react';
import './App.css';
//import { DataArray } from './types/DataArray';
import queryBackend from './backend/BackendQueryEngine';
import Visualization from './Visualization';
import VisFeatureInfo from './VisFeatureInfo';
import DataChoiceComponent from './components/DataChoiceComponent';

import { FeatureInfo } from './types/FeatureInfo';

import SecondHistogram  from './VizObservable'

function App() {

 
  //const [exampleData, setExampleData] = useState<DataArray>();

  const [featureInfo, setFeatureInfo] = useState<FeatureInfo>();
  const [dataChoice, setDataChoice] = useState<string>("HR");
  
  useEffect(() => {
    //TODO change request
    queryBackend(`get-data?feature_name=` + dataChoice).then((featureInfo) => {
      console.log(featureInfo)
      setFeatureInfo(featureInfo);
    });
  }, [dataChoice]); //[]


  // DM: how to integrate this with the component...?
  // const [availData, setAvailData] = useState({name: "HR", pct_avail_pp:[{patient_id:0, pct_avail:0.98}, {patient_id:134, pct_avail:0.85}]});
  // useEffect(() => {
  //   console.log("hi",availData) 
  // } , []);
 
  //console.log(exampleData) 
  console.log(dataChoice)


  // old visualization <div>{exampleData && dataChoice && <Visualization width={1100} height={550} data={exampleData} />}</div>
  return (
    <div className="App">
      <header className="App-header"> Funny Histogram of missing values
      </header>
      <div>
      <DataChoiceComponent onChoiceMade={setDataChoice}/>
      </div>
      
      {featureInfo && <VisFeatureInfo featureInfo={featureInfo}/>}
    </div>
  )
}

export default App;
