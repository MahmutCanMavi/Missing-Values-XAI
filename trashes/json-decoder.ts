import { JsonDecoder } from 'ts.data.json';
import { DataPoint } from '../types/DataPoint';
import { PctAvail } from '../types/PctAvail';

/* **********
 * number[] *
 ********** */
const dataPointDecoder = JsonDecoder.object<DataPoint>(
    {
        X1: JsonDecoder.number,
        X2: JsonDecoder.number,
        cluster: JsonDecoder.number
    },
    'DataPoint'
);

/* **********
 * PctAvail *
 ********** */
const pctAvailDecoder = JsonDecoder.object<PctAvail>(
    {
        patient_id: JsonDecoder.number,
        pct_avail: JsonDecoder.number
    },
    'PctAvail'
);

/* ***********
 * DataArray *
 *********** */
export const dataArrayDecoder = JsonDecoder.array<DataPoint>(dataPointDecoder, 'DataArray');

/* *************
 * FeatureInfo *
 ************* */
export const featureInfoDecoder = JsonDecoder.array<PctAvail>(pctAvailDecoder, 'FeatureInfo');
