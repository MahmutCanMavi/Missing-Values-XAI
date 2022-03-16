import json


def JSONify(feature_name):

    # load data
    path = "data/trial.json"
    f = open(path)
    data = json.load(f)

    # select data
    visualiza_data = data[feature_name]
    fearure_dict = []
    keys = visualiza_data.keys()
    for key in keys:
        key_int = int(key)
        value = visualiza_data[key]
        entry = dict()
        entry["patient_id"] = key_int
        entry["pct_avail"] = value
        fearure_dict.append(entry)

    FeatureInfo = dict()
    FeatureInfo["feature_name"] = feature_name
    FeatureInfo["pct_avail_pp"] = fearure_dict

    return FeatureInfo

    


if __name__ == "__main__":
    # Kind Remind
    # result = JSONify("HR")
    # print(result)
    print("Please import the function JSONify instead of excute this file directly")
