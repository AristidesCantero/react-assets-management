import { Component } from "react";
import React from "react";

class HomeFooter extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentDidMount(): void {
    }

    render(){
        return(
            <div className="details">       
            <div className="details_list">
                <div className="details_cells">
                    <h1>Sobre este sitio</h1>
                    <div className="socials">
                        <div className="socials-info">
                            <div className="rowb">
                                <h2 className="textb">cra 20 nro 27-93</h2>
                            </div>
                            
                            <div className="rowb">
                                <h2 className="textb">+57 3017766491</h2>
                            </div>
                            
                            <div className="rowb">
                                <h2 className="textb">aristidescantero2000@hotmail.com</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="details_cells">
                    <h1>Objetivos</h1>
                </div>
                <div className="details_cells">
                    <h1>Redes Sociales </h1>
                    <div className="socials">
                        <a href="#" className="fa fa-facebook"></a>
                        <a href="#" className="fa fa-twitter"></a>
                        <a href="#" className="fa fa-linkedin"></a>
                        <a href="#" className="fa fa-instagram"></a>
                    </div>
                </div>
                <div className="details_cells">
                    <h1>Contacto</h1>
                    <div className="socials">
                        <div className="social-info">
                            <div className="row">
                                <a className="fa fa-map-marker logo"></a>
                                <h2 className="text">cra 20 nro 27-93</h2>
                            </div>
                            
                            <div className="row">
                                <a className="fa fa-phone logo"></a>
                                <h2 className="text">+57 3017766491</h2>
                            </div>
                            
                            <div className="row">
                                <a className="fa fa-envelope logo"></a>
                                <h2 className="text">aristidescantero2000@hotmail.com</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 

            <div className="rights">
                <p>2025 @Apache License 2.0</p>
            </div>
        </div>
        )
        
    }


}

export default HomeFooter;