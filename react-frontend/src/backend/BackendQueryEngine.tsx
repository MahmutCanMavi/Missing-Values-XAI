// import { FeatureInfo } from "../types/FeatureInfo";
import { FeatureInfo } from "../types/feature_types";

export interface queryBackendProps {
    route: string;
}

export const BASE_URL = 'http://127.0.0.1:8000';

export const queryBackend = async (route: string): Promise<FeatureInfo[]> => {
    const requestURL = `${BASE_URL}/${route}`;
    // const formData = new FormData();
    const data = await fetch(requestURL,
        {
            method: 'POST'
        }
    )
    .then(response =>  { return response.json()})
    .then(d =>  JSON.parse(d.replaceAll("NaN","null")) as FeatureInfo[]); // It seems we have to parse it again because it is a stringified string??
    // https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object
    
    return data;
}


export default queryBackend;


