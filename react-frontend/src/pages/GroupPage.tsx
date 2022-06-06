
import React from "react";
import ClusterViz from "../components/ClusterViz";
import D3Scatterplot from "../components/d3scatterplot";
import FilterFeatures from "../components/FilterFeatures";
import Icons from "../components/icons";
import { ImputationMenu } from "../components/ImputationMenu";
import SelectPctAvailGradient from "../components/SelectPctAvailGradient";
import { IMPUTATION_METHODS, FeatureInfo, FeatureGroup, ImputationMethod, tsneDataPoint } from "../types/feature_types";
import ClusterMenu from "../components/ClusterMenu"

import {groupcolor} from '../components/groupcolor'

interface GrouGroupNameEditorProps {
    group: FeatureGroup, 
    N: number, 
    onConfirmNewName: Function, 
    onClickGroup: any, 
    onRemoveGroup: any, 
    isActive: boolean
}


class GroupNameEditorComponent extends React.Component<GrouGroupNameEditorProps, { text: string, isEditing: boolean }>{

    constructor(props: GrouGroupNameEditorProps) {
        super(props);
        this.state = { text: this.props.group.name, isEditing: false };
        this.handleChange = this.handleChange.bind(this);
        this.handleChoice = this.handleChoice.bind(this);
    }
    handleChange(e: any) {
        this.setState({ text: e.target.value });
    }

    handleChoice(e: any) {
        this.props.onConfirmNewName(this.state.text);
        this.setState({ isEditing: false })
    }
    render() { // Old Text: Which feature do you want to use? (adre_bol, adre_iv, PAPs, HR, CVPm, PVR, urine, Na, temp, pH, pO2)
        // console.log("name choice component rendered")    
        return (
            <div className={this.props.isActive?"group-row active":"group-row"} onClick={this.props.onClickGroup}>
                <div style={{ backgroundColor: groupcolor(this.props.group.id) }} className="group-colorbar"></div>


                {this.state.isEditing === false &&

                    <>
                        <div className="group-name">
                            <label>
                                {this.props.group.name}, N: {this.props.N}
                            </label><span>&nbsp;&nbsp;</span>
                            <div className="iconbutton" title="Edit Group Name" onClick={() => this.setState({ isEditing: true })}><Icons icon="edit" /></div>
                        </div>
                        <div className="group-buttons">

                            <div title="Delete Group" className="iconbutton" onClick={() => this.props.onRemoveGroup()}><Icons icon="trash" /></div>
                        </div>
                    </>
                }
                {this.state.isEditing &&
                    <> <input
                        id="data-choice"
                        onChange={this.handleChange}
                        value={this.state.text}
                    />   <span>&nbsp;&nbsp;</span>
                        <button onClick={this.handleChoice}>
                            Confirm
                        </button></>}
            </div>

        );
    }
}

class JsonGroupEditor extends React.Component<GroupPageProps, { textarea: string, error: string | null, activeGroup: number | null }> {
    constructor(props: GroupPageProps) {
        super(props);
        this.state = { textarea: JSON.stringify(this.props.groups, null, 2), error: null, activeGroup: null }
        this.handleTextareaChange = this.handleTextareaChange.bind(this);
        this.handleTextareaChoice = this.handleTextareaChoice.bind(this);
        this.resetTextarea = this.resetTextarea.bind(this);


    }
    handleTextareaChange(e: any) {
        this.setState({ textarea: e.target.value, error: null });
    }
    resetTextarea() {

        this.setState({ textarea: JSON.stringify(this.props.groups, null, 2), error: null })
    }

    handleTextareaChoice(e: any) {


        let groups = null;
        try {
            groups = JSON.parse(this.state.textarea)
            this.props.setGroups(groups)
        }
        catch (error: any) {
            console.log(error)
            this.setState({ error: error.message })
            return
        }


    }
    checkTextareaHasChanged() {
        return JSON.stringify(this.props.groups, null, 2) != this.state.textarea;
    }

    render() {
        // <div className="group">{featureGroup.feature_name} 
        //             <input defaultValue={featureGroup.feature_name}></input> 
        //             <button onClick={this.changeGroupName(featureGroup.feature_name)}>Save</button>
        //         </div>
        // style={{padding:10}}
        // console.log("group page rendered")
        return (

            <div className="JSON-group-editor" style={{ marginTop: 300 }}>
                For testing &amp; development: groups as JSON
                {this.state.error && <pre>error : {this.state.error}</pre>}
                <div>
                    {this.checkTextareaHasChanged() && <span>State != text field</span>}
                </div>


                <textarea
                    style={{ width: 300, height: 200, backgroundColor: "#eee" }}
                    id="data-choice"
                    onChange={this.handleTextareaChange}
                    value={this.state.textarea}
                />
                <button onClick={this.handleTextareaChoice}>
                    Confirm
                </button>
                <button onClick={this.resetTextarea}>
                    reset text to groups state
                </button>
            </div>

        )
    }


}
interface GroupPageProps {
    features: FeatureInfo[] | null;
    groups: FeatureGroup[] | null;
    setGroups: Function;
    setFeatures: Function;
    tsnedata:tsneDataPoint[];
}

class GroupPage extends React.Component<GroupPageProps, { activeGroupId: number | null }> {
    constructor(props: GroupPageProps) {
        super(props);
        this.state = { activeGroupId: null }

        this.selectActiveGroup = this.selectActiveGroup.bind(this);
        this.removeGroup = this.removeGroup.bind(this);
        this.removeFromGroup = this.removeFromGroup.bind(this);
        this.addToActiveGroup = this.addToActiveGroup.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.changeGroupAttribute = this.changeGroupAttribute.bind(this);

    }

    // obsolete function, 
    // subsumed by changeGroupAttribute(group_id, attribute_name = "name", new_value = newName)
    changeGroupName(group_id: number, newName: string) {
        // console.log(index,newName)
        if (this.props.groups) {
            let newGroups = this.props.groups
            if (newGroups.filter(group => group.id === group_id).length !== 1) {
                Error("Group not found or duplicates" + group_id)
            }
            newGroups.filter(group => group.id === group_id)[0].name = newName
            // console.log(groups)
            this.props.setGroups(newGroups)
        }
        else {
            return null
        }
    }

    changeGroupAttribute(group_id: number | null, attribute_name: string, new_value: any) {
        if (this.props.groups && (group_id !== null)) {
            let newGroups = this.props.groups
            if (newGroups.filter(group => group.id === group_id).length !== 1) {
                Error("Group not found or duplicates" + group_id)
            }

            // check if attribute exists, if yes set its new value
            if (Object.keys(this.props.groups[0]).includes(attribute_name)) {
                console.log("got here!");
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


    addGroup() {
        const groups = this.props.groups;
        if (groups === null) {
            return;
        }
        const new_id: number = Math.max(...groups.map(group => group.id), -1) + 1;
        const new_group: FeatureGroup = { id: new_id, name: `New Group (${new_id})`,
                                          imputation_method: IMPUTATION_METHODS[0] };
        this.props.setGroups([...groups, new_group]);
    }

    removeGroup(group_id: number) {

        // const group_id=0;
        const newgroups = this.props.groups?.filter(group => group.id !== group_id);
        const newdata = this.props.features?.map(feature => {
            if (feature.group_id === group_id) {
                // console.log({...feature, group_id:null});
                return { ...feature, group_id: null };

            }
            else return feature
        })

        this.props.setFeatures(newdata);
        this.props.setGroups(newgroups);
        this.setState({ activeGroupId: null })
    }
    selectActiveGroup(index: number) {
        // console.log(index)
        this.setState({ activeGroupId: index })
    }
    removeFromGroup(feature_name: string) {
        const newdata = this.props.features?.map(feature => {
            if (feature.feature_name === feature_name) {
                // console.log({...feature, group_id:null});
                return { ...feature, group_id: null };

            }
            else return feature
        })

        this.props.setFeatures(newdata);
        return
    }
    addToActiveGroup(feature_name: string) {
        if (this.state.activeGroupId === null) {
            console.log("no active group to add to");
            return
        }
        else {
            const newdata = this.props.features?.map(feature => {
                if (feature.feature_name === feature_name) {
                    // console.log({...feature, group_id:null});
                    return { ...feature, group_id: this.state.activeGroupId };

                }
                else return feature
            })

            this.props.setFeatures(newdata);
        }
    }

    render() {

        return (
            <>
                <aside className="sidenav">
                    {/* list of all groups, you can add, remove, edit name, click to edit members/set active */}
                    <div>{this.props.groups?.map(
                        (featureGroup, i) => <GroupNameEditorComponent
                            key={featureGroup.id}
                            group={featureGroup}
                            isActive={featureGroup.id===this.state.activeGroupId}
                            // Number of members (features in the group)
                            N={this.props.features?.filter(feature => feature.group_id === featureGroup.id).length || 0}
                            onConfirmNewName={(newName: string) => this.changeGroupName(featureGroup.id, newName)}
                            onClickGroup={() => this.selectActiveGroup(featureGroup.id)}
                            onRemoveGroup={() => this.removeGroup(featureGroup.id)}
                        />
                    )
                    }
                    </div>
                    <button onClick={this.addGroup} className="FullWidthButton">Add New Group</button>
                    <br></br>

                    {/* Visualize the Group Structure -- how good is the choice of groups? */}
                    <div className="infobox"><Icons icon="info-circle"/> &nbsp;
                    By clustering features into different groups according to their missing value patterns, we can choose different imputation method suitable for different missing value patterns.
                    </div>
                    <br></br>
                    <ClusterViz tsnedata={this.props.tsnedata}/>
                    {/* textarea to edit the groups object manually. Can be removed for deployment 
                    <JsonGroupEditor features={this.props.features} groups={this.props.groups}
                        setFeatures={this.props.setFeatures} setGroups={this.props.setGroups} />*/}
                    {/* <ClusterMenu/> */}
                </aside>
                <main className={(this.state.activeGroupId !== null)?"main maingrid":"main"}>
                    {/* If there is no active group, display only "Choose group" */}
                    {this.props.groups && this.state.activeGroupId === null && 
                            <div>
                                <h3>Choose Group</h3>
                                {"<--"} Click on a group to choose its features.
                                {/* <ClusterViz tsnedata={this.props.tsnedata} /> */}
                            </div>}

                    <div className="main-left">
                        

                        {/* Center column: Show name and filters of active group */}
                        {this.props.groups && this.state.activeGroupId !== null &&
                            this.props.groups.filter(group => group.id === this.state.activeGroupId).length !== 0 &&
                            <>
                                <h2> Selected Group: <em>{this.props.groups.filter(group => group.id === this.state.activeGroupId)[0].name}</em>  </h2>
                                <div>Filters: {this.props.groups.filter(group => group.id === this.state.activeGroupId)[0].filters?.join(",  ") || "none"}</div>
                                <div>Imputation Method: {
                                        <select value={
                                            this.props.groups.filter(group => group.id === this.state.activeGroupId)[0].imputation_method.name
                                        } onChange={
                                            (e) => this.changeGroupAttribute(this.state.activeGroupId,"imputation_method",
                                                IMPUTATION_METHODS.filter( (method,ind) => method.name === e.target.value )[0])}>
                                              {
                                                IMPUTATION_METHODS.map((method,ind) => <option value={method.name}> 
                                                    {method.name} </option>)
                                              }
                                        </select>
                                    }
                                </div>
                                <br/>
                            </>}


                        {/* Show list of member features of active group in the center column */}
                        <div className="feature-list">
                            {this.props.groups && this.props.features && this.state.activeGroupId !== null &&
                                this.props.groups.filter(group => group.id === this.state.activeGroupId).length !== 0 &&
                                // for each feature that is in the active group
                                this.props.features.filter(feature => feature.group_id === this.state.activeGroupId).map((feature, i) => {
                                    return (
                                        <div className="feature-row" key={feature.feature_name}>
                                            <div style={{ backgroundColor: groupcolor(feature.group_id) }} className="feature-colorbar"></div>
                                            <div className="feature-name">

                                                {feature.feature_name}
                                            </div>
                                            <SelectPctAvailGradient featureInfo={feature} height={20} onSelectFeature={() => null} />

                                            <div className="feature-buttons">
                                                <div className="iconbutton" onClick={() => this.removeFromGroup(feature.feature_name)}><Icons icon="X" /></div>
                                            </div>
                                        </div>)
                                })

                            }
                        </div>
                    </div>
                    <div className="group-search main-right">
                        {/* Right column: show title of the search tool */}
                        {this.props.groups && this.state.activeGroupId !== null &&
                            // Check if the active group ID is actually in the groups array. Might not be the case if you delete the group
                            // also if I dont do this, the compiler complains when indexing [0]
                            this.props.groups.filter(group => group.id === this.state.activeGroupId).length !== 0 &&
                            <>
                                <h2> Add Features to <em>{this.props.groups.filter(group => group.id === this.state.activeGroupId)[0].name}</em></h2>
                                <p>Search:</p>

                            </>
                        }

                        {/* Right column:  show the search tool */}
                        {(this.props.features && this.props.groups) && this.state.activeGroupId !== null &&
                            <FilterFeatures data={this.props.features} groups={this.props.groups}
                                activeGroup={this.props.groups?.filter(group => (group.id === this.state.activeGroupId))[0]}
                                setData={this.props.setFeatures} setGroups={this.props.setGroups} addToActiveGroup={this.addToActiveGroup} />}
                    </div>


                </main>




            </>


        )
    }


}

export default GroupPage;