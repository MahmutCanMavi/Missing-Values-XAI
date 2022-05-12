from __future__ import annotations
from typing import List, TypedDict, Union
from pydantic import BaseModel



class PctAvail(TypedDict):
    patient_id: int
    pct_avail: float

class FeatureInfo(TypedDict):
    feature_name: str
    pct_avail_pp: List[PctAvail]
    description: Union[str,None] 
    imputation_error: Union[float ,None] 
    group_id : Union[int, None]

class FeatureGroup(TypedDict):
    name: str
    id: int
    # features: List[str]
    imputation_method: Union[str, None]

class ImputationInputs(BaseModel):
    featureInfos: List[FeatureInfo]
    groups: List[FeatureGroup]

class FeatureInfoList(BaseModel):
    FeatureInfos: List[FeatureInfo]

    # class Config:
    #     schema_extra = [
    #         {"feature_name":"SvO1","description":None,"imputation_error":None,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.2},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}], "group_id":None} ,
    #         {"feature_name":"SvO2","description":None,"imputation_error":None,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.4},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}], "group_id":None},
    #         {"feature_name":"SvO3","description":None,"imputation_error":None,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.6},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}], "group_id":None},
    #         {"feature_name":"SvO4","description":None,"imputation_error":None,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.8},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}], "group_id":None}
    #       ]


# schema_extra = [
#             {"feature_name":"SvO1","description":None,"imputation_error":None,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.2},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}], "group_id":None},
#             {"feature_name":"SvO2","description":None,"imputation_error":None,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.4},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}], "group_id":None},
#             {"feature_name":"SvO3","description":None,"imputation_error":None,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.6},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}], "group_id":None},
#             {"feature_name":"SvO4","description":None,"imputation_error":None,"pct_avail_pp":[{"patient_id":1,"pct_avail":0.8},{"patient_id":2,"pct_avail":0.9484536082474226},{"patient_id":3,"pct_avail":0.7422680412371134},{"patient_id":4,"pct_avail":0.6185567010309279}], "group_id":None}
#           ]


