import { DataArray } from "../types/DataArray";
import { FeatureInfo } from "../types/FeatureInfo";

export interface queryBackendProps {
    route: string;
}

export const BASE_URL = 'http://127.0.0.1:8000';

export const queryBackend = async (route: string): Promise<FeatureInfo> => {
    const requestURL = `${BASE_URL}/${route}`;
    // const formData = new FormData();
    const data = await fetch(requestURL,
        {
            method: 'POST'
        }
    ).then(response => response.json()).then(d => d as FeatureInfo);

    return data;
}


export default queryBackend;


