import {Component} from 'react';

import HomeHeader from '../../components/HomeComponents/HomeHeader.js';
import HomeFooter from '../../components/HomeComponents/HomeFooter.js';
import CrudTable from '../../components/Tables/CrudTable.js';
import BusinessCrud from '../../components/Cruds/business/BusinessCrud.js';
import {getAllBusiness} from "../../services/BusinessConsumer.js";
import { Business } from 'models/Interfaces/LocationInterfaces.js';
import {BusinessAdapter} from '../../adapters/BusinessAdapter.js';

import '../../models/Interfaces/DetailedListsStates.js';
import { variantAlertTypes, windowState } from '../../models/Interfaces/DetailedListsStates.js';
import BaseWindow from './BaseWindow.js';

const modelAdapter = new BusinessAdapter();


class BusinessWindow extends BaseWindow {
    constructor(props){
        super(props);
    }

    componentDidMount(): void {
        this.setState({
            alertContext: {variant: 'success', message: 'Componente montado', heading: 'Exito'},
            handleCrudContext: {handleCrud: ''}
        });
    }

    //All functions are inherited from BaseWindow

    render(){
        return(
            <div className='body-frame'>
                <HomeHeader  alertContext={this.state.alertContext} onClose={this.hideAlertContext} />
                <div className="main_layout" >
                    <div className="layout_content">
                        <h1>Business {this.state.handleCrudContext.handleCrud}</h1>
                        <CrudTable  
                            modelAdapter = {modelAdapter}
                            apiCall={getAllBusiness}
                            handleCrudContext={this.state.handleCrudContext}
                            dialogVisible={this.state.dialogVisible}
                            objectType={{} as Business} 
                            setHandle={this.setHandle}   
                            discardedColumns={['id', 'creation_date', 'update_date']}
                            redirect='Headquarters'/>
                        <BusinessCrud
                            apiInfo={ { id:this.state.handleCrudContext.handleId}}
                            isOpen={this.state.dialogVisible}
                            onHide={this.setCrudDialogInvisible}
                            crudType={this.state.handleCrudContext.handleCrud || 'view'} 
                            sendAndShowAlertMessage={this.sendAndShowAlertMessage}/>
                    </div>
                </div>
                <HomeFooter />
            </div>
        )

    }

}

export default BusinessWindow;


// API_URL={'http://127.0.0.1:8000/locations/business/'+ this.state.handleCrudContext.handleId}