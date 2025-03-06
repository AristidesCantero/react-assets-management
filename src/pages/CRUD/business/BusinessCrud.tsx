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
const crudTranslations: { [key in propsBusinessCreate['crudType']]: [string, typeof variantTypes[number]] } = {
    'create': ['creada', variantTypes[2]],
    'update': ['actualizada', variantTypes[1]],
    'delete': ['eliminada', variantTypes[4]],
    'view': ['vista', variantTypes[5]]
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
        sendAndShowAlertMessage(variant, message, heading);
        onHide();
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
                message = 'La empresa '+data.name+' ha sido '+crudTranslation+' correctamente';
                heading = 'Empresa '+crudTranslation;
                variant = 'success';
                onHideSelf(variant, message, heading);
            }).catch((error) => {console.log('error en empresa en '+httpMethod); console.log(error); onHideSelf(onError().variant, onError().message, onError().heading) });

        // if (crudType === 'delete') {
        //     axios.request({
        //         url: apiUrl, 
        //         method: 'delete', 
        //         data: jsonValue, headers: { 'Content-Type': 'application/json' }})
        //     .then(response => response.data)
        //     .then((data) => {
        //         message = 'La empresa '+data.name+' ha sido eliminada';
        //         heading = 'Elemento eliminado';
        //         variant = variantTypes[5];
        //         onHideSelf(variant, heading, message);
        //     })
        //     .catch((error) => {console.log('error al borrar'); onHideSelf(onError().variant, onError().message, onError().heading); });
        //     return;
        // }

        // if (crudType === 'create') {
        //     axios.post(apiUrl, 
        //         { name: values.name, tin: values.tin, utr: values.utr },
        //         { headers: { 'Content-Type': 'application/json' } })
        //     .then(response => response.data)
        //     .then((data) => {
        //         message = 'La empresa '+data.name+' ha sido creada correctamente';
        //         heading = 'Creado exitoso';
        //         variant = 'success';
        //         onHideSelf(variant, message, heading);
        //     })
        //     .catch((error) => {console.log('error al crear'); console.log(error); onHideSelf(onError().variant, onError().message, onError().heading) });
        //     return;
        // }

        // if (crudType === 'update') {
        //     axios.put(apiUrl, jsonValue).then(response => response.data)
        //     .then((data) => { 
        //         message = 'La empresa '+data.name+' ha sido actualizada exitosamente';
        //         heading = 'Empresa modificada';
        //         variant = variantTypes[2];
        //         onHideSelf( variant, message, heading);
        //     })
        //     .catch((error) => {console.log('error al actualizar'); onHideSelf(onError().variant, onError().message, onError().heading); });
        //     return;
        // }

        onHide();

    }

    //function called for the form elements to update the form data
    function onChangeField(event: any, field: string) {
            setFormData({...formData, [field]: event.target.value});
        }
    
    // useEffect(() => {console.log(formData)},[formData]);



    return (
            <div style={{width: '100%', height: '100%', zIndex: 1000}}>
                <Modal size="lg" show={isOpen} onHide={()=>{onHideSelf('primary','Ventana cerrada','Retorno')}} aria-labelledby="contained-modal-title-vcenter" centered>

                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        <h1>Desplegado</h1> Modal heading {crudType}
                        </Modal.Title>
                    </Modal.Header>



                    <Modal.Body>

                        <form onSubmit={formik.handleSubmit}>
                            <div className='mb-3'>
                                <label htmlFor="name" className="block text-sm font-medium text-black">Nombre</label>
                                <input id="name" type="text" placeholder={defaultData.name} 
                                        onChange={formik.handleChange} value={formik.values.name}
                                        disabled={disabled}
                                />
                                {formik.errors.name && ( <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div> )}
                            </div>
                            <div className='mb-3'>
                            <label htmlFor="tin" className="block text-sm font-medium text-black">TIN</label>
                                <input id="tin" type="text" placeholder={defaultData.tin}
                                    onChange={formik.handleChange} value={formik.values.tin} disabled={disabled}
                                />
                                {formik.errors.tin && ( <div className="text-red-500 text-sm mt-1">{formik.errors.tin}</div> )}
                            </div>

                            <div className='mb-3'>
                            <label htmlFor="utr" className="block text-sm font-medium text-black">UTR</label>
                                <input id="utr" type="text" placeholder={defaultData.utr}
                                    onChange={formik.handleChange} value={formik.values.utr} disabled={disabled}
                                />
                                {formik.errors.utr && ( <div className="text-red-500 text-sm mt-1">{formik.errors.utr}</div> )}
                            </div>
                            
                            <Button className="col-1" type='submit' >Cargar</Button>
                            
                        </form>

                    </Modal.Body>

        </Modal>
            </div>
            )
}

export default BusinessCrud; 
