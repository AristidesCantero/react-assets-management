import { Component } from "react";
import React from "react";
import { Business, Location } from "../../models/Interfaces/LocationInterfaces";
import CrudTable from "../Tables/CrudTable";
import { Navigate, NavLink, Link, BrowserRouter, Route } from "react-router-dom";




interface HomeLayoutProps {
    text: string;
    redirections?: {buttonName: string, redirection: string}[];
}

interface HomeLayoutState {
    text: string;
}

// function HomeLayout(props: HomeLayoutProps): JSX.Element{

//     const [elementos, setElementos] = React.useState([] as Business[]);
    
//     React.useEffect(() => {
//         setElementos(props.elements);
//     }, [props.elements]);

//     return(
//         <div className="layout">
//             <div className="layout_content">
//                 { 
//                     elementos.map((element, index) => 
//                         {
//                             return(
//                                 <div key={index}>
//                                     <h1>{element.name}</h1>
//                                     <p>{element.tin}</p>
//                                 </div>
//                             );
//                         }
//                     )
//                 }
//             </div>
//         </div>
//     )
// }

class HomeLayout extends Component<HomeLayoutProps,HomeLayoutState>{
    constructor(props: HomeLayoutProps){
        super(props);
        this.state = {
            text : '',
        };
    }
    
    componentDidMount(): void {
        this.setState({text: this.props.text}); 
    }

    // create a useeffect function to set props.elements to state.elements
    componentDidUpdate(prevProps: HomeLayoutProps, prevState: HomeLayoutState, snapshot?: any): void {
    }

    render(){
        return(
            <div className="main_layout">
                <div className="layout_content">
                <div className="hero_button">
                    <button onClick={() => alert('Hello! Welcome to our website!')}>Click Me</button>
                </div>
                    <h1>{this.state.text}</h1>
                </div>
            </div>
        )
    }
}

{/* { 
                        elements.map((element, index) => 
                            {
                                return(
                                    <div key={index}>
                                        <h1>{element.name}</h1>
                                        <p>{element.tin}</p>
                                    </div>
                                );
                            }
                        )
                    } */}
export default HomeLayout;