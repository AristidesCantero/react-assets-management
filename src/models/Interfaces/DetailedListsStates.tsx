

export const variantAlertTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;



export interface windowState{
    handleCrudContext: {handleCrud: 'create' | 'update' | 'delete' | 'view' | '', handleId?: number};
    dialogVisible: boolean;
    alertContext: {variant: typeof variantAlertTypes[number], 
        message: string, heading: string};
    dataHaveBeenFetched: boolean;
}

export interface WindowAlertAndCurdState extends windowState {
    setCrudDialogInvisible: () => void;
    setCrudDialogVisible: () => void;
    setHandleCreate: (value: boolean, id: number) => void;
    setHandleUpdate: (value: boolean, id: number) => void;
    setHandleDelete: (value: boolean, id: number) => void;
    setHandleView: (value: boolean, id: number) => void;
    setCrudEmpty: () => void;
    onSubmitCrud: (variant: typeof variantAlertTypes[number], message: string, heading: string) => void;
    setHandle: {
        Create: (value: boolean, id: number) => void;
        Update: (value: boolean, id: number) => void;
        Delete: (value: boolean, id: number) => void;
        View: (value: boolean, id: number) => void;
    };
    setHandleCrudContext: (handleCrud: 'create' | 'update' | 'delete' | 'view' | '', handleId?: number) => void;
}