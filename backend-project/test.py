import app
val_fill_params = {"mode": "int", "name": "value", "value" : 5}

imp_method_ffill = {"name": "ffill", "parameters": None}
imp_method_mean = {"name": "mean", "parameters": None}
imp_method_value = {"name": "value", "parameters": val_fill_params}

featureInfos = [{"group_id": 1, "feature_name" : "HR"}, {"group_id": 1, "feature_name" : "theo_bol"}, {"group_id": 2, "feature_name" : "Na"}]
groups = [{"id": 1, "imputation_method":imp_method_ffill}, {"id": 2, "imputation_method":imp_method_value}]

d = {"featureInfos": featureInfos, "groups": groups}

s = app.get_imputation(d)