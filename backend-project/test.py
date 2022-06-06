import app
import pandas as pd
import random
import time

tic = time.perf_counter()
data = pd.read_csv(app.DATA_PATH)
print(len(data) == data["HR"].isna().sum())
n_clusters = 4
cols = [x for x in data.columns.to_list() if x not in app.UNTOUCHABLE]

imp_method_ffill = {"name": "ffill", "parameters": None}
imp_method_mean = {"name": "mean", "parameters": None}
imp_method_iterative = {"name": "iterative", "parameters": None}

method = [imp_method_ffill, imp_method_mean, imp_method_iterative]

featureInfos = [{"group_id": random.randint(1,4), "feature_name" : feature} for feature in cols]
groups = [{"id" : cluster, "imputation_method" : random.choice(method)} for cluster in range(1,n_clusters+1)]

d = {"featureInfos": featureInfos, "groups": groups}

s = app.get_imputations(d)

toc = time.perf_counter()
print(f"Downloaded the tutorial in {toc - tic:0.4f} seconds")