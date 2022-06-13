from http.client import UNAUTHORIZED
from fastapi import FastAPI, UploadFile, File, HTTPException, Response
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import uvicorn
import pandas as pd
import os

import aiofiles
import csv
import json

import pct_avail_pp
# from io import StringIO
from pydantic_models.feature_info import FeatureInfoList, FeatureGroup, ImputationInputs
from pydantic import ValidationError

# from sklearn.cluster import KMeans
import impute
import cluster

from json import JSONEncoder, dumps, dump
import numpy as np

global DATA_PATH
global UNTOUCHABLE
DATA_PATH = os.getcwd() + "/data/tmp/data.csv"
UNTOUCHABLE = ["id", "time", "rowid"]

# error for serialization
class NpEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        
        return super(NpEncoder, self).default(obj)


app = FastAPI(debug=True)

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:3000"],
    allow_methods=["GET","POST"],
    allow_headers=["*"],
)

# Read in the data and extract the JSON feature representations
# print("If you see this in the console output, everything is fine.")
# df = pd.read_csv(f"data/icu_data_with_na_v2.csv")
# JSONs = jsonify.JSONify()


@app.get("/", response_class=HTMLResponse)
async def root():
    html_content = """
        <html>
            <head>
                <title>Week 2</title>
            </head>
            <body>
                <h1>Test Python Backend</h1>
                Visit the <a href="/docs">API doc</a> (<a href="/redoc">alternative</a>) for usage information.
            </body>
        </html>
        """
    return HTMLResponse(content=html_content, status_code=200)


    
@app.post("/upload-data")
async def receive_data(file: UploadFile):
    # Currently only accept csvs
    if file.filename.split(".")[-1] == "csv" : 
        # path to temp folder within backend-project

        # TODO: check if folder tmp exists and create it if not
        if not os.path.exists(os.getcwd() + "/data/tmp"):
            os.makedirs(os.getcwd() + "/data/tmp")
        
        dest_path = os.getcwd() + "/data/tmp/data.csv"
        
        # No updating available for static dashboard
        # TODO: means to update the data added
        # if os.path.exists(dest_path):
        #     return dumps(pct_avail_pp.pct_avail_all(), cls = NpEncoder)
        
        # TODO: explanations csv read in parallel to the data itself

        # create file and store in temp folder
        async with aiofiles.open(dest_path, "wb") as out_file:
            while content := await file.read(1024):
                await out_file.write(content)
        
        clusterinfo = pct_avail_pp.pct_avail_all()
    
        # print(clusterinfo["FeatureInfos"][0])


        # this prints an error if it does not conform to the data type
        # we should do this here because we cannot do it in the frontend
        try:
            FeatureInfoList(**clusterinfo)
        except ValidationError as e:
            print("Validation error",e.json()[0:500])
        
        # Guaranteeing that data is as expected
        """from Talu- idk idf this works with async"""
        # data = pd.read_csv(DATA_PATH)
        # for feature in UNTOUCHABLE:
        #     if data[feature].isna().sum() > 0: return Response("Imputation method " + str(group["imputation_method"]) + " is not one of the supported imputation methods", status_code = 500)

        return dumps(clusterinfo, cls = NpEncoder)
    
    else:
        return Response(f"Need file of type .csv, received type {file.filename}", status_code = 500)


@app.post("/get-clusters")
def get_cluster(transformation_method : str = 1):

    return dumps(cluster.auto_cluster_pipeline(int(transformation_method)), cls=NpEncoder)

@app.post("/impute")
def get_imputations(inputs: dict):
    """
    Inputs: - features as a list of featureInfos to be imputed
            - groups declaring the imputation methods for each group
            
    Output: FeatureInfos with imputation methods according to the feature of each group
    """
    data = pd.read_csv(DATA_PATH)
    string_features = data.select_dtypes(object).columns.to_list()
    
    groups = {}
    group_ids = [x["id"] for x in inputs["groups"]]
    
    for group in inputs["groups"]:
        groups[group["id"]] = group
        features = []
        for featureInfo in inputs["featureInfos"]:
            if "group_id" not in featureInfo:
                print("Has no group_id attribute",featureInfo)
            if featureInfo["group_id"]==None:
                continue
            if featureInfo["group_id"] not in group_ids:
                continue
            if featureInfo["feature_name"] in UNTOUCHABLE:
                continue
            if featureInfo["feature_name"] in string_features:
                continue
            if len(data) == data[featureInfo["feature_name"]].isna().sum():
                continue
            if featureInfo["group_id"] == group["id"]: 
                features.append(featureInfo)
        groups[group["id"]]["features"] = features
    
    group_ids.append(max(group_ids) + 1)
    groups[max(group_ids)] = {"id": max(group_ids),
                  "imputation_method" : {"name" : "string",
                                         "parameters" : None}, 
                  "features" : [{"group_id": max(group_ids), "feature_name" : x} for x in string_features]
                  }

    
    outfeatureInfos = []
    for idx in group_ids:
        imputation_method = groups[idx]["imputation_method"]
        if imputation_method["name"] == "None" :
            imputable_features = [feat["feature_name"] for feat in groups[idx]["features"]]
            outfeatureInfos.extend([{"feature_name": name, 
                                       "imputation_error" : None, 
                                       "is_string" : None} for name in imputable_features])
            # print(outfeatureInfos)
        else:
            imputable_features = [feat["feature_name"] for feat in groups[idx]["features"]]
            parameters = imputation_method["parameters"]
            # print(parameters)
            error, imputation = impute.errors_e2e(imputable_features, imputation_method["name"], parameters)
            
            data[imputable_features] = imputation
            outfeatureInfos.extend(error)
    
    # Store imputed data to disk
    dest_path = os.getcwd() + "/data/tmp/imputed_data.csv"
    data.to_csv(dest_path)
    
    # Store json response to disk
    out_file = open(os.getcwd() + "/data/tmp/imputeResponse.json" , 'w')
    dump(dumps(outfeatureInfos, cls = NpEncoder), out_file, indent=4)
    out_file.close()
    
    return dumps(outfeatureInfos, cls= NpEncoder)


# @app.post("/get-errors")
# def get_errors(errors: list, imputation_method: str = "ffill"):
#     # Need to add a way to implement this s.t. the imputation
#     # method can be specified
#     errors = impute.errors_e2e(errors, method = imputation_method)
    
#     return dumps(errors, cls=NpEncoder)
@app.post("/imputed_data")
def get_imputation():
    data_path = os.getcwd() + "/data/tmp/imputed_data.csv"
    data = {}
    with open(data_path) as file:
        reader = csv.DictReader(file)
        for row in reader:
            id = str(row["id"])+ "-" + str(row["time"])
            del row[""]
            data[str(id)] = row
    file.close()
    return dumps(data, cls= NpEncoder)

@app.get("/imputed_data.csv")
async def main():
    data_path = os.getcwd() + "/data/tmp/imputed_data.csv"
    return FileResponse(data_path)

@app.post("/get-fulldata")
def get_cluster(feature_name: str):

    
    data = pd.read_csv(DATA_PATH)
    datana=data.isna()
    # put back the patient ids so we can group by
    datana["id"]=data["id"]
    # sum all nan's per patient
    naPerPatient=datana.groupby("id").sum().sum(axis=1)
    # sort patients by total nan's (not per feature), 
    # such that it is the same order of patients for all features and thus stays comparable
    sortedPatientIds= naPerPatient.sort_values().keys().values
    # only keep id, time and the desired feature
    fulldata=data.loc[:,["id","time",feature_name]]
    # this also creates nans for timestaps that are missing for a patient for all features
    fullpivot = fulldata.pivot(index="id", columns="time", values=feature_name)
    
    # sort
    fullpivot=fullpivot.loc[sortedPatientIds,:]
    # years is from previous plot, its actually hours
    returndict= {"values":fullpivot.values,"names":fullpivot.index.values,"years":fullpivot.columns.values}
    return dumps(returndict, cls=NpEncoder)

@app.post("/get-fulldata-patient")
def get_cluster(patient_id: int):

    
    data = pd.read_csv(DATA_PATH)
    pat= data.loc[data["id"]==patient_id,:]
    pat.index=pat["time"]
    #make it square. add missing timestamps as nan
    for i in range(0,97):
        if i not in pat.index:
            pat.loc[i,:]=np.NaN
    patna=pat.T
    
    returndict= {"values":patna.values,"names":patna.index.values,"years":patna.columns.values}
    return dumps(returndict, cls=NpEncoder)


############################
# Previous Implementations
############################


# @app.post("/upload-data")
# async def upload(file: UploadFile = File(...)):
    
#     # if file is not .csv, return error

    
#     # security: this filename might need to be escaped to be sure
#     dest_path = str(pathlib.Path(__file__).parent.absolute()) + "/data/temp/" + file.filename
#     contents = await file.read()
#     save_file( dest_path, contents)
#     data = pd.read_csv(dest_path)
#     variables = list(data.columns)

#     # uncomment if you want to remove file after upload
#     # os.remove(dest_path)
    

#     # uncomment if you want to remove file after upload
#     # os.remove(dest_path)

#     return {"variables": variables}
#     #return get_dummy()


# @app.post("/get-data")
# def get_data(feature_name: str):

#     data = pct_avail_pp.pct_avail_pp(feature_name)

#     return data


# @app.post("/get-clusters")
# def get_cluster(n_clusters: str):

#     print("New cluster number has been entered, loading ...")
#     print("Number of clusters is: " + str(n_clusters))
#     print("List if cluster id is: ")
#     n_clusters = int(n_clusters)
#     clustered_data = pct_avail_pp.pct_avail_clusters(n_clusters=n_clusters)
#     string_list = ''
#     print(type(clustered_data["FeatureInfos"]))
#     for item in clustered_data["FeatureInfos"]:
#         string_list += str(item["cluster_id"])
#     print(string_list)

#     return json.dumps(clustered_data, cls=NpEncoder)

# @app.post("/get-errors")
# def get_errors(errors: list):
#     # Need to add a way to implement this s.t. the imputation
#     # method can be specified
#     errors = impute.errors_e2e(errors)


# Tried something that worked, but not very asynchronous at all
# @app.post("/uploadfile/")
# async def create_upload_file(file: UploadFile):
#     thisfile= str(pathlib.Path(__file__).parent.absolute())
#     with open(thisfile + "/data/tmp/" + file.filename, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     return {"filename" : file.filename}


