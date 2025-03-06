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
        }, 3000);
    },
        [alertContext]);


    return (
            alertShow && (
                <Collapse in={alertShow}>
                <Alert variant={alertContext.variant} onClose={() => setAlertShow(false)} dismissible>
                    <Alert.Heading>Mensaje de {alertContext.heading}</Alert.Heading>
                    <p>{alertContext.message}</p>
                    <hr/>
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => { setAlertShow(false); onClose(); }} variant="outline-success">
                        Close me
                        </Button>
                    </div>
                </Alert>
                </Collapse>
            )
    )

}

export default Alerta;