import React from "react";
import { Component } from "react";
import HomeHeader from "../components/HomeComponents/HomeHeader";
import HomeFooter from "../components/HomeComponents/HomeFooter";

import axios from "axios";
import CrudTable from "@components/Tables/CrudTable";
import { Business } from "../models/Interfaces/LocationInterfaces";
import { BusinessAdapter } from "../adapters/BusinessAdapter";
import {getAllBusiness} from "../services/BusinessConsumer";
import { useAsync, useFetchAndLoad } from "../hooks/index";
import { useState } from "react";

const variantTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;

interface windowState{
        alertContext: {variant: typeof variantTypes[number], 
        message: string, heading: string};

        data: any;

}

const BusinessAdapterInstance = new BusinessAdapter();


const Component1 = () => {
    const {loading, callEndpoint} = useFetchAndLoad();
    const [data, setData] = useState([] as Business[]);
    const getApiData = async () => {
        return await callEndpoint(getAllBusiness());
    }

    const adaptData = (data: any) => {
        let adaptedData = data.map((item: any) => {
            return BusinessAdapterInstance.adapt(item);
        });
        console.log(adaptedData.map((item: Business) => console.log(item.id)));
        setData(adaptedData);
    }
    useAsync(getApiData, adaptData, () => {});

    return(
        <div>
            <h1>Component 1</h1>
            {data.map((item: Business) => {
                return <div key={item.id}>{item.name}</div>;
            })}
        </div>
    )
    
}



class Tests extends Component<{},windowState>{

    constructor(props){
        super(props);
        this.state = {
            alertContext: {variant: 'primary', message: '', heading: ''},
            data: []
        }
    }


    componentDidMount(): void {
    }

    hideAlertContext = () => { this.setState({alertContext: {variant:"primary",message:"", heading:""}}); }
    


    render(){
        const BASE_URL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
        let redirections = [
            {buttonName:"Home",redirection:BASE_URL+"/Home"},
            {buttonName:"Business",redirection:BASE_URL+"/Business"},
        ];
        return(
            <div className="body-frame">
                <HomeHeader alertContext={this.state.alertContext} onClose={this.hideAlertContext}/>
                <div className="main_layout" >
                    <div className="layout_content">   
                        <h1>Tests</h1>  
                        <Component1 />
                    </div>
                </div>
                <HomeFooter />
            </div>
        );
    }
}

export default Tests;