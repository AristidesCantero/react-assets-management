import React, { useEffect } from 'react';
import {Button, Modal} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Headquarters } from '../../../models/Interfaces/LocationInterfaces.js';
import { getHeadquarter, createHeadquarter, updateHeadquarter, deleteHeadquarter  } from 'services/HeadquartersConsumer.js';
import { useAsync, useFetchAndLoad } from "../../../hooks/index.js";
import { AxiosCall } from 'models/axios-call.models.js';



interface propsHeadquartersCreate {
    isOpen: boolean;
    onHide: () => void;
    apiInfo: {id?: number, parentId?: number};
    crudType: 'create' | 'update' | 'delete' | 'view';
    sendAndShowAlertMessage: (variant: typeof variantTypes[number], message: string, heading: string) => void;
    crudApiCalls?: {
        create: () => void;
        update: (id:number) => void;
        delete: (id:number) => void;
        view: (id:number) => void;
    };
}

const crudToMethod: { [key in propsHeadquartersCreate['crudType']]: 'post' | 'put' | 'delete' | 'get' } = {
    'create': 'post', 'update': 'put', 'delete': 'delete', 'view': 'get', 
}
const variantTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;
const defaultHeadquarter = { id:0, address:'', name: '', phone: 0, creation_date: new Date(), update_date: new Date(), business_key: 0 };
const crudTranslations: { [key in propsHeadquartersCreate['crudType']]: [string, typeof variantTypes[number], string] } = {
    'create': ['creada', variantTypes[2], 'Creación'],
    'update': ['actualizada', variantTypes[1], 'Actualización'],
    'delete': ['eliminada', variantTypes[4], 'Eliminación'],
    'view': ['vista', variantTypes[5], 'Visualización']
};

const validationSchema = Yup.object({
    address: Yup.string().min(2, "Address must be at least 2 characters").matches(/[A-Za-z0-9ñÑ#.\-]$/, "No se permiten caracteres especiales").required("Address is required"),
    name: Yup.string().min(2, "name must be at least 2 characters").matches(/[A-Za-z0-9ñÑ.\-]$/, "No se permiten caracteres especiales").required("Name is required"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "El teléfono debe ser número y de 10 de longitud")
    // .matches(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/, "El teléfono debe ser un número válido")
    //     .required("Phone is required"),
});

let HeadquartersCrud: React.FC<propsHeadquartersCreate> = ({ isOpen, onHide, apiInfo, crudType, sendAndShowAlertMessage }) => {

    //define states for form data
    let [formData, setFormData] = React.useState<Headquarters>({ id:0, address:'', name: '', phone: 0, creation_date: new Date(), update_date: new Date(), business_key: 0 });
    let [defaultData, setDefaultData] = React.useState<Headquarters>({ id:0, address:'', name: '', phone: 0, creation_date: new Date(), update_date: new Date(), business_key: 0 });
    let [disabled, setDisabled] = React.useState<boolean>(false);

    const formik = useFormik({
        initialValues: { address:'', name: '', phone: 0},
        validationSchema: validationSchema,
        onSubmit: values => {
            onSubmitToApi(values);
        },
      });

    const {loading, callEndpoint} = useFetchAndLoad();

    //if the crudType is 'view' or 'delete' then the form is disabled
    useEffect(() => { 
        if ((crudType === 'view') || (crudType === 'delete')) {setDisabled(true); return;}
        setDisabled(false);
    },[crudType]);

    const getApiData = async (apiCall: () => AxiosCall<any>) => {
            return await callEndpoint(apiCall());
        }

    const getHeadquarterFromApi = () => {
            return getHeadquarter(apiInfo.id || 0 ,{timeout: 3000, headers:{ 'Content-Type': 'application/json' }}).call
        };


    useAsync(getHeadquarterFromApi, getHeadquarterData,() => {}, [apiInfo.id], crudType === 'create' || (apiInfo.id ?? 0) < 1); 

    function getHeadquarterData(data:any) {
        if (crudType === 'create' || data === undefined || data === null || data === 'error')  
                    { 
                        formik.setValues({ name: data.name || '', address: data.address || '', phone: data.phone || 0 });
                        setFormData(defaultHeadquarter);
                        setDefaultData(defaultHeadquarter);
                        return;
                    }  
                
                try {
                    formik.setValues({ name: data.name || '', address: data.address || '', phone: data.phone || 0 });
                    setFormData(data as Headquarters);
                    setDefaultData(data as Headquarters);
                } catch (error) {
                    onHideSelf('danger', 'Error al cargar o comprender los datos', 'Error');
                }
    }         

    function onHideSelf(variant: typeof variantTypes[number], message: string, heading: string) {
        setFormData({ id:0, address:'', name: '', phone: 0, creation_date: new Date(), update_date: new Date(), business_key: 0 });
        setDefaultData({ id:0, address:'', name: '', phone: 0, creation_date: new Date(), update_date: new Date(), business_key: 0 });
        onHide();
        sendAndShowAlertMessage(variant, message, heading);
        
    }

    function onError(){
        let message = 'Error en la operacion';
        let heading = 'Error';
        let variant = variantTypes[3];
        return {variant, message, heading};
    }
    
    function onSubmitToApi(values: any) {
        if (crudType === 'create') {
            values.business_key = apiInfo.parentId || 0;
        }
        const jsonValue = JSON.stringify(values, null, 2);
                console.log(values)
                const httpMethod = crudToMethod[crudType];
                const crudTranslation = crudTranslations[crudType];
                let variant: typeof variantTypes[number] = 'primary';
                let message = '';
                let heading = '';
                
                if(crudType === 'view') 
                    { 
                        message = 'Retorno a la aplicacion';
                        heading = 'Visualizacion de datos';
                        variant = variantTypes[5];
                        onHideSelf(variant,message,heading);
                        return;
                    }
        
                let businessId = apiInfo.id ? apiInfo.id : 0;
                let params = { timeout: 3000, headers: { 'Content-Type': 'application/json' } }
                
                let async_axios_call = async () => {
                    if (crudType === 'create') { return createHeadquarter(values, params).call; } 
                    else if (crudType === 'update') { return updateHeadquarter(businessId ,values, params).call; } 
                    else { return deleteHeadquarter(businessId, params).call; }
                }
        
                async_axios_call()
                .then(response => response.data)
                .then((data) => {
                    message = 'La empresa "'+data.name+'" ha sido '+crudTranslation[0]+' correctamente';
                    heading = 'Empresa '+crudTranslation[0];
                    variant = 'success';
                    onHideSelf(variant, message, heading);
                }).catch((error) => {
                    onHideSelf(onError().variant, onError().message, onError().heading) 
                });

    }

    //function called for the form elements to update the form data
    function onChangeField(event: any, field: string) {
            setFormData({...formData, [field]: event.target.value});
        }
    
    // useEffect(() => {console.log(formData)},[formData]);



    return (
            <div>
                <Modal 
                    size="lg" show={isOpen} 
                    onHide={()=>{onHideSelf('primary','Ventana cerrada','Retorno')}} 
                    aria-labelledby="contained-modal-title-vcenter" centered>

                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        <p className='font-bold text-3xl'>{crudTranslations[crudType][2]} de Sede</p> 
                        </Modal.Title>
                    </Modal.Header>



                    <Modal.Body>

                        <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">

                            <div className='grid grid-cols-1 gap-1'>
                            <label htmlFor="name" className="block font-serif text-gray-700 text-xl">Nombre</label>
                                <input className='bg-gray-200 w-10/12 h-10 rounded-sm border-2 border-black focus:bg-gray-400'
                                        id="name" 
                                        type="text" 
                                        placeholder={defaultData.name ?? 0}
                                        onChange={formik.handleChange} value={formik.values.name} disabled={disabled}
                                />
                                {formik.errors.name && ( <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div> )}
                            </div>

                            <div className='grid grid-cols-1 gap-1'>
                                <label htmlFor="name" className="block font-serif text-gray-700 text-xl">Dirección</label>
                                <input className='bg-gray-100 w-10/12 h-10 rounded-sm border-2 border-black focus:bg-gray-300' 
                                        id="address" 
                                        type="text" 
                                        placeholder={defaultData.address ?? ''} 
                                        onChange={formik.handleChange} value={formik.values.address}
                                        disabled={disabled}
                                        />
                                {formik.errors.address && ( <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div> )}
                            </div>

                            <div className='grid grid-cols-1 gap-1'>
                            <label htmlFor="phone" className="block font-serif text-gray-700 text-xl">Teléfono</label>
                                <input className='bg-gray-200 w-10/12 h-10 rounded-sm border-2 border-black focus:bg-gray-400'
                                        id="phone" 
                                        type="text" 
                                        placeholder={defaultData.phone!==undefined ? defaultData.phone.toString() : ''}
                                        onChange={formik.handleChange} value={formik.values.phone} disabled={disabled}
                                />
                                {formik.errors.phone && ( <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div> )}
                            </div>
                            
                            <div className="col-span-2 flex mt-4 justify-center">
                                <Button className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2" 
                                type='submit'>Cargar</Button>
                            </div>
                            {/* <Button className="w-1/10" type='submit' >Cargar</Button> */}
                            
                        </form>

                    </Modal.Body>

            </Modal>
            </div>
            )
}

export default HeadquartersCrud; 
