import React from "react";
import { fileURLToPath } from "url";
//import getVariablesFromBackend from "../backend/getVariablesFromBackend";
//import postDataToBackend from "../backend/postDataToBackend";
import queryData from "../backend/queryData";
import axios from 'axios';
import { isLabeledStatement } from "typescript";
import { FeatureInfo } from "../types/feature_types";
import { stratify } from "d3";
import loading from "../../public/loading.gif"

function delay(n:number){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}

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


class DataUploadPane extends React.Component<{features: string[], onChange: Function},{isLoading:boolean,uploadError:string|null}> {
    constructor(props: {features: string[], onChange: Function}) {
        super(props);
        this.state = {isLoading: false, uploadError:null};
        this.handleFileSelection = this.handleFileSelection.bind(this);
    }

    async uploadAndReceiveData(file:any) {
        // this function is very similar to queryBackend. It also sends a request and returns data. 
        

        this.setState({isLoading:true, uploadError:null})

        // as usual, to upload file we create a form
        const form = new FormData();
        form.append('file', file, file.name); 
        const headers={'Content-Type': file.type};
        
        // console.log("sending request")

        //dirty fixing of the backend error: just try again until it works
        let result = null;
        let i=0;
        const max_tries=25;
        while (result == null && i <= max_tries){
            try {
                result = await axios.post('http://127.0.0.1:8000/upload-data', form, {headers:headers});
            }
            catch (error:any){

                // // uncomment to debug
                // if (error.response) {
                //     // The request was made and the server responded with a status code
                //     // that falls out of the range of 2xx
                //     console.log(error.response.data);
                //     console.log(error.response.status);
                //     console.log(error.response.headers);
                //   } else if (error.request) {
                //     // The request was made but no response was received
                //     // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                //     // http.ClientRequest in node.js
                //     console.log(error.request);
                //   } else {
                //     // Something happened in setting up the request that triggered an Error
                //     console.log('Error', error.message);
                //   }
                //   console.log(error.config);

                //if max tries is reached
                if (i>=(max_tries-1)){
                    this.setState({isLoading: false, uploadError:"Upload failed, try again"})
                    console.log("max tries exceeded, check the server logs for errors")
                    throw error;
                }
                else {
                    console.log("Upload: try no. "+i.toString())
                    await delay(0.1);
                }
            }
            i= i+1;
        }
        if(result && result.data){
            // this.setState({isLoading: false, uploadError:null})
        }
        else{
            this.setState({isLoading: false, uploadError:"Upload failed, try again"})
            throw new Error("Result or result.data is empty")
        }
        // result.data has the actual message that is sent in the return clause of the server. 
        console.log("Upload: succesful, data received")
        const resultdata = JSON.parse(result.data)
        if (!resultdata.FeatureInfos){
            throw new Error("Data does not have FeatureInfos")
        }
        return resultdata.FeatureInfos
    }
    
    async handleFileSelection(file: any) {

        await delay(0.1)

        // we cannot easily do type-checking after typescript compilation ->
        // careful, the statement "data as FeatureInfo[]" does not actually check in runtime if it conforms to the interface
        // we have no guarantees, if we want to be sure, it might be easier to implement it server-side in pydantic
        const data = await this.uploadAndReceiveData(file); // as FeatureInfo[]
        await this.props.onChange(data);
        this.setState({isLoading: false, uploadError:null})
        
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
                <br></br>
                {this.state.isLoading && <span className="isLoading"><img src="/loading.gif" width={20}></img>Uploading and Clustering...</span>}
                {this.state.uploadError && <span className="uploadError">{this.state.uploadError}</span>}
            </div>
        )
    }
}

export default DataUploadPane;

