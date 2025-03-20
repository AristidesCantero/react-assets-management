import React from 'react';
import {Component} from 'react';
import HomeHeader from '../components/HomeComponents/HomeHeader';
import HomeLayout from '../components/HomeComponents/HomeLayout';
import HomeFooter from '../components/HomeComponents/HomeFooter';

import {Business} from '../models/Interfaces/LocationInterfaces';

import { Link } from 'react-router-dom';

const permissionList = ['listas','usuarios','creacion']

const variantTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;

interface windowState{
    alertContext: {variant: typeof variantTypes[number], 
        message: string, heading: string};
}

class Home extends Component <{},windowState>{
    constructor(props){
        super(props);
        this.state = {
            alertContext: {variant: 'primary', message: '', heading: ''}
        }
    }

    componentDidMount(): void {
        this.setState({
            alertContext: {variant: 'success', message: 'Bienvenido a la aplicación', heading: 'Exito'},
        });
    }

    //Alert operations
    sendAndShowAlertMessage = (variant: typeof variantTypes[number], message: string, heading: string) => {
        this.setState({alertContext: {variant: variant, message: message, heading: heading}});
    }
    hideAlertContext = () => { this.setState({alertContext: {variant:"primary",message:"", heading:""}}); }


    render(){
        const BASE_URL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
        let redirections = [
            {buttonName:"Home",redirection:BASE_URL+"/Home"},
            {buttonName:"Business",redirection:BASE_URL+"/Business"},
        ];
        return (
            <div className='body-frame'>
                <HomeHeader alertContext={this.state.alertContext} onClose={this.hideAlertContext}/>
                <HomeLayout text={"Home"} redirections={redirections}/>
                <HomeFooter />
            </div>
        );
    }
    
};

export default Home;