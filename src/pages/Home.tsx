import React from 'react';
import {Component} from 'react';
import HomeHeader from './HomeComponents/HomeHeader';
import HomeLayout from './HomeComponents/HomeLayout';
import HomeFooter from './HomeComponents/HomeFooter';

import {Business} from './Interfaces/LocationInterfaces';

import { Link } from 'react-router-dom';

const permissionList = ['listas','usuarios','creacion']

class Home extends Component <{},{elements: Business[]}>{
    constructor(props){
        super(props);
        this.state = {
            elements:[],
        }
    }

    componentDidMount(): void {
        fetch('http://127.0.0.1:8000/locations/business')
        .then((response) => response.json())
        .then( (data)=>
            {
                const parsedElements: any[] = []; 
                data.map( (business) => {parsedElements.push(business)} );
                this.setState({ elements: parsedElements });
            } )
        //.then( () => {console.log('estado: '+this.state);} ) 
        .catch( (error) => {console.log("Fetch con django ha fallado");} );
    }



    render(){
        const BASE_URL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
        let redirections = [
            {buttonName:"Home",redirection:BASE_URL+"/Home"},
            {buttonName:"Business",redirection:BASE_URL+"/Business"},
        ];
        return (
            <div className='body-frame'>
                <HomeHeader />
                <HomeLayout text={"Home"} redirections={redirections}/>
                <HomeFooter />
            </div>
        );
    }
    
};

export default Home;