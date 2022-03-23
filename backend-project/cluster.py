import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
import plotly.graph_objects as go
import numpy as np
import json


def compute_variable_groups(df):
    shorter_df = shorten_data(df)
    
    clusters = cluster(shorter_df)
    
    return clusters_to_list(df, clusters)

    
    
def shorten_data(df):
    df_short = []
    for i in range(max(df["id"])):
        new_row = []
        
        sub_df = df.loc[df["id"] == i+1]
        curr_len = len(sub_df)
        
        # Data dicrepnancies
        if curr_len == 0:
            new_row = [0] * len(df.columns)
        else:
            new_list = 1 - sub_df.isna().sum() / curr_len
            new_row = new_list.tolist()
        
        df_short.append(new_row)
    
    return pd.DataFrame(df_short)


def cluster(df):
    T = df
    # Using a scaler on the data to transform it
    scaler = MinMaxScaler()
    scaler.fit(T)
    T = scaler.transform(df)
    
    # KMeans clustering for the shortened
    kmeans = KMeans(
        n_clusters = 4, init = "k-means++",
        n_init = 10,
        tol = 1e-04, random_state = 42)
    kmeans.fit(T)
    
    # Getting clusters
    clusters = pd.DataFrame(T, columns = df.columns)
    clusters["label"] = kmeans.labels_
    
    return clusters


def clusters_to_list(df, clusters):
    # Getting indivicual clusters from the groups
    polar = clusters.groupby("label").mean().reset_index()
    polar = pd.melt(polar,id_vars = ["label"])
    
    print(polar)
    
    
    # 4 clusters used
    cluster_list = [[], [], [], []]
    i = 0
    for col in df.columns:
        if np.argmax(polar.loc[polar["variable"] == i]["value"]) == 0 : cluster_list[0].append(col)
        elif np.argmax(polar.loc[polar["variable"] == i]["value"]) == 1 : cluster_list[1].append(col)
        elif np.argmax(polar.loc[polar["variable"] == i]["value"]) == 2 : cluster_list[2].append(col)
        elif np.argmax(polar.loc[polar["variable"] == i]["value"]) == 3 : cluster_list[3].append(col)
        i += 1
    
    print(cluster_list)
    return cluster_list



def cluster_to_json(cluster_list):
    cluster_dict = {}
    
    cluster_number = 0
    for cluster in cluster_list:
        for col in cluster:
            cluster_dict[col] = cluster_number

        cluster_number += 1
        
    return cluster_dict
            

def cluster_e2e(df):
    out_file = open("trial.json", 'w')
    
    cluster_dict = cluster_to_json(compute_variable_groups(df))
    
    json.dump(cluster_dict, out_file, indent=4)
    out_file.close()
    
    
if __name__ == '__main__':
    cluster_e2e(pd.read_csv("icu_data_with_na_v2.csv"))