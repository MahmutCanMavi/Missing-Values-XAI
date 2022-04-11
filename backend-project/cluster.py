import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
#import plotly.graph_objects as go
import numpy as np
import json
import pathlib




def compute_variable_groups(df, number_of_clusters = 4):
    """
    Takes the datadrame and the wanted number of clusters as inputs.
    
    Outputs the variable groups as a list.
    """
    
    # Functions to shorten the dataset to averages per patient
    # This aides in efficiency whilst not losing much information
    shorter_df = shorten_data(df)
    
    # Clustering algorihtm with optional declaration of requested 
    # number of clusters
    clusters = cluster(shorter_df, number_of_clusters)
    
    # Returns the clusters as a list
    return clusters_to_list(df, clusters, number_of_clusters)

    
    
def shorten_data(df):
    """
    Takes the dataframe as input.
    
    Outputs a patientwise average of the missing data points as a dataframe
    """
    
    # Initialize the list to be the dataframe
    df_short = []
    # Loop through all of the patients via their respective ids
    for i in range(max(df["id"])):
        # New row corresponding to a single patient to be appended to df_short
        new_row = []
        
        # Taking a smaller dataframe wherein only the current patient is used
        sub_df = df.loc[df["id"] == i+1]
        curr_len = len(sub_df)
        
        # Data dicrepnancies
        if curr_len == 0:
            # Some ids are skipped and for those cases the id gets 0, 
            # corresponding to no data being available
            new_row = [0] * len(df.columns)
        else:
            # Otherwise, the new list is appended by the availability of data
            new_list = 1 - sub_df.isna().sum() / curr_len
            new_row = new_list.tolist()

        #if new_row[0]==0: #rowid is "missing"
        #    print(sub_df.head())
        
        df_short.append(new_row)
    
    # Return the created list as a dataframe
    return pd.DataFrame(df_short)


def cluster(df, number_of_clusters = 4):
    """
    Takes the (shortened) datadrame and the wanted number of clusters as inputs.
    
    Outputs the clusters from the KMeans output.
    """
    # Copying the dataframe
    T = df
    # Using a scaler on the data to transform it
    scaler = MinMaxScaler()
    scaler.fit(T)
    T = scaler.transform(df)
    
    # KMeans clustering for the shortened
    kmeans = KMeans(
        n_clusters = number_of_clusters, init = "k-means++",
        n_init = 10,
        tol = 1e-04, random_state = 42)
    kmeans.fit(T)
    
    # Getting clusters
    clusters = pd.DataFrame(T, columns = df.columns)
    clusters["label"] = kmeans.labels_
    
    return clusters


def clusters_to_list(df, clusters, number_of_clusters = 4):
    """
    Takes the (shortened) datadrame, clusters and the wanted number of clusters as inputs.
    
    Outputs a nested list of clusters for the features.
    """
    # Getting indivicual clusters from the groups
    polar = clusters.groupby("label").mean().reset_index()
    polar = pd.melt(polar,id_vars = ["label"])
    
    # 4 clusters used
    cluster_list = []
    for i in range(number_of_clusters): cluster_list.append([])
    
    i = 0
    for col in df.columns:
        for clstr in range(number_of_clusters):
            # Takes the argmax of the feature from available clusters and 
            # places it to the nested list in the cluster group
            if np.argmax(polar.loc[polar["variable"] == i]["value"]) == clstr : 
                cluster_list[clstr].append(col)
        i += 1
    
    return cluster_list



def cluster_to_json(cluster_list):
    """
    Takes the cluster list as an input.
    
    Outputs a dictionary of " "feature" : cluster ".
    """
    cluster_dict = {}
    
    cluster_number = 0
    for cluster in cluster_list:
        for col in cluster:
            cluster_dict[col] = cluster_number

        cluster_number += 1

    # print(cluster_number)
        
    return cluster_dict
            

def cluster_e2e(df, number_of_clusters = 4):
    """
    Takes the datadrame and the wanted number of clusters as inputs.
    
    Calls on cluster_to_json to get the dictionary version of the cluster list.
    """
    cluster_dict = cluster_to_json(compute_variable_groups(df, number_of_clusters))
    
    return cluster_dict
    
    
if __name__ == '__main__':
    thisfile= str(pathlib.Path(__file__).parent.absolute())
    datafolder = thisfile+"/data/"  
    cluster_e2e(pd.read_csv(datafolder+"icu_data_with_na_v2.csv"), number_of_clusters = 4)
