import React, { useEffect, useState } from 'react';
import './App.css';
import { DataArray } from './types/DataArray';
import queryBackend from './backend/BackendQueryEngine';
import Visualization from './Visualization';
import DataChoiceComponent from './components/DataChoiceComponent';

function App() {

  const [exampleData, setExampleData] = useState<DataArray>();
  const [dataChoice, setDataChoice] = useState<string>();
  
  useEffect(() => {
    queryBackend(`get-data?name=` + dataChoice).then((exampleData) => {
      setExampleData(exampleData);
    });
  }, [dataChoice]);
  
  console.log(exampleData) 
  console.log(dataChoice)

  return (
    <div className="App">
      <header className="App-header"> K-Means clustering
      </header>
      <div>
      <DataChoiceComponent onChoiceMade={setDataChoice}/>
      </div>
      <div>{exampleData && dataChoice && <Visualization width={1100} height={550} data={exampleData} />}</div>
    </div>
  )
}

export default App;
