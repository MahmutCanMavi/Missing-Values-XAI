export interface Parameter {
    mode: "int" | "float" | "string";
    name: string; // name of the parameter, for example "Fill Value"
    description: string; // explain the meaning of the parameter, for example "Choose value for filling in missing data points"
}

export interface ImputationMethod {
    name: string;
    parameters: Parameter[] | null;
}

// "value", "ffill", "mean", "knn", "iterative"
export const IMPUTATION_METHODS: ImputationMethod[] = 
    [{name: "None", parameters: null},
     {name: "value", parameters: null},
     {name: "ffill", parameters: null},
     {name: "mean", parameters: null},
     {name: "knn", parameters: null},
     {name: "iterative", parameters: null}
    ];

export interface PctAvail {
    patient_id: number; // patient ID as an integer
    pct_avail: number; // percent of available values as a fraction (between 0 and 1)
}

export interface FeatureInfo {
    feature_name: string;
    pct_avail_pp: PctAvail[];
    description: string | null; // description the meaning of the variable
    imputation_error: number | null;
    group_id: number | null;
}

export interface FeatureGroup {
    id : number;
    name: string; // name of the group, for example "Cluster1"
    filters?: string[];
    imputation_method: ImputationMethod;
}

export interface tsneDataPoint { // for plotting the clustered features
    feature_name : string;
    x : number;
    y : number;
    group_id : number;
}

export interface ClusterResponse {
    cluster_method : string;
    FeatureInfos : FeatureInfo[];
    groups : FeatureGroup[];
    tsneData : tsneDataPoint[];
}
