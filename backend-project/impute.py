import numpy as np
import pandas as pd
import pathlib
import json
import pct_avail_pp
import math



# Function to call from the outside
def errors_e2e(features: list, method = "ffill"):
    errors = evaluate_imputation(impute(features), method = method)
    
    ErrorInfos = []
    for feature in features:
        pct_avail_dict = pct_avail_pp.pct_avail_pp(feature)
        pct_avail_dict["error_threshold"] = errors[feature]
        ErrorInfos.append(pct_avail_dict)
    
    return ErrorInfos


def impute(features : list, method = "mean", manual_data = pd.DataFrame()):
    """
    Implements a filling procedure on all features with requested method
    
    Input: Name of the features to imput and method to do so (list, string)
    
    Output: Dictionary of imputed features (dict)
    """
    
    if not manual_data.empty:
        if type(manual_data) == pd.DataFrame:
            data = manual_data
        else:
            raise ValueError("manual data not a pd series")
    else:
        thisfile= str(pathlib.Path(__file__).parent.absolute())
        path = thisfile+"/data/icu_data_with_na_v2.csv"
        data = pd.read_csv(path)
    
    imputed_output = {}
    for feature in features:
        if method == "ffill": imputed_output[feature] = forward_fill(feature, data)
        elif method == "mean": imputed_output[feature] = mean_fill(feature, data)
        # ... future methods to be added
    
    return imputed_output


def forward_fill(feature_name : str, data : pd.DataFrame):
    """
    Implements a forward fill on a single feature.
    
    Input: Name of the feature to impute in the current dataset (string)
    
    Output: The featrue column where forward fill has been applied (list)
    """
    
    # Cursory check whether the feature requested is in the dataset
    if feature_name not in data.columns:
        raise ValueError("Feature name not in dataset")
    
    return data[feature_name].ffill().to_list()



def mean_fill(feature_name : str, data : pd.DataFrame):
    """
    Implements a mean fill on a single feature.
    
    Input: Name of the feature to impute in the current dataset (string)
    
    Output: The featrue column where forward fill has been applied (list)
    """
    
    # Cursory check whether the feature requested is in the dataset
    if feature_name not in data.columns:
        raise ValueError("Feature name not in dataset")
    
    return data[feature_name].fillna(data[feature_name].mean()).to_list()


# Other impuatation methods...

def get_longest_consecutive_run(data: pd.DataFrame, feature: str):
    
    tally_per_row = data[feature].isna()
    group = tally_per_row.diff().cumsum().fillna(0)
    na_counts = tally_per_row.groupby(group).sum()
    
    positions = pd.Series(np.arange(len(data))).groupby(group).agg([np.min, np.max])
    
    max_consecutive = positions.loc[np.argmax(positions.amax - positions.amin)]
    
    return (int(max_consecutive.amin), int(max_consecutive.amax))


def get_comp(data: pd.DataFrame, feature: str, run: tuple, method = str):
    # Main aim is to duplicate the dataset, but remove the longest run of available features 
    # to measure some sort of error. Very illogical and nonsensical !!
    local_data = data.copy(deep=True)
    local_data[feature].loc[run[0] : run[1]] = np.NaN
    
    return pd.Series(impute([feature], manual_data = local_data, method = method)[feature])


def evaluate_imputation(imputed_outputs : dict, method = "ffill"):
    """
    // Admittedly very shoddy version of finding a notion of error in the imputation strategies.
    
    Input: the imputed outputs from the impute function (dict)
    
    Output: Errors as integers in a dictionary (dict)
    """
    thisfile= str(pathlib.Path(__file__).parent.absolute())
    path = thisfile+"/data/icu_data_with_na_v2.csv"
    
    data = pd.read_csv(path)
    
    
    error = {}
    # Error (RMSE) calculation per feature
    for feature in imputed_outputs:
        run = get_longest_consecutive_run(data, feature)
        comparison = get_comp(data, feature, run, method)
        
        error[feature] = 0
        # std = data[feature].loc[run[0] : run[1]].std()
        # mean = data[feature].loc[run[0] : run[1]].mean()
        
        for i in range(run[0], run[1]):
            error[feature] += (imputed_outputs[feature][i] - comparison[i])**2
        
        error[feature] = math.sqrt(error[feature] / (run[1] - run[0]))
        
    return error
    


if __name__ == '__main__':
    # feature = "HR"
    print(errors_e2e(["HR", "PAPs"], method = "mean")[0])
    # pass