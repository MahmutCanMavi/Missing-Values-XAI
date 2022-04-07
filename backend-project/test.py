import pathlib
import pandas as pd


thisfile= str(pathlib.Path(__file__).parent.absolute())
path = thisfile+"/data/icu_data_with_na_v2.csv"

df = pd.read_csv(path)


for i in df["id"].unique():
    print(i)