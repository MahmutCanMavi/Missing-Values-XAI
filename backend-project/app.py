from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pandas as pd
import os
import csv
import codecs
import pct_avail_pp
from io import StringIO
# from pydantic_models.example_data_points import ExampleDataResponse
from typing import Callable
from sklearn.cluster import KMeans
import impute

app = FastAPI(
    title="Test Python Backend",
    description="""This is a template for a Python backend.
                   It provides acess via REST API.""",
    version="0.1.0",
)


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


@app.post("/get-data")
def get_data(feature_name: str):
    # data = pd.read_csv(f"data/dataset_{name}.csv")
    # kmeans = KMeans(n_clusters=2, random_state=0).fit(data)
    # labels = kmeans.labels_
    # data["cluster"] = labels.tolist()
    # print(data.head())
    # print(data.to_dict(orient="records"))

    # return data.to_dict(orient="records")
    # print(JSONs[feature_name])
    # print(" Hey Someone accessed this!!!!")
    data = pct_avail_pp.pct_avail_pp(feature_name)

    return data

@app.post("/get-clusters")
def get_cluster(n_clusters: int):
    
    clustered_data = pct_avail_pp.pct_avail_clusters(n_clusters = n_clusters)
    
    return clustered_data

# TODO: Implement this request from frontend
@app.post("/get-errors")
def get_errors(errors: list):
    # call some function
    
    errors = impute.errors_e2e(errors)
    # Does not currently implement any of the other requested features
    return errors


@app.post("/files/")
async def create_file(file: bytes = File(...)):
    return {"file_size": len(file)}


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}


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


def update_schema_name(app: FastAPI, function: Callable, name: str) -> None:
    """
    Updates the Pydantic schema name for a FastAPI function that takes
    in a fastapi.UploadFile = File(...) or bytes = File(...).

    This is a known issue that was reported on FastAPI#1442 in which
    the schema for file upload routes were auto-generated with no
    customization options. This renames the auto-generated schema to
    something more useful and clear.

    Args:
        app: The FastAPI application to modify.
        function: The function object to modify.
        name: The new name of the schema.
    """
    for route in app.routes:
        if route.endpoint is function:
            route.body_field.type_.__name__ = name
            break


update_schema_name(app, create_file, "CreateFileSchema")
update_schema_name(app, create_upload_file, "CreateUploadSchema")
