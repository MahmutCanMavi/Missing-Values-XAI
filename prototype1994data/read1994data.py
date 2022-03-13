import pandas as pd
#import numpy as np
import pathlib
import seaborn as sns
import matplotlib.pyplot as plt
import datetime


""" Contents of Monitor-Data-Codes

1	Ventilation Mode	0: Pressure-controlled, 1: Hand bagging
4	Mainframe alarms suspended	(Boolean)
7	Trace 1 ECG -> Heart rate 	(bpm)
19	Arterial pressure - Mean 	(mm Hg)
20	Arterial pressure - Systolic 	(mm Hg)
21	Arterial pressure - Diastolic 	(mm Hg)
22	Arterial Heart rate 	(bpm)
59	Arterial O2 saturation 	(%)
76	Volume fraction of inspired oxygen (FiO2) 	(%)
80	Ventilator Data - Respiration rate 	(breaths/min)
81	Ventilator Data - Tidal volume 	(cc/breath)
83	Ventilator Data - PIP 	(cm H2O)
84	Ventilator Data - Mean Airway Pressure 	(cm H2O)
85	Ventilator Data - PEEP 	(cm H2O)
99  Fake data that is    always 1 and has 1 measurement/s

"""
ROLLING_AVG_WINDOW= 300 #in seconds


thisfile= str(pathlib.Path(__file__).parent.absolute())
df = pd.read_csv(thisfile+'/ICU-Data/Monitor-Data', sep="\t", header=None)
# change the pandas dataframe column names
# ColID is the Monitor-Data-Code, the meaning and unit of "Value" 
df= df.set_axis(["Datetime","ColID","Value"], axis=1)


# add fake date to differetiate between evening and morning 
#    because in the dataset, no date is given, only the time
mask_evening=(df['Datetime']>"23:21:41").values
df.loc[mask_evening,['Datetime']]="1994-01-01 "+df['Datetime']
df.loc[mask_evening==False,['Datetime']]="1994-01-02 "+df['Datetime']
# convert to datetime because to make it numerical, not categorical
df.Datetime = df.Datetime.apply(lambda x: datetime.datetime.strptime(x, '%Y-%m-%d %H:%M:%S'))

# add fake measurements to have at least one measurement per second
duration=(df.Datetime.iloc[-1]-df.Datetime.iloc[0]).seconds
datetimes = [df.Datetime[0]+datetime.timedelta(seconds=i) for i in range(duration)]
col_ids = [99 for i in range(duration)]
fakevalues = [1 for i in range(duration)]
df=pd.concat([df,pd.DataFrame({"Datetime":datetimes,"ColID":col_ids,"Value":fakevalues})])



df.index=df['Datetime']

# in the end the 'whatsMeasured' Monitor-Data-Code description is not used, but could be used somewhere

# long to wide data format
df_wide=df.pivot(columns="ColID", values="Value")

#table of missing values
df_isna=df_wide.iloc[:,:].isna()

# average over truth values, rolling average of x timesteps = share of missing values
df_share_missing = df_isna.rolling(window=ROLLING_AVG_WINDOW).mean()
df_share_missing['Datetime']=df_share_missing.index

#choosing only 3 columns: 7,19,80  
# = Trace 1 ECG -> Heart rate, Arterial pressure - Mean, Ventilator Data - Respiration rate 	
df_missing_long=df_share_missing.loc[:,[7,19,80,"Datetime"]].melt(id_vars="Datetime")

# read the measurement descriptions (Monitor-Data-Codes)
df2 = pd.read_csv(thisfile+'/ICU-Data/Monitor-Data-Codes', sep="\t", header=None)

df_missing_long=df_missing_long.merge(df2.rename({0:'whatsMeasuredID', 1: 'whatsMeasured', 2: 'unit' }, axis=1),left_on="ColID", right_on='whatsMeasuredID', how="left")
# check if the merge is ok, no NaNs in whatsMeasured
#print(df[df['whatsMeasured'].isna()].empty)


# combine description and unit
df_missing_long['whatsMeasured']= df_missing_long['whatsMeasured'] +df_missing_long['unit']
df_missing_long=df_missing_long.drop(['unit'], axis=1)

# transform to percentage
df_missing_long['availableValues(%, avg per second)']=(1-df_missing_long['value'])*100
# Plot the rolling avg of missing values (1=always missing, 0=not missing)
sns.lineplot(x="Datetime",y="availableValues(%, avg per second)",hue="whatsMeasured",data=df_missing_long)
plt.savefig(thisfile+'/missing_values_rolling_avg.png')


