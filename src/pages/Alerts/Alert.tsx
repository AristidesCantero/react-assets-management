import React, { useEffect } from "react";
import { Alert, Button, Collapse } from "react-bootstrap";


interface propsAlerta {
    alertContext: {
        variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark', 
        message: string, heading: string};
    onClose: () => void;
}
const variants = {'primary': 'Notificación', 
                  'secondary': 'Mensaje', 
                  'success': 'Exito', 
                  'danger': 'Peligro', 
                  'warning': 'Advertencia', 
                  'info': 'Información', 
                  'light': 'Claro', 
                  'dark': 'Oscuro'};

let Alerta: React.FC<propsAlerta> = ({alertContext, onClose}) => {
    const [alertShow, setAlertShow] = React.useState(true);

    useEffect(() => {
        let isAlertContextFilled = alertContext.variant && alertContext.message && alertContext.heading;
        if (isAlertContextFilled) {
            setAlertShow(true);
        }
        setTimeout(() => {
            onClose();
            setAlertShow(false);
        }, 5000);
    },
        [alertContext]);


    return (
            alertShow && (
                <Collapse className="grid grid-cols-12" in={alertShow}>
                    <div>   
                        <div className="col-span-2"></div>
                        <div className="w-1/1 h-auto col-span-8 opacity-95">
                            <Alert variant={alertContext.variant} onClose={() => setAlertShow(false)} dismissible>
                                <Alert.Heading>Mensaje de {alertContext.heading}</Alert.Heading>
                                <p>{alertContext.message}</p>
                                <hr/>
                                <div className="d-flex justify-content-end opacity-100">
                                    <Button onClick={() => { setAlertShow(false); onClose(); }} variant="outline-success">
                                    Close me
                                    </Button>
                                </div>
                            </Alert>
                        </div>
                        <div className="col-span-2"></div>
                    </div>
                </Collapse>
            )
    )

}

export default Alerta;