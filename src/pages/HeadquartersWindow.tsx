import { Component } from "react";

import type { Route } from "./+types/HeadquartersWindow.js"; //check for "route module type safety" in react router if fails



import HomeHeader from '../components/HomeComponents/HomeHeader.js';
import HomeFooter from '../components/HomeComponents/HomeFooter.js';
import { variantAlertTypes, windowState } from '../models/Interfaces/DetailedListsStates.js';

interface HeadquartersWindowState {
  businessId: number;
}


class HeadquartersWindow extends Component<Route.ComponentProps, windowState & HeadquartersWindowState> {
  constructor(props) {
    super(props);
    this.state = {
      handleCrudContext: { handleCrud: "" },
      dialogVisible: false,
      alertContext: { variant: "primary", message: "", heading: "" },
      dataHaveBeenFetched: false,
      businessId: 0,
    };
  }

  componentDidMount(): void {
    this.setState({
      alertContext: {variant: 'success', message: 'Componente montado', heading: 'Exito'},
      handleCrudContext: {handleCrud: ''}
  });
  }

  //Alert operations
  sendAndShowAlertMessage = (variant: typeof variantAlertTypes[number], message: string, heading: string) => {
    this.setState({alertContext: {variant: variant, message: message, heading: heading}});
}
hideAlertContext = () => { this.setState({alertContext: {variant:"primary",message:"", heading:""}}); }


// CRUD operations and data
setCrudDialogInvisible = () => {
     this.setState({dialogVisible: false, handleCrudContext: {handleCrud:'', handleId:undefined}}); 
    }
setCrudDialogVisible = () => { this.setState({dialogVisible: true}); }
setHandleCreate = (value: boolean, id: number) => {
    this.setState({handleCrudContext: {handleCrud: 'create', handleId: id}, dialogVisible: true});
}
setHandleUpdate = (value: boolean, id: number) => {
    this.setState({handleCrudContext: {handleCrud: 'update', handleId: id}, dialogVisible: true}); 
}
setHandleDelete = (value: boolean, id: number) => {
    this.setState({handleCrudContext: {handleCrud: 'delete', handleId: id}, dialogVisible: true});
}
setHandleView = (value: boolean, id: number) => {
    this.setState({handleCrudContext: {handleCrud:'view', handleId: id}, dialogVisible: true});
}
setCrudEmpty = () => {
    this.setState({handleCrudContext: {handleCrud: ''}});
}
onSubmitCrud = (variant: typeof variantAlertTypes[number], message: string, heading: string) => {
    //set the crud dialog 
    this.setCrudDialogInvisible();
    this.sendAndShowAlertMessage(variant, message, heading);
}
setHandle = {
    Create: this.setHandleCreate, 
    Update: this.setHandleUpdate, 
    Delete: this.setHandleDelete, 
    View: this.setHandleView
}

  render() {
    return (
    <div className="body-frame">
      <HomeHeader  alertContext={this.state.alertContext} onClose={this.hideAlertContext} />
      <div className="main_layout" >
          <div className="layout_content">
              <h1>Headquarters</h1>
              <p>headquarterId: {this.props.params.headquarterId}</p>

              {/* <p>Loader Data: {JSON.stringify(this.props.loaderData)}</p>
              <p>Action Data: {JSON.stringify(this.props.actionData)}</p>
              <p>Route Parameters: {JSON.stringify(this.props.params)}</p>
              <p>Matched Routes: {JSON.stringify(this.props.matches)}</p> */}
          </div>
      </div>
    <HomeFooter />
      </div>
    );
  }
}

export default HeadquartersWindow;