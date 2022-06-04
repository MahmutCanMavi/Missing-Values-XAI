import numpy as np
import pandas as pd
import pathlib

from sqlalchemy import null
from pct_avail_pp import pct_avail_pp
from math import sqrt
import app
from sklearn.experimental import enable_iterative_imputer 
from sklearn.impute import KNNImputer, IterativeImputer
from random import sample, seed

class Imputation_Method():
    def __init__(self, features: list[str], need_ids : bool = False):
        self.features = features
        # keeping things consistent
        self.random_seed = seed(10)
        self.need_ids = need_ids
        
    def impute(self, data):
        return None, None
    
    def check_features(self, data: pd.DataFrame):
        for feature in self.features:
            if feature not in data.columns:
                raise ValueError("Feature \"" + feature + "\" not in data")
    
    def evaluate_imputation(self, data: pd.DataFrame):
        # copy data, so nothing happens to it
        # maybe not necessary in hindsight
        new_df = data[self.features].copy(deep=True)
        if self.need_ids: new_df["id"] = data.id
        # list is for holding the random samples
        # dict is for holding errors
        to_be_nand, error = [], {}
        for feature in self.features:
            # samples 10% of the non NaN data at random (barring seed)
            to_be_nand.append(sample([i for i, x in enumerate(~data[feature].isna()) if x], 
                                     int(len([i for i, x in enumerate(~data[feature].isna()) if x]) * 0.1)))
            # those random data are NaNd
            for bye in to_be_nand[-1]:
                new_df[feature].loc[bye] = np.NaN
        # impute the data
        imputed, _ = self.impute(new_df)
        for i in range(len(self.features)):
            error[self.features[i]] = 0
            for gone in to_be_nand[i]:
                try :
                    gonedata = float(data[self.features[i]].loc[gone])
                    error[self.features[i]] += (imputed[self.features[i]].loc[gone] - gonedata) ** 2
                except ValueError:
                    print("is strynggg ",self.features[i],imputed[self.features[i]].loc[gone])
                    error[self.features[i]] += np.NaN
                    continue

            
            error[self.features[i]] = sqrt(error[self.features[i]] / len(to_be_nand[i])) / data[self.features[i]].mean()
        return error, imputed
                
class Forward_Fill(Imputation_Method):
    def __init__(self, features: list[str]):
        super().__init__(features, True)
        
    def impute(self, data : pd.DataFrame):
        self.check_features(data)
        out = pd.DataFrame(columns=self.features)
        for patient in data["id"].unique(): 
            out = pd.concat([out, data.loc[data.id == patient][self.features].ffill().fillna(data[self.features].mean())])
        print(out)
        return out, self.features

class Value_Fill(Imputation_Method):
    def __init__(self, features: list[str], value: int or float = 0):
        super().__init__(features)
        self.value = value
    
    def impute(self, data : pd.DataFrame):
        self.check_features(data)
        return data[self.features].fillna(self.value), self.features
    
class Mean_Fill(Imputation_Method):
    def __init__(self, features: list[str]):
        super().__init__(features)
        
    def impute(self, data: pd.DataFrame):
        self.check_features(data)
        data_filled = {}
        for feature_name in self.features:
            data_filled[feature_name] = data[feature_name].fillna(data[feature_name].mean()).to_list()
        return pd.DataFrame(data_filled), self.features
        
class KNN_Impute(Imputation_Method):
    def __init__(self, features: list[str], K:int):
        super().__init__(features)
        self.imputer = KNNImputer(n_neighbors=K)
        
    def impute(self, data: pd.DataFrame):
        self.check_features(data)
        # Gets imputable features i.e. numbers
        self.imputable_features = [s for s in self.features if s in [data.columns[i] for i in range(len(data.dtypes)) if [data.dtypes != object][0].to_list()[i]]]
        imputed_data = self.imputer.fit_transform(data[self.imputable_features])
        return pd.DataFrame(imputed_data, columns = self.imputable_features), self.imputable_features
    
class Iterative_Impute(Imputation_Method):
    def __init__(self, features: list[str]):
        super().__init__(features)
        self.imputer = IterativeImputer(random_state=0)
    
    def impute(self, data: pd.DataFrame):
        self.check_features(data)
        self.imputable_features = [s for s in self.features if s in [data.columns[i] for i in range(len(data.dtypes)) if [data.dtypes != object][0].to_list()[i]]]
        # Two ways of doing this: 
        # 1) impute a smaller version of the data only comprising of the selected features 
        imputed_data = self.imputer.fit_transform(data[self.imputable_features])
        # 2) impute all of the data and return only the selected features
        # (doing (1) for time efficiency)
        return pd.DataFrame(imputed_data, columns = self.imputable_features), self.imputable_features
        

# Function to call from the outside
def errors_e2e(features: list[str], method_name : str, method_parameters):
    # Error selector
    if method_name == "value":
        # Check Parameters
        # method_parameters is an array. filter out "replacementValue"
        repValParam=method_parameters["replacementValue"]

        # check if the replacementValue is numeric.
        if type(repValParam["value"])==str:
            try:
                repVal=float(repValParam["value"])
            except ValueError:
                repVal=0
                print("Warning: replacementValue not a number:", repValParam["value"])
        else:
            repVal=float(repValParam["value"])
        imputer = Value_Fill(features,repVal) 

    elif method_name == "ffill" : imputer = Forward_Fill(features)
    elif method_name == "mean" : imputer = Mean_Fill(features)
    elif method_name == "knn" : 
        # Check Parameters
        # method_parameters is an array. filter out "replacementValue"
        K_param=method_parameters["K"]
        # check if the replacementValue is numeric in case its a string.
        if type(K_param["value"])==str and not K_param["value"].isnumeric():
            K=5
            print("Warning: K not a positive int:", K_param["value"])
        elif int(K_param["value"])<1:
            K=5
            print("Warning: K too small:", K_param["value"], "using default K=5")
        else:
            K=int(K_param["value"])
        imputer = KNN_Impute(features,K)
    elif method_name == "iterative": imputer = Iterative_Impute(features)
    elif method_name == "None": return None
    else:
        print("Error: Imputation method " + str(method_name) + " is not one of the supported imputation methods")
    
    errors, imputed = imputer.evaluate_imputation(pd.read_csv(app.DATA_PATH))
    ErrorInfos = []
    for feature in features:
        # comment david: I extract it in the front-end anyway, we dont neet the pct_avail data here
        pct_avail_dict = {"feature_name":feature} #pct_avail_pp(feature) 
        pct_avail_dict["imputation_error"] = errors[feature]
        ErrorInfos.append(pct_avail_dict)
    return ErrorInfos, imputed
    

if __name__ == '__main__':
    thisfile= str(pathlib.Path(__file__).parent.absolute())
    path = thisfile+"/data/icu_data_with_na_v2.csv"
    data = pd.read_csv(path)
    
    features = ["HR", "theo_bol"]
    
    # imputer = Iterative_Impute(features)
    # print(imputer.impute(data))
    # print(imputer.evaluate_imputation(data))
    print(errors_e2e(features, "mean")[0])