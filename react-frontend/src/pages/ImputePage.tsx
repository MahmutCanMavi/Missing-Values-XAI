import { range } from "d3";
import React from "react";
import  { D3DetailSquaresPatient } from "../components/d3detailSquares";
import { FeatureInfo, FeatureGroup, ImputationMethod } from "../types/feature_types";
import { ImputationMenu } from "../components/ImputationMenu";
import ErrorFeatureList from "../components/ErrorFeatureList";
import Icons from "../components/icons";




interface ImputePageProps {
    features: FeatureInfo[] | null;
    groups: FeatureGroup[] | null;
    handleImputationScore: Function;
    setGroups: Function;
    setFeatures: Function;
}

class ImputePage extends React.Component<ImputePageProps,{loading:boolean,appError:string}> {
    constructor(props: ImputePageProps) {
        super(props);
        this.changeGroupAttribute = this.changeGroupAttribute.bind(this);
        this.handleImputation = this.handleImputation.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.state= {loading:false,appError:""};
    }

    changeGroupAttribute(group_id: number | null, attribute_name: string, new_value: any) {
        if (this.props.groups && (group_id !== null)) {
            let newGroups = this.props.groups
            if (newGroups.filter(group => group.id === group_id).length !== 1) {
                Error("Group not found or duplicates" + group_id)
            }

            // check if attribute exists, if yes set its new value
            if (Object.keys(this.props.groups[0]).includes(attribute_name)) {
                // console.log("got here!");
                (newGroups.filter(group => group.id === group_id)[0])[
                    attribute_name as "imputation_method" | "name"] = new_value;
            } else {
                throw new Error("specified invalid attribute of FeatureGroup");
            }

            this.props.setGroups(newGroups)
        }
        else {
            return null
        }
    }

    async handleImputation() {
        
        // Example of how to prepare the data to send it to the backend
        // if (this.props.features && this.props.groups){
        //     let request = {featureInfos: this.props.features.filter(f=>f.group_id!==null).map((f)=>{return {...f,pct_avail_pp:[]}}), 
        //        // groups differ in format: string (name) or object?
        //         groups: this.props.groups.map(g=>{return {...g,imputation_method:g.imputation_method.name}})}
        //     console.log(JSON.stringify(request))
        // }
        // else {
        //     console.log("cannot impute, props are null")
        // }
        this.setState({loading:true})
        try{
        const done= await this.props.handleImputationScore();
        
        if (!done){
            this.setState({loading:false,appError:"Error: imputation failed"})
            console.log(done)
        }}
        catch(err) {
            this.setState({loading:false,appError:"Error: imputation failed"})
            throw err
        }
        this.setState({loading:false})
    }

    handleDownload(){
        // Create blob link to download
        if (this.props.features == null){
            // TO DO 
            // Throw error message!
            let a = null;
        }
        else{
            var featureDownload = this.props.features;
            var b = new Blob([JSON.stringify(featureDownload)], {type : "application/json"})
            const url = window.URL.createObjectURL(
            new Blob([b]),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `FileName.json`,
            );
  
            // Append to html link element page
            document.body.appendChild(link);
  
            // Start download
            link.click();
  
            // Clean up and remove the link
            //link.parentNode.removeChild(link);}
        }
    }

    render(){
        return <>
        <aside className="sidenav">
            {this.props.groups && <ImputationMenu groups={this.props.groups} 
                updateGroupOnChange={(group_id: number, imputation_method: ImputationMethod) => 
                    this.changeGroupAttribute(group_id, "imputation_method", imputation_method)}/>}
            <button className="FullWidthButton" disabled={this.state.loading===false?undefined:true} onClick={this.handleImputation}>Impute!</button>
            {this.state.loading===true && <h3><img src="/loading.gif" width={20}></img>Imputing... please wait</h3>}
            {this.state.appError && <span className="uploadError">{this.state.appError}</span>}
        </aside>
        <main className="main">
           
            <h2>Estimated imputation performance </h2>
            <div className="infobox">
            The imputation score is calculated as follows: 10% of the avilable data is removed and then imputed using the chosen imputation method. To compare these imputations with the baseline, we chose the following formula, a root-mean-squared-error divided by the absolute of the mean: 
            {/*Latex formula, https://latexeditor.lagrida.com/.  \sqrt{\frac{\sum^{N_{10\%}}_{i=1}(\bar{y_i}-y_i)^2}{N_{10\%}}} \cdot\frac{1}{\text{abs(mean(y))}}  */}
            <br></br><img alt="formula:  \sqrt{\frac{\sum^{N_{10\%}}_{i=1}(\bar{y_i}-y_i)^2}{N_{10\%}}} \cdot\frac{1}{\text{abs(mean(y))}} " src="/imputation-score-formula.png" height={60}></img>
            <br/> 
                        </div>
            <p>Legend:</p>
            <div className="imp-error-legend">
                <div className="colorsquare" style={{backgroundColor:"#006837"}}></div>
                <div >Perfect imputation</div>
                <div>{/*spacer*/} </div>
                <div className="colorsquare" style={{backgroundColor:"#a50026"}}></div>
                <div >Very imprecise imputation</div>
                <div className="is-string-box">S</div> feature contains string values*
            </div>
            
            {this.props.features && this.props.features.filter(f=> f.imputation_error!==null).length!==0  &&
            <div>   
            <button onClick={this.handleDownload}><Icons icon="cloud-download"/>  download imputed dataset</button>
            </div>
            }
            {this.props.features && this.props.groups && <ErrorFeatureList 
                    data={this.props.features} 
                    groups={this.props.groups}
                    />}
            <p>* Features with string values or categorical values are always imputed with forward fill</p>
            <p>Important note: This measure of imputation score is not applicable to features where a missing value actually means it is zero. This is the case for example for dosages of drugs: if a value is present, it means that in that timestep the drug was given to the patient. If it is missing, it simply means that this drug was not given in that timestep.  
            These features can be grouped together manually and the missing values can be filled with zeros, but choosing these features needs domain-specific knowledge.
            </p>
        </main>
        
        </>
    }
}

export default ImputePage;