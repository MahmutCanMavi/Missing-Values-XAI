import { PctAvail } from './PctAvail';

export interface ErrorInfo {
	feature_name: string;
	pct_avail_pp: PctAvail[];
	cluster_id: number
	error_threshold: number;
}