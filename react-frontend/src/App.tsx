import React, { useEffect, useState } from 'react';
import './App.css';

import queryBackend from './backend/BackendQueryEngine';

import VisFeatureInfo from './VisFeatureInfo';
import DataChoiceComponent from './components/DataChoiceComponent';
import PctAvailGradient from './components/PctAvailGradient';

import { FeatureInfo } from './types/FeatureInfo';
import { ClusteredFeatures } from './types/ClusteredFeatures';
import StackedGradients from './components/StackedGradients';

function App() {

  const [clusteredFeatures, setClusteredFeatures] = useState<ClusteredFeatures>();
  const [dataChoice, setDataChoice] = useState<number>(4);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    queryBackend(`get-clusters?n_clusters=` + dataChoice).then((clusteredFeatures) => {
      
      setClusteredFeatures(clusteredFeatures);
      setIsLoading(false);
    });
  }, [dataChoice]); 

var featureInfo = clusteredFeatures?.FeatureInfos[0];

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
      {clusteredFeatures && <StackedGradients clusteredFeatures={clusteredFeatures}/>}
      {isLoading && <div>Loading...</div>}
      {featureInfo && <VisFeatureInfo featureInfo={featureInfo}/>}
    </div>
  )
}


export default App;
