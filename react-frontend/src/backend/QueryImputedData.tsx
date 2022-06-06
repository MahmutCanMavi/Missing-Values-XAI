// import { FeatureInfo } from "../types/FeatureInfo";
import { FeatureInfo, FeatureGroup } from "../types/feature_types";


export const BASE_URL = 'http://127.0.0.1:8000';

export const queryImputedData = async () =>{
    let route = 'imputed_data';
    
    const requestURL = `${BASE_URL}/${route}`;
    // const formData = new FormData();
    // console.log({'featureInfos': featureInfos, 'groups': groups});
    // const featureInfosLight = featureInfos?.map(f=>{ return {...f,pct_avail_pp:[]}})
    // console.log(JSON.stringify({'featureInfos': featureInfosLight, 'groups': groups}))
    const data = await fetch(requestURL,
        {
            method: 'POST', // or 'PUT'
            headers: {
                    'Access-Control-Allow-Origin': 'http://127.0.0.1:8000',
                    'Content-Type': 'application/json',
            }
        }
    )
    .then(response =>  { return response.json()})
    // .then(d =>  JSON.parse(d.replaceAll("NaN","null")) as FeatureInfo[]); // It seems we have to parse it again because it is a stringified string??
    // https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object
    
    return data;
}


export default queryImputedData;


