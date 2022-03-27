import React, { useEffect, useState } from 'react';
import './App.css';

import queryBackend from './backend/BackendQueryEngine';

import VisFeatureInfo from './VisFeatureInfo';
import DataChoiceComponent from './components/DataChoiceComponent';
import PctAvailGradient from './components/PctAvailGradient';

import { FeatureInfo } from './types/FeatureInfo';
import StackedGradients from './components/StackedGradients';

function App() {

  const [featureInfo, setFeatureInfo] = useState<FeatureInfo>();
  const [dataChoice, setDataChoice] = useState<string>("pH");
  
  useEffect(() => {
    //TODO change request
    queryBackend(`get-data?feature_name=` + dataChoice).then((featureInfo) => {
      console.log(featureInfo)
      setFeatureInfo(featureInfo);
    });
  }, [dataChoice]); 

return (
    <div className="App">
      <header className="App-header"> Missing Values Dashboard
      </header>
      <div>
      <DataChoiceComponent onChoiceMade={setDataChoice}/>
      </div>
      <br/>
      <div className="gradientLegend"><svg height={40}><rect height={30} width={30} fill="black"></rect><text height={130} width={130} x={40} y={20}>100% Missing</text>
                <rect height={30} width={30} x={150} fill="white"></rect><text height={130} width={130} x={190} y={20}>100% Available</text></svg></div>
      {featureInfo && <StackedGradients featureInfo={featureInfo} showTitle={true}/>}
      
      {featureInfo && <VisFeatureInfo featureInfo={featureInfo}/>}
    </div>
  )
}

export default App;
