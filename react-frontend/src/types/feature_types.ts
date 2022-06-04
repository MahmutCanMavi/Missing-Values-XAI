export interface Parameter {
   
    name: string; // name of the parameter, for example "Fill Value"
   
    description: string; // explain the meaning of the parameter, for example "Choose value for filling in missing data points"
    value: number; // value of the parameter to fill
}

export interface ImputationMethod {
    name: string;
    parameters: Parameter[] | null;
    display_name: string;
}

// "value", "ffill", "mean", "knn", "iterative"
export const IMPUTATION_METHODS: ImputationMethod[] = 
    [{name: "None", display_name:"Do nothing", parameters: null},
     {name: "value",display_name:"Fill by constant", parameters:[{name:"replacementValue", description:"Choose value for filling in missing data points. Only numbers allowed, strings will be replaced with 0", value:0}]},
     {name: "ffill",display_name:"Forward fill", parameters: null},
     {name: "mean",display_name:"Mean", parameters: null},
     {name: "knn", display_name:"K-nearest-neighbours",parameters: [{name:"K", description:"Choose K, number of nearest neighbours to consider", value:5}]},
     {name: "iterative", display_name:"Iterative", parameters: null}
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
    is_string?:boolean;
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
