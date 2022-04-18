import { PctAvail } from "./PctAvail";

export interface FeatureInfo {
    feature_name: string;
    pct_avail_pp: PctAvail[];
    description: string | null; // description the meaning of the variable
    imputation_error: number | null;
}

export interface PctAvail {
    patient_id: number; // patient ID as an integer
    pct_avail: number; // percent of available values as a fraction (between 0 and 1)
}

export interface FeatureGroup {
    name: string; // name of the group, for example "Cluster1"
    features: string[]; // features contained in the group
}