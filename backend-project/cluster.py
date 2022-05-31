import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import silhouette_samples, silhouette_score
from sklearn.manifold import TSNE
#import plotly.graph_objects as go
import numpy as np
import json
import pathlib
import app
import warnings
from pct_avail_pp import pct_avail_known_groups
warnings.filterwarnings('ignore')

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        
        return super(NpEncoder, self).default(obj)

# Block of functions for feature transformations
def get_data():
    try:
        # Uploaded Path
        data = pd.read_csv(app.DATA_PATH)
    except:
        # Hardcoded datapath
        thisfile= str(pathlib.Path(__file__).parent.absolute())
        path = thisfile+"/data/icu_data_with_na_v2.csv"
        data = pd.read_csv(path)
    return data


def get_run_lengths(data):
	rowwise_tally = data.isna()

	start_len, length, max_length = [0] * len(rowwise_tally.columns), [0] * len(rowwise_tally.columns), [0] * len(rowwise_tally.columns)
	sullied = [False] * len(rowwise_tally.columns)

	for feature in range(len(rowwise_tally.columns)):
		for row in rowwise_tally[rowwise_tally.columns[feature]]:
			if row == True:
				if not sullied[feature]: 
					start_len[feature] += 1
				length[feature] += 1
			else:
				sullied[feature] = True
				length[feature] = 0
			max_length[feature] = max(length[feature], max_length[feature])

		max_length[feature] = max(0, max_length[feature] - 1)

	return start_len, length, max_length


def transform(data, feature_transform_method = 1):
    # Method 1 :: replace NaNs with 0 and not NaNs with 1
    if feature_transform_method == 1:
        for col in data.columns:
            data[col].loc[~data[col].isna()] = 1
        return data.fillna(0)
    # Method 2 :: take average values available per patient
    elif feature_transform_method == 2:
        smaller_data = pd.DataFrame(columns=data.columns)

        for i in data["id"].unique():
            # Taking a smaller dataframe wherein only the current patient is used
            sub_df = data.loc[data["id"] == i]
            curr_len = len(sub_df)
            
            # New list is appended by the availability of data
            new_list = 1 - sub_df.isna().sum() / curr_len

            smaller_data.loc[len(smaller_data)] = new_list
        
        return smaller_data
    # Method 3 :: 
    elif feature_transform_method == 3:
        # Dimnesions here will be: 
        # 1 - pct_avail_pp 
        # 2 - std_avail_pp 
        # 3 - mean_missing_run 
        # 4 - longest_missing_run
        smaller_data = pd.DataFrame(columns=data.columns)

        for i in data["id"].unique():
            # Taking a smaller dataframe wherein only the current patient is used
            sub_df = data.loc[data["id"] == i]
            curr_len = len(sub_df)            
            
            # New list is appended by the availability of data
            new_list = 1 - sub_df.isna().sum() / curr_len
            std = np.sqrt(sub_df.isna().sum() - (1 - data.isna().sum() / len(data)) ** 2 / len(sub_df))
            
            start, end, maxx = get_run_lengths(sub_df)
                
            smaller_data.loc[len(smaller_data)] = new_list
            smaller_data.loc[len(smaller_data)] = std
            smaller_data.loc[len(smaller_data)] = start
            smaller_data.loc[len(smaller_data)] = end
            smaller_data.loc[len(smaller_data)] = maxx
        
        return smaller_data.fillna(0)
    else:
        raise ValueError("Feature transform method not present")


# Current method for getting the number of clusters automatically
def auto_cluster_number(data, n_clusters_range = (4,8)):
    # Assuming data is transformed
    avg_scores = []
    
    scaler = MinMaxScaler()
    scaler.fit(data)
    X = scaler.transform(data)
    
    for n_clusters in range(n_clusters_range[0], n_clusters_range[1]):
        model = KMeans(
            n_clusters=n_clusters, init="k-means++",
            n_init=10,
            tol=1e-04, random_state=42
        )
        cluster_labels = model.fit_predict(X)
        silhouette_avg = silhouette_score(X, cluster_labels)
        avg_scores.append(silhouette_avg)
        
        # Compute the silhouette scores for each sample
        sample_silhouette_values = silhouette_samples(X, cluster_labels)
        negs = 0
        max_v_avg_fails = 0
        for i in range(n_clusters):
            ith_cluster_silhouette_values = sample_silhouette_values[cluster_labels == i]
            negs += sum(1 for i in ith_cluster_silhouette_values if i < 0)
            if max(ith_cluster_silhouette_values) < avg_scores[n_clusters - min(n_clusters_range)]: 
                max_v_avg_fails += 1
        negs /= len(sample_silhouette_values) / n_clusters
        avg_scores[n_clusters - min(n_clusters_range)] = avg_scores[n_clusters - min(n_clusters_range)] * ((n_clusters - max_v_avg_fails) / n_clusters) - negs
        
    return np.argmax(avg_scores) + min(n_clusters_range)
    

def auto_cluster_pipeline(transformation_method = 1):

    data = transform(get_data(), transformation_method)
    n_clusters = auto_cluster_number(data)
    FeatureGroups = []
    for i in range(n_clusters): FeatureGroups.append({"id" : i, 
                                                      "name" : f"Cluster {i}"})
    
    labels = cluster(data, n_clusters)
    
    tsne = TSNE(n_components=2, verbose=1, perplexity=20, n_iter=300)
    tsne_results = tsne.fit_transform(data.T)
    
    groups_dict, tsne_list = {}, []
    for i in range(len(data.columns)):
        groups_dict[data.columns[i]] = labels[i]
        tsne_list.append({"feature_name" : data.columns[i],
                          "x" : tsne_results[:,0][i],
                          "y" : tsne_results[:,1][i],
                          "group_id" : labels[i]})
        
    clusterResponse = {}
    # Could add other clustering methods, in that case need to make this variable
    clusterResponse["clusterMethod"] = "KMeans clustering was used"
    clusterResponse["featureInfos"] = pct_avail_known_groups(get_data(), groups_dict)
    clusterResponse["groups"] = FeatureGroups
    clusterResponse["tsneData"] = tsne_list
    
    out_file = open(str(pathlib.Path(__file__).parent.absolute()) + "/data/tmp/clusterResponse.json" , 'w')
    json.dump(json.dumps(clusterResponse, cls = NpEncoder), out_file, indent=4)
    out_file.close()
    
    return clusterResponse


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


def compute_clusters(data, number_of_clusters = 4):
    """
    Takes the datadrame and the wanted number of clusters as inputs.
    
    Outputs the variable groups as a list.
    """
    
    # Functions to shorten the dataset to averages per patient
    # This aides in efficiency whilst not losing much information
    shorter_df = shorten_data(data)
    
    # Clustering algorihtm with optional declaration of requested 
    # number of clusters
    clusters = cluster(shorter_df, number_of_clusters)
    
    # Returns the clusters as a list
    return clusters_dict(clusters_to_list(data, clusters, number_of_clusters))

    
    
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
    T = df.T
    
    # KMeans clustering for the shortened
    kmeans = KMeans(
        n_clusters = number_of_clusters, init = "k-means++",
        n_init = 10,
        tol = 1e-04, random_state = 42)
    # kmeans.fit(T)
    
    # # Getting clusters
    # clusters = pd.DataFrame(T, columns = df.columns)
    # clusters["label"] = kmeans.labels_
    
    # return clusters
    return kmeans.fit_predict(T)


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


def clusters_dict(cluster_list):
    """
    Takes the cluster list as an input.
    
    Outputs a dictionary of " "cluster" : feature[] ".
    """
    cluster_dict = {}
    
    pos = 0
    for clusters in cluster_list:
        cluster_dict[str(pos)] = clusters
        pos += 1 

    return cluster_dict
            

def cluster_e2e(df, number_of_clusters = 4):
    """
    Takes the datadrame and the wanted number of clusters as inputs.
    
    Calls on cluster_to_json to get the dictionary version of the cluster list.
    """
    cluster_dict = cluster_to_json(compute_variable_groups(df, number_of_clusters))
    
    return cluster_dict
    
    
if __name__ == '__main__':
    try:
        # Uploaded Path
        data = pd.read_csv(app.DATA_PATH)
    except:
        # Hardcoded datapath
        thisfile= str(pathlib.Path(__file__).parent.absolute())
        path = thisfile+"/data/icu_data_with_na_v2.csv"
        data = pd.read_csv(path)
        
    print(auto_cluster_pipeline())