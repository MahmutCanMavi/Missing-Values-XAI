import pandas as pd


def NaN_per_person(df):
    # Array Size 170 for all 170 patients. To include dictionary of all
    # medical data with correct number suggesting the missing values per
    # category.
    NaN_pp = []
    for i in range(max(df["id"])):
        # Taking the section of data corresponding to singular patients
        sub_df = df.loc[df["id"] == i+1]

        # Dictionary of the missing values per category (max = 96)
        NaNs = {}
        for col in sub_df.columns:
            NaNs[col] = sub_df[col].isna().sum()

        NaN_pp.append(NaNs)

    return NaN_pp


def JSONify(df):

    # Gets individual NaNs from the dataset per patient
    NaN_pp = NaN_per_person(df)

    # Dictionary of JSONs to be stored per feature, each feature
    # having a distinct JSON
    JSONs = {}
    for col in df.columns:

        # variable string is the JSON string which starts of this way
        string = "{ \"feature\" : \"" + col + \
            "\"<str>,\n\"pct_avail_pp\" :\n\t["

        # per patient information will be added in a loop
        pp_information = ""

        # Looping through all patients incrementally
        pid = 1
        for patient in NaN_pp:
            # Since we want the available data, subtract likelihood from 1
            # Division by 96 because is the number sampled per patient
            percentage = 1 - patient[col] / 96

            # Adding to the per patient information string (following the google doc)
            pp_information += "{\"patient_id\":" + \
                str(pid) + "<int>, \"pct_avail\": " + \
                str(percentage) + "<float>}, "
            pid += 1

        # Not including last two characters as they are ", "
        string += pp_information[:-2] + "]\n}"

        # Adding JSON string to the dictionary for its feature
        JSONs[col] = string

    return JSONs


if __name__ == "__main__":
    # Get dataframe from CSV
    df = pd.read_csv("icu_data_with_na_v2.csv")

    # Get a dictionary of all columns' JSONs
    JSONs = JSONify(df)

    # e.g. Print out the heartrate
    print(JSONs["HR"])
