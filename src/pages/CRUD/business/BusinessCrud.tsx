import React, { useRef, useEffect } from 'react';
import {Button, Modal} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Business } from '../../Interfaces/LocationInterfaces';



interface propsBusinessCreate {
    isOpen: boolean;
    onHide: () => void;
    apiInfo: { url: string,  base: [string, ...string[]],  id?: number};
    crudType: 'create' | 'update' | 'delete' | 'view';
    sendAndShowAlertMessage: (variant: typeof variantTypes[number], message: string, heading: string) => void;
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
    name: Yup.string().min(2, "Name must be at least 2 characters").matches(/[A-Za-z0-9ñÑ.\-]$/, "No se permiten caracteres especiales").required("Name is required"),
    tin: Yup.string().min(2, "TIN must be at least 2 characters").matches(/[A-Za-z0-9ñÑ.\-]$/, "No se permiten caracteres especiales").required("TIN is required"),
    utr: Yup.string().min(2, "UTR must be at least 2 characters").matches(/[A-Za-z0-9Ññ.\-]$/, "No se permiten caracteres especiales").required("UTR is required")
});

let BusinessCrud: React.FC<propsBusinessCreate> = ({ isOpen, onHide, apiInfo, crudType, sendAndShowAlertMessage }) => {

    //define states for form data
    let [apiUrl, setApiUrl] = React.useState<string>('');
    let [formData, setFormData] = React.useState<Business>({ id: 0, name: '', tin: '', utr: '', creation_date: new Date(), update_date: new Date() });
    let [defaultData, setDefaultData] = React.useState<Business>({ id: 0, name: '', tin: '', utr: '', creation_date: new Date(), update_date: new Date() });
    let [hasData, setHasData] = React.useState<boolean>(false);
    let [disabled, setDisabled] = React.useState<boolean>(false);
    let [isSubmitable, setIsSubmitable] = React.useState<boolean>(false);

    const formik = useFormik({
        initialValues: { name: "", tin: "", utr: "" },
        validationSchema: validationSchema,
        onSubmit: values => {
            // console.log(values.name+' '+values.tin+" "+values.utr+' \n'+apiUrl+' \n'+crudToMethod[crudType]);
            onSubmitToApi(values);
        },
      });


    useEffect(() => { 
        if ((crudType === 'view') || (crudType === 'delete')) {setDisabled(true); return;}
        setDisabled(false);
    },[crudType]);

    //useEffect to define the API URL and if there is a id to get the data
    useEffect(() => {
        if(crudType === 'create') 
            {
                setApiUrl(apiInfo ? apiInfo.url + apiInfo.base.join('/') : '');
                 return;
            }
        setApiUrl(apiInfo ? apiInfo.url + apiInfo.base.join('/') + (apiInfo.id ? '/'+apiInfo.id : '') : '');
        
    },[apiInfo.id]);

    useEffect(() => {
        if (apiUrl === '') {return;}
        getBusinessData();
    },[apiUrl]);

    function getBusinessData() {
        if (crudType === 'create') 
            { 
                setFormData(defaultBusiness);
                setDefaultData(defaultBusiness);
                return; 
            }
        
        axios.request({url: apiUrl, method: 'get', headers: { 'Content-Type': 'application/json' }, timeout: 1000 })
        .then(response => response.data)
        .then((data) => {
            formik.setValues({ 
            name: data.name || '',
            tin: data.tin || '',
            utr: data.utr || '' });
            setFormData(data as Business);
            setDefaultData(data as Business);
        })
        .then(() => {setHasData(true); })
        .catch((error) => {
            onHideSelf('danger', 'Error al cargar los datos', 'Error');
            console.error(error);
            setHasData(false);
        });
    }         

    function onHideSelf(variant: typeof variantTypes[number], message: string, heading: string) {
        setApiUrl('');
        setFormData({ id: 0, name: '', tin: '', utr: '', creation_date: new Date(), update_date: new Date() });
        setHasData(false);
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

            axios.request({ url: apiUrl, method: httpMethod, data: jsonValue, timeout: 1000,
                            headers: { 'Content-Type': 'application/json' } })
            .then(response => response.data)
            .then((data) => {
                console.log(crudTranslation)
                message = 'La empresa "'+data.name+'" ha sido '+crudTranslation[0]+' correctamente';
                heading = 'Empresa '+crudTranslation[0];
                variant = 'success';
                onHideSelf(variant, message, heading);
            }).catch((error) => {console.log('error en empresa en '+httpMethod); console.log(error); onHideSelf(onError().variant, onError().message, onError().heading) });

        

        onHide();

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
