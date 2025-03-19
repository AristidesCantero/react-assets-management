import { Component } from "react";
import React from "react";

import Alerta from '../Alerts/Alert';


import { Link } from "react-router-dom";

interface homeHeaderProps {
    alertContext: {
        message: string;
        heading: string;
        variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    },
    onClose: () => void;

}

interface homeHeaderState {
    alertContext: {
        message: string;
        heading: string;
        variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    },
    onClose: () => void;
}

class HomeHeader extends Component <homeHeaderProps, homeHeaderState> {
    constructor(props){
        super(props);
        this.state = {
           alertContext: props.alertContext,
           onClose: props.onClose
        }
    }


    componentDidMount(): void {

    }

    componentDidUpdate(prevProps: homeHeaderProps): void {
        if (prevProps.alertContext !== this.props.alertContext) {
            this.setState({ alertContext: this.props.alertContext });
        }
        if (prevProps.onClose !== this.props.onClose) {
            this.setState({ onClose: this.props.onClose });
        }
    }

    

   render() {
    return(
        <div className="hero_area">
            <div className="hero_info">
                <div className="data">
                    <a href="">&#128386; example@example.com </a>
                    <a href="">&#128241 Tel: +57 310 453 8234</a>
                </div>
            </div>

            <div className="hero_header">
                <div className="data">
                    <div className="logo">
                        <h1>Negocio</h1>
                    </div>

                    <ul className="menu_bar">
                         <li><Link to={"/Home"}>Inicio</Link></li>
                        <li><Link to={"/Business"}>Listados</Link></li>
                        <li><Link to={"/Tests"}>Testeos</Link></li>
                        <li><Link to={"/Register"}>Registrarse</Link></li>
                        <li><Link to={"/Login"}>Inicie Sesión</Link></li>
                    </ul>
                    
                </div>
            </div>   

            <div className="hero_alert">
                <Alerta alertContext={this.state.alertContext} onClose={this.props.onClose} />
            </div>
               
            
        </div>
    )
   }

}

export default HomeHeader;