import {Component} from 'react';

import '../../models/Interfaces/DetailedListsStates.js';
import { variantAlertTypes, windowState } from '../../models/Interfaces/DetailedListsStates.js';


class BaseWindow extends Component <{},windowState> {
    constructor(props){
        super(props);
        this.state = {
            handleCrudContext: {handleCrud:''},
            dialogVisible: false,
            alertContext: {variant: 'primary', message: '', heading: ''},
            dataHaveBeenFetched: false
        }
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

}

export default BaseWindow;


// API_URL={'http://127.0.0.1:8000/locations/business/'+ this.state.handleCrudContext.handleId}