import React from "react";
import { fileURLToPath } from "url";
//import getVariablesFromBackend from "../backend/getVariablesFromBackend";
//import postDataToBackend from "../backend/postDataToBackend";
import queryData from "../backend/queryData";
import axios from 'axios';


// async function handleUpload(file: any) {
//     const form = new FormData();

//     form.append('file', file, file.name);
//     const headers={'Content-Type': file.type};
//     const res = await axios.post('http://127.0.0.1:8000/data/', form, headers)
    
//     console.log(res)
// }

class DataInput extends React.Component<{onFileSelection: Function},{}> {
    constructor(props: {onFileSelection: Function}) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e: any) {
        this.props.onFileSelection(e.target.files[0]);
    }

    render() {
        return (
            <div>
                <h2>Upload Your Data</h2>
                <input type="file" accept=".csv" onChange={this.handleChange}></input>
            </div>
        )
    }
}


class DataUploadPane extends React.Component<{features: string[], onChange: Function},{}> {
    constructor(props: {features: string[], onChange: Function}) {
        super(props);
        this.handleFileSelection = this.handleFileSelection.bind(this);
    }
    
    handleFileSelection(file: any) {

        // we're grabbing the user-provided file from the file dialog,
        // but not doing anything with it

        queryData("get-dummy").then(response => (this.props.onChange(response))) // in the right format for App component state
    }

    // async uploadFile (e: any) {
    //     const form = new FormData();
    //     form.append('file', e.target.files[0]);
        
    //     let res = await axios.post('http://127.0.0.1:8000/upload_csv_med_data/', form);
        
    //     console.log(res)
    // }

    render() {
        return (
            <div>
                <DataInput onFileSelection={this.handleFileSelection}/>
                <label>
                    Variables:
                    {" " + this.props.features.join(', ')}
                </label>
            </div>
        )
    }
}

export default DataUploadPane;

