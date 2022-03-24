import React, { useEffect, useState } from 'react';
import './App.css';
//import { DataArray } from './types/DataArray';
import queryBackend from './backend/BackendQueryEngine';
import Visualization from './Visualization';
import VisFeatureInfo from './VisFeatureInfo';
import DataChoiceComponent from './components/DataChoiceComponent';
import PctAvailGradient from './components/PctAvailGradient';

import { FeatureInfo } from './types/FeatureInfo';

function App() {

  const [featureInfo, setFeatureInfo] = useState<FeatureInfo>();
  const [dataChoice, setDataChoice] = useState<string>("HR");
  
  useEffect(() => {
    //TODO change request
    queryBackend(`get-data?feature_name=` + dataChoice).then((featureInfo) => {
      console.log(featureInfo)
      setFeatureInfo(featureInfo);
    });
  }, [dataChoice]); 

return (
    <div className="App">
      <header className="App-header"> Funny Histogram of missing values
      </header>
      <div>
      <DataChoiceComponent onChoiceMade={setDataChoice}/>
      </div>
      {featureInfo && <VisFeatureInfo featureInfo={featureInfo}/>}
      {featureInfo && <PctAvailGradient featureInfo={featureInfo} showTitle={true}/>}
    </div>
  )
}

export default App;
