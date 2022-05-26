// import { FeatureInfo } from "../types/FeatureInfo";
import { FeatureInfo, FeatureGroup } from "../types/feature_types";

export interface queryBackendProps {
    featureInfos: FeatureInfo[] | null;
    groups: FeatureGroup[] | null;
}

export const BASE_URL = 'http://127.0.0.1:8000';

export const queryImputationError = async (featureInfos:FeatureInfo[] | null, groups:FeatureGroup[] | null): Promise<FeatureInfo[]> => {
    let route = 'impute';
    const requestURL = `${BASE_URL}/${route}`;
    // const formData = new FormData();
    console.log({'featureInfos': featureInfos, 'groups': groups});
    const data = await fetch(requestURL,
        {
            method: 'POST', // or 'PUT'
            headers: {
                    'Access-Control-Allow-Origin': 'http://127.0.0.1:8000',
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify({'featureInfos': featureInfos, 'groups': groups}),
        }
    )
    .then(response =>  { return response.json()})
    .then(d =>  JSON.parse(d.replaceAll("NaN","null")) as FeatureInfo[]); // It seems we have to parse it again because it is a stringified string??
    // https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object
    
    return data;
}


export default queryImputationError;


