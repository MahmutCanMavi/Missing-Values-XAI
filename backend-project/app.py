from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pandas as pd
import os
import aiofiles
import csv
import codecs
import pct_avail_pp
from io import StringIO
# from pydantic_models.example_data_points import ExampleDataResponse
from typing import Callable
# from sklearn.cluster import KMeans
import impute

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Read in the data and extract the JSON feature representations
# print("If you see this in the console output, everything is fine.")
# df = pd.read_csv(f"data/icu_data_with_na_v2.csv")
# JSONs = jsonify.JSONify()

data = pd.DataFrame()  # this is our data!


@app.get("/")
async def root():
    return data


@app.post("/data")
async def receive_data(file: UploadFile):

    print('got here!')

    # path to temp folder within backend-project
    dest_path = "./data/temp/" + file.filename

    # create file and store in temp folder
    async with aiofiles.open(dest_path, "wb") as out_file:
        while content := await file.read(1024):
            await out_file.write(content)

    # read file
    """
    f = open(dest_path, "rb")
    content = f.read()
    """

    global data
    data = pd.read_csv(dest_path)
    variables = list(data.columns)

    # uncomment if you want to remove file after upload
    # os.remove(dest_path)

    return {"variables": variables}


@app.get("/variables")
async def get_variables():
    return list(data.columns)


@app.post("/get-data")
def get_data(feature_name: str):

    data = pct_avail_pp.pct_avail_pp(feature_name)

    return data


@app.post("/get-clusters")
def get_cluster(n_clusters: str):

    print("New cluster number has been entered, loading ...")
    print("Number of clusters is: " + str(n_clusters))
    print("List if cluster id is: ")
    n_clusters = int(n_clusters)
    clustered_data = pct_avail_pp.pct_avail_clusters(n_clusters=n_clusters)
    string_list = ''
    for item in clustered_data["FeatureInfos"]:
        string_list += str(item["cluster_id"])
    print(string_list)

    return clustered_data


@app.post("/get-errors")
def get_errors(errors: list):
    # Need to add a way to implement this s.t. the imputation
    # method can be specified
    errors = impute.errors_e2e(errors)

    return errors
