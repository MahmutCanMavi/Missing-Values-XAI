import React, { useEffect, useState } from 'react';
import './App.css';

import queryBackend from './backend/BackendQueryEngine';

import DataChoiceComponent from './components/DataChoiceComponent';
import PctAvailGradient from './components/PctAvailGradient';

import { FeatureInfo } from './types/FeatureInfo';
import { ClusteredFeatures } from './types/ClusteredFeatures';
import StackedGradients from './components/StackedGradients';
import StackedErrorGradients from './components/StackedErrorGradients';
import MyD3Component from './components/d3histogram';
import cached_data from './backend/cachedData'
import ImputationMenu from './components/ImputationMenu'

function App() {

  const [clusteredFeatures, setClusteredFeatures] = useState<ClusteredFeatures>();
  const [Featureinfocurr, setFeatureinfocurr] = useState<FeatureInfo>();
  // Pass Featureinfocurr to the MyD3Component
  // Pass 
  const [dataChoice, setDataChoice] = useState<number>(4);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    queryBackend(`get-clusters?n_clusters=` + dataChoice).then((clusteredFeatures) => {
      
      setClusteredFeatures(clusteredFeatures);
      console.log(clusteredFeatures)
      setIsLoading(false);
    });

  }, [dataChoice]); 

var featureInfo = clusteredFeatures?.FeatureInfos[12];

const fakeErrordata={"ErrorInfos": [
  {"feature_name":"SvO2","error_threshold":1,"cluster_id":3,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.8854166666666666},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279},{"patient_id":5,"pct_avail":1},{"patient_id":6,"pct_avail":1},{"patient_id":7,"pct_avail":0.946236559139785},{"patient_id":8,"pct_avail":0.9587628865979382},{"patient_id":9,"pct_avail":0},{"patient_id":10,"pct_avail":1},{"patient_id":11,"pct_avail":0.5979381443298969},{"patient_id":12,"pct_avail":0.865979381443299},{"patient_id":13,"pct_avail":1},{"patient_id":14,"pct_avail":1},{"patient_id":15,"pct_avail":1},{"patient_id":16,"pct_avail":0.7142857142857143},{"patient_id":17,"pct_avail":0.13888888888888884},{"patient_id":18,"pct_avail":0.9615384615384616},{"patient_id":19,"pct_avail":0.9587628865979382},{"patient_id":20,"pct_avail":0.6},{"patient_id":21,"pct_avail":0.8775510204081632},{"patient_id":22,"pct_avail":0.8556701030927836},{"patient_id":23,"pct_avail":0.8947368421052632},{"patient_id":24,"pct_avail":0},{"patient_id":25,"pct_avail":1},{"patient_id":26,"pct_avail":0.979381443298969},{"patient_id":27,"pct_avail":1},{"patient_id":28,"pct_avail":1},{"patient_id":29,"pct_avail":0.8888888888888888},{"patient_id":30,"pct_avail":1},{"patient_id":31,"pct_avail":1},{"patient_id":32,"pct_avail":0},{"patient_id":33,"pct_avail":0.979381443298969},{"patient_id":34,"pct_avail":0},{"patient_id":35,"pct_avail":1},{"patient_id":36,"pct_avail":0.5360824742268041},{"patient_id":37,"pct_avail":0},{"patient_id":38,"pct_avail":0},{"patient_id":39,"pct_avail":1},{"patient_id":40,"pct_avail":0.7971014492753623},{"patient_id":41,"pct_avail":0.9487179487179487},{"patient_id":42,"pct_avail":0},{"patient_id":43,"pct_avail":0},{"patient_id":44,"pct_avail":0.967741935483871},{"patient_id":45,"pct_avail":1},{"patient_id":46,"pct_avail":1},{"patient_id":47,"pct_avail":0.8333333333333334},{"patient_id":48,"pct_avail":1},{"patient_id":49,"pct_avail":0.9484536082474226},{"patient_id":50,"pct_avail":0.9896907216494846},{"patient_id":51,"pct_avail":1},{"patient_id":52,"pct_avail":1},{"patient_id":53,"pct_avail":1},{"patient_id":54,"pct_avail":0},{"patient_id":55,"pct_avail":1},{"patient_id":56,"pct_avail":1},{"patient_id":57,"pct_avail":0.9340659340659341},{"patient_id":58,"pct_avail":0.9175257731958762},{"patient_id":59,"pct_avail":1},{"patient_id":60,"pct_avail":0},{"patient_id":61,"pct_avail":0},{"patient_id":62,"pct_avail":1},{"patient_id":63,"pct_avail":0.4020618556701031},{"patient_id":64,"pct_avail":0.9896907216494846},{"patient_id":65,"pct_avail":0.9294117647058824},{"patient_id":66,"pct_avail":0.7435897435897436},{"patient_id":67,"pct_avail":1},{"patient_id":68,"pct_avail":0.9014084507042254},{"patient_id":69,"pct_avail":1},{"patient_id":70,"pct_avail":0.873015873015873},{"patient_id":71,"pct_avail":0.8108108108108107},{"patient_id":72,"pct_avail":0.9428571428571428},{"patient_id":73,"pct_avail":0},{"patient_id":74,"pct_avail":0.7628865979381443},{"patient_id":75,"pct_avail":1},{"patient_id":76,"pct_avail":1},{"patient_id":77,"pct_avail":0.8947368421052632},{"patient_id":78,"pct_avail":0.9411764705882353},{"patient_id":79,"pct_avail":0.7938144329896908},{"patient_id":80,"pct_avail":0},{"patient_id":81,"pct_avail":0.9166666666666666},{"patient_id":82,"pct_avail":0.5154639175257731},{"patient_id":83,"pct_avail":1},{"patient_id":84,"pct_avail":1},{"patient_id":85,"pct_avail":1},{"patient_id":86,"pct_avail":0.9302325581395349},{"patient_id":87,"pct_avail":1},{"patient_id":88,"pct_avail":0},{"patient_id":89,"pct_avail":0},{"patient_id":90,"pct_avail":1},{"patient_id":91,"pct_avail":1},{"patient_id":92,"pct_avail":0},{"patient_id":93,"pct_avail":1},{"patient_id":94,"pct_avail":1},{"patient_id":95,"pct_avail":1},{"patient_id":96,"pct_avail":0.8809523809523809},{"patient_id":97,"pct_avail":0.9278350515463918},{"patient_id":98,"pct_avail":1},{"patient_id":99,"pct_avail":0.9072164948453608},{"patient_id":100,"pct_avail":1},{"patient_id":101,"pct_avail":1},{"patient_id":102,"pct_avail":0},{"patient_id":103,"pct_avail":0.47058823529411764},{"patient_id":104,"pct_avail":1},{"patient_id":105,"pct_avail":0.37209302325581395},{"patient_id":106,"pct_avail":0.44999999999999996},{"patient_id":107,"pct_avail":1},{"patient_id":108,"pct_avail":0.979381443298969},{"patient_id":109,"pct_avail":0.7708333333333334},{"patient_id":110,"pct_avail":0.5306122448979591},{"patient_id":111,"pct_avail":0},{"patient_id":112,"pct_avail":0.8842105263157894},{"patient_id":113,"pct_avail":1},{"patient_id":114,"pct_avail":1},{"patient_id":115,"pct_avail":0.7093023255813953},{"patient_id":116,"pct_avail":0.9523809523809523},{"patient_id":117,"pct_avail":0.7164179104477613},{"patient_id":118,"pct_avail":0.9024390243902439},{"patient_id":119,"pct_avail":0.979381443298969},{"patient_id":120,"pct_avail":0},{"patient_id":121,"pct_avail":0.9285714285714286},{"patient_id":122,"pct_avail":0.6666666666666667},{"patient_id":123,"pct_avail":0.9484536082474226},{"patient_id":124,"pct_avail":0.8762886597938144},{"patient_id":125,"pct_avail":1},{"patient_id":126,"pct_avail":0},{"patient_id":127,"pct_avail":0.9896907216494846},{"patient_id":128,"pct_avail":0},{"patient_id":129,"pct_avail":0},{"patient_id":130,"pct_avail":0},{"patient_id":131,"pct_avail":0},{"patient_id":132,"pct_avail":0.8245614035087719},{"patient_id":133,"pct_avail":0.875},{"patient_id":134,"pct_avail":1},{"patient_id":135,"pct_avail":0},{"patient_id":136,"pct_avail":1},{"patient_id":137,"pct_avail":0},{"patient_id":138,"pct_avail":1},{"patient_id":139,"pct_avail":0},{"patient_id":140,"pct_avail":0},{"patient_id":141,"pct_avail":0.31034482758620685},{"patient_id":142,"pct_avail":1},{"patient_id":143,"pct_avail":1},{"patient_id":144,"pct_avail":1},{"patient_id":145,"pct_avail":0},{"patient_id":146,"pct_avail":0.9787234042553191},{"patient_id":147,"pct_avail":0},{"patient_id":148,"pct_avail":1},{"patient_id":149,"pct_avail":0.8842105263157894},{"patient_id":150,"pct_avail":0},{"patient_id":151,"pct_avail":0.9560439560439561},{"patient_id":152,"pct_avail":1},{"patient_id":153,"pct_avail":0},{"patient_id":154,"pct_avail":1},{"patient_id":155,"pct_avail":1},{"patient_id":156,"pct_avail":0},{"patient_id":157,"pct_avail":0.7525773195876289},{"patient_id":158,"pct_avail":1},{"patient_id":159,"pct_avail":1},{"patient_id":160,"pct_avail":1},{"patient_id":161,"pct_avail":0.7123287671232876},{"patient_id":162,"pct_avail":0},{"patient_id":163,"pct_avail":0},{"patient_id":164,"pct_avail":0.8762886597938144},{"patient_id":165,"pct_avail":1},{"patient_id":166,"pct_avail":0.23684210526315785},{"patient_id":167,"pct_avail":0.731958762886598},{"patient_id":168,"pct_avail":1},{"patient_id":169,"pct_avail":0.8617021276595744},{"patient_id":170,"pct_avail":0.7916666666666666}]}
]}
/*return (
    <div className="App">
      
      <div className="grid-container">
        <header className="header"> Missing Values Dashboard</header>
        <aside className="sidenav"><div className="gradientLegend"><svg height={40}><rect height={30} width={30} fill="black"></rect><text height={130} width={130} x={40} y={20}>100% Missing</text>
                <rect height={30} width={30} x={150} fill="white"></rect><text height={130} width={130} x={190} y={20}>100% Available</text></svg></div>
      {clusteredFeatures && <StackedGradients clusteredFeatures={clusteredFeatures}/>}
      {isLoading && <div>Loading...</div>}</aside>


      
        <main className="main">
          

      <div>
      <DataChoiceComponent onChoiceMade={setDataChoice}/>
      </div>
      <br/>
      
      
          
      {featureInfo && <MyD3Component featureInfo={featureInfo}/>}


      <h3>Error Vis</h3>
      <StackedErrorGradients clusteredFeatures={fakeErrordata}/>
        </main>
        <footer className="footer">By Yan, Talu, David and Michael</footer>
      </div>
    </div>
  )*/
}

//{featureInfo && <MyD3Component featureInfo={featureInfo}/>}
export default App;
