import json
import pathlib
import pandas as pd
import cluster
import app

def pct_avail_clusters(n_clusters: int) -> list:
    """
    Calls upon pct_avail_all to cluster all of the features and store them in a list. 
    
    Could use ClusteredFeatures.ts as an interface, as it consists of an array
    of FeatureInfos
    
    Input: number of clusters requested (int)
    
    Ouput: list contaning all of the features with cluster information (list)
    """
    # load data
    try:
        # Uploaded Path
        data = pd.read_csv(app.DATA_PATH)
    except:
        # Hardcoded datapath
        thisfile= str(pathlib.Path(__file__).parent.absolute())
        path = thisfile+"/data/icu_data_with_na_v2.csv"
        data = pd.read_csv(path)
    
    # Code to add data explanations, if requested
    # data_explanations = json.load(open(thisfile + "/data/explanations.json"))
    # return pct_avail_all(data, data_explanations, n_clusters = n_clusters)
    
    return pct_avail_all(data, n_clusters = n_clusters)



def pct_avail_pp(feature_name: str) -> dict:
    """
    New version of previous "jsonify" that reads directly from the csv of data.
    Clusters all of the features called to 0 (same cluster) to fit in the data model
    of FeatureInfo.ts
    
    Input: feture name to be accessed (string)
    
    Ouput: dictionary of data model containing feature information (dict)
    """
    # load data
    # thisfile= str(pathlib.Path(__file__).parent.absolute())
    # path = thisfile+"/data/icu_data_with_na_v2.csv"
    #f = open(path) readcsv can handle opening the file for us
    try:
        # Uploaded Path
        data = pd.read_csv(app.DATA_PATH)
    except:
        # Hardcoded datapath
        thisfile= str(pathlib.Path(__file__).parent.absolute())
        path = thisfile+"/data/icu_data_with_na_v2.csv"
        data = pd.read_csv(path)
    # data_explanations = json.load(open(thisfile + "/data/explanations.json"))
    
    if feature_name not in data.columns:
        raise ValueError("feature name not found")
    
    # Get per person data
    NaN_pp = NaN_per_person(data)
    
    feature_dict = {}
    feature_dict["feature_name"] = feature_name
    # feature_dict["cluster_id"] = 0
    # feature_dict["explanation"] = data_explanations[feature_name] if feature_name in data_explanations else "n/a"
    feature_dict["pct_avail_pp"] = []
    feature_dict["description"] = None
    feature_dict["imputation_error"] = None
    
    # pid = 1
    for patient in NaN_pp:
        length = len(data.loc[data["id"] == patient[0]])
        if length == 0:
            percentage = 0
        else: 
            percentage =  1 - patient[1][feature_name] / length
        
        # Appending the list within the nested dictionaries
        feature_dict["pct_avail_pp"].append({"patient_id" : patient[0], "pct_avail" : percentage})
        # pid += 1
    
    return feature_dict


def NaN_per_person(df):
    """
    Generates a list of not available values per patient id in the dataset
    
    Input: Data as a pandas DataFrame
    
    Ouput: List of all patient ids with each a dict of how many missing
           values there exist per feature
    """
   
    NaN_pp = []
    for pid in df["id"].unique():
        # Taking the section of data corresponding to singular patients
        sub_df = df.loc[df["id"] == pid]

        # Dictionary of the missing values per category
        NaNs = {}
        for col in sub_df.columns:
            if col in ["rowid","id","time"]:
                if sub_df[col].isna().sum()>0:
                    #print("Error: rowid, id or time are nan")
                    pass
                else:
                    if not sub_df.empty:
                        NaNs[col] = sub_df[col].iloc[0]    
                    else:
                        NaNs[col] = 0
            else:
                NaNs[col] = sub_df[col].isna().sum()
        
        NaN_pp.append([pid, NaNs])
    
    return NaN_pp


def pct_avail_all(data_explanations = None, n_clusters = 4):
    """[]
    Clusters all of the features and stores them in a list. 
    
    Inputs: data as a pandas DataFrame and the number of clusters requested (int) 
    
    Ouput: list contaning all of the features with cluster information (list)
    """
    try:
        # Uploaded Path
        df = pd.read_csv(app.DATA_PATH)
    except:
        # Hardcoded datapath
        thisfile= str(pathlib.Path(__file__).parent.absolute())
        path = thisfile+"/data/icu_data_with_na_v2.csv"
        df = pd.read_csv(path)
    
    # Gets individual NaNs from the dataset per patient
    NaN_pp = NaN_per_person(df)
    
    # Get cluster dictionary
    # if n_clusters >= 1:
    #     clusters = cluster.cluster_e2e(df, n_clusters)
    # else:
    #     raise ValueError("number of clusters needs to exceed 0")
    
    # Dictionary of JSONs to be stored per feature, each feature 
    # having a distinct JSON
    feature_list = []
    for col in df.columns:
        # The data format is dictionary -> dictionary -> string(feature name) + list(pct_avail_pp)
        # The feature name is also the key to access the value in the dictionary for the values
        feature_dict = {}
        feature_dict["feature_name"] = col
        # feature_dict["cluster_id"] = clusters[col]
        feature_dict["pct_avail_pp"] = []
        # feature_dict["explanation"] = data_explanations[col] if col in data_explanations else "n/a"
        feature_dict["description"] = None
        feature_dict["imputation_error"] = None
        
        
        for patient in NaN_pp:
            # check if pid is actually corresponding to the id field in the dataset
            length = len(df.loc[df["id"] == patient[0]])

            if length == 0:
                percentage = 0
            else: 
                percentage =  1 - patient[1][col] / length
            
            # Appending the list within the nested dictionaries
            feature_dict["pct_avail_pp"].append({"patient_id" : patient[0], "pct_avail" : percentage})
        
        feature_list.append(feature_dict)
    
    # print(len(feature_list))
    clusterinfo = {}
    clusterinfo["FeatureInfos"] = feature_list
    return clusterinfo


if __name__ == "__main__":
    # Kind Remind
    n_clusters = int(4)
    clustered_data = pct_avail_clusters(n_clusters=n_clusters)
    string_list = ''
    print(type(clustered_data["FeatureInfos"]))
    for item in clustered_data["FeatureInfos"]:
        string_list += str(item["cluster_id"])
    print(string_list)
    print("Please import the function pct_avail_pp instead of excute this file directly")
    
