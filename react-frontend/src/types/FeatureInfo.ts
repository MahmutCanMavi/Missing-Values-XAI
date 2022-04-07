import { PctAvail } from "./PctAvail";

export interface FeatureInfo {
    feature_name: string;
    pct_avail_pp: PctAvail[];
    cluster_id : number;
    explanation : string;
}