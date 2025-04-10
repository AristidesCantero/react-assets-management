import React, { useEffect } from 'react';
import {Button, Modal} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Business } from '../../../models/Interfaces/LocationInterfaces.js';
import { getBusiness, createBusiness, deleteBusiness, updateBusiness} from 'services/BusinessConsumer.js';
import { useAsync, useFetchAndLoad } from "../../../hooks/index.js";
import { AxiosCall } from 'models/axios-call.models.js';



interface propsBusinessCreate {
    isOpen: boolean;
    onHide: () => void;
    apiInfo: {id?: number};
    crudType: 'create' | 'update' | 'delete' | 'view';
    sendAndShowAlertMessage: (variant: typeof variantTypes[number], message: string, heading: string) => void;
    crudApiCalls?: {
        create: () => void;
        update: (id:number) => void;
        delete: (id:number) => void;
        view: (id:number) => void;
    }
}

const crudToMethod: { [key in propsBusinessCreate['crudType']]: 'post' | 'put' | 'delete' | 'get' } = {
    'create': 'post', 'update': 'put', 'delete': 'delete', 'view': 'get', 
}
const variantTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;
const defaultBusiness = { id: 0, name: '', tin: '', utr: '', creation_date: new Date(), update_date: new Date() };
const crudTranslations: { [key in propsBusinessCreate['crudType']]: [string, typeof variantTypes[number], string] } = {
    'create': ['creada', variantTypes[2], 'Creación'],
    'update': ['actualizada', variantTypes[1], 'Actualización'],
    'delete': ['eliminada', variantTypes[4], 'Eliminación'],
    'view': ['vista', variantTypes[5], 'Visualización']
};

const validationSchema = Yup.object({
    name: Yup.string().min(2, "Name must be at least 2 characters").matches(/[A-Za-z0-9ñÑ.\-]$/, "No se permiten caracteres especiales").required("Campo nombre es requerido"),
    tin: Yup.string().min(2, "TIN must be at least 2 characters").matches(/[A-Za-z0-9ñÑ.\-]$/, "No se permiten caracteres especiales").required("Campo TIN es requerido"),
    utr: Yup.string().min(2, "UTR must be at least 2 characters").matches(/[A-Za-z0-9Ññ.\-]$/, "No se permiten caracteres especiales").required("Campo UTR es requerido")
});

let BusinessCrud: React.FC<propsBusinessCreate> = ({ isOpen, onHide, apiInfo, crudType, sendAndShowAlertMessage }) => {

    //define states for form data
    let [formData, setFormData] = React.useState<Business>({ id: 0, name: '', tin: '', utr: '', creation_date: new Date(), update_date: new Date() });
    let [defaultData, setDefaultData] = React.useState<Business>({ id: 0, name: '', tin: '', utr: '', creation_date: new Date(), update_date: new Date() });
    let [disabled, setDisabled] = React.useState<boolean>(false);

    const formik = useFormik({
        initialValues: { name: "", tin: "", utr: "" },
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


    const getBusinessFromApi = () => {
        return getBusiness(apiInfo.id || 0 ,{timeout: 3000, headers:{ 'Content-Type': 'application/json' }}).call
    };

    //useAsync to get the data from the API, activates when the apiInfo.id changes
    useAsync(getBusinessFromApi, getBusinessData,() => {}, [apiInfo.id], crudType === 'create' || (apiInfo.id ?? 0) < 1);    

    function getBusinessData(bs_data: any) {
        let data = bs_data['data']
        if (crudType === 'create' || data === undefined || data === null || data === 'error')  
            { 
                formik.setValues({ name: '', tin: '', utr: '' });
                setFormData(defaultBusiness);
                setDefaultData(defaultBusiness);
                return;
            }  
        
        try {
            formik.setValues({ name: data.name || '', tin: data.tin || '', utr: data.utr || '' });
            setFormData(data as Business);
            setDefaultData(data as Business);
        } catch (error) {
            onHideSelf('danger', 'Error al obtener los datos del negocio', 'Error');
        }
    }         

    function onHideSelf(variant: typeof variantTypes[number], message: string, heading: string) {
        setFormData({ id: 0, name: '', tin: '', utr: '', creation_date: new Date(), update_date: new Date() });
        setDefaultData({ id: 0, name: '', tin: '', utr: '', creation_date: new Date(), update_date: new Date() });
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
        const jsonValue = JSON.stringify(values, null, 2);
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
            if (crudType === 'create') { return createBusiness(values, params).call; } 
            else if (crudType === 'update') { return updateBusiness(businessId ,values, params).call; } 
            else { return deleteBusiness(businessId, params).call; }
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





    return (
            <div>
                <Modal 
                    size="lg" show={isOpen} 
                    onHide={()=>{onHideSelf('primary','Ventana cerrada','Retorno')}} 
                    aria-labelledby="contained-modal-title-vcenter" centered>

                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        <p className='font-bold text-3xl'>{crudTranslations[crudType][2]} de Información de empresa</p> 
                        </Modal.Title>
                    </Modal.Header>



                    <Modal.Body>

                        <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
                            <div className='grid grid-cols-1 gap-1'>
                                <label htmlFor="name" className="block font-serif text-gray-700 text-xl">Nombre</label>
                                <input className='bg-gray-100 w-10/12 h-10 rounded-sm border-2 border-black focus:bg-gray-300' 
                                        id="name" 
                                        type="text" 
                                        placeholder={defaultData.name} 
                                        onChange={formik.handleChange} value={formik.values.name}
                                        disabled={disabled}
                                        />
                                {formik.errors.name && ( <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div> )}
                            </div>
                            <div className='grid grid-cols-1 gap-1'>
                            <label htmlFor="tin" className="block font-serif text-gray-700 text-xl">TIN</label>
                                <input className='bg-gray-200 w-10/12 h-10 rounded-sm border-2 border-black focus:bg-gray-400'
                                        id="tin" 
                                        type="text" 
                                        placeholder={defaultData.tin}
                                        onChange={formik.handleChange} value={formik.values.tin} disabled={disabled}
                                />
                                {formik.errors.tin && ( <div className="text-red-500 text-sm mt-1">{formik.errors.tin}</div> )}
                            </div>

                            <div className='grid grid-cols-1 gap-1'>
                            <label htmlFor="utr" className="block font-serif text-gray-700 text-xl">UTR</label>
                                <input className='bg-gray-200 w-10/12 h-10 rounded-sm border-2 border-black focus:bg-gray-400'
                                        id="utr" 
                                        type="text" 
                                        placeholder={defaultData.utr}
                                        onChange={formik.handleChange} value={formik.values.utr} disabled={disabled}
                                />
                                {formik.errors.utr && ( <div className="text-red-500 text-sm mt-1">{formik.errors.utr}</div> )}
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

export default BusinessCrud; 
