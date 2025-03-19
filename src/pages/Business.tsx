import {Component} from 'react';

import HomeHeader from './HomeComponents/HomeHeader';
import HomeLayout from './HomeComponents/HomeLayout';
import HomeFooter from './HomeComponents/HomeFooter';

import CrudTable from '../components/Tables/CrudTable';
import BusinessCrud from './CRUD/business/BusinessCrud';
import Alerta from './Alerts/Alert';


const variantTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;

interface windowState{
    handleCrudContext: {handleCrud: 'create' | 'update' | 'delete' | 'view' | '', handleId?: number};
    dialogVisible: boolean;
    alertContext: {variant: typeof variantTypes[number], 
        message: string, heading: string};
    dataHaveBeenFetched: boolean;
}

class Business extends Component <{},windowState> {
    constructor(props){
        super(props);
        this.state = {
            handleCrudContext: {handleCrud:''},
            dialogVisible: false,
            alertContext: {variant: 'primary', message: '', heading: ''},
            dataHaveBeenFetched: false
        }
    }

    componentDidMount(): void {
        this.setState({
            alertContext: {variant: 'success', message: 'Componente montado', heading: 'Exito'},
            handleCrudContext: {handleCrud: ''}
        });
    }


    //Alert operations
    sendAndShowAlertMessage = (variant: typeof variantTypes[number], message: string, heading: string) => {
        this.setState({alertContext: {variant: variant, message: message, heading: heading}});
    }
    hideAlertContext = () => { this.setState({alertContext: {variant:"primary",message:"", heading:""}}); }


    // CRUD operations
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
    onSubmitCrud = (variant: typeof variantTypes[number], message: string, heading: string) => {
        //set the crud dialog 
        this.setCrudDialogInvisible();
        this.sendAndShowAlertMessage(variant, message, heading);
    }
    


    render(){
        return(
            <div className='body-frame'>
                <HomeHeader  alertContext={this.state.alertContext} onClose={this.hideAlertContext} />
                <div className="main_layout" >
                    <div className="layout_content">
                        <h1>Business {this.state.handleCrudContext.handleCrud}</h1>
                        <CrudTable  
                            handleCrudContext={this.state.handleCrudContext}
                            dialogVisible={this.state.dialogVisible}
                            API_URL="http://127.0.0.1:8000/locations/business" 
                            objectType={{} as Business} 
                            setHandleCreate={this.setHandleCreate} 
                            setHandleDelete={this.setHandleDelete} 
                            setHandleUpdate={this.setHandleUpdate}
                            setHandleView={this.setHandleView}
                            discardedColumns={['id', 'creation_date', 'update_date']}/>
                        <BusinessCrud
                            apiInfo={ {url: 'http://127.0.0.1:8000/',  base: ['locations','business'], 
                                id:this.state.handleCrudContext.handleId}}
                            isOpen={this.state.dialogVisible}
                            onHide={this.setCrudDialogInvisible}
                            // onSubmit={() => {}}
                            crudType={this.state.handleCrudContext.handleCrud || 'view'} 
                            sendAndShowAlertMessage={this.sendAndShowAlertMessage}/>
                        
                    </div>
                </div>
                <HomeFooter />
            </div>
        )

    }

}

export default Business;


// API_URL={'http://127.0.0.1:8000/locations/business/'+ this.state.handleCrudContext.handleId}