import { Component } from "react";
import React from "react";

import { Link } from "react-router-dom";


class HomeHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
        }

    componentDidMount(): void {
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
                        <li><Link to={"/About"}>Sobre Nosotros</Link></li>
                        <li><Link to={"/Register"}>Registrarse</Link></li>
                        <li><Link to={"/Login"}>Inicie Sesión</Link></li>
                    </ul>
                    
                </div>
            </div>   
               
        </div>
    )
   }

}

export default HomeHeader;