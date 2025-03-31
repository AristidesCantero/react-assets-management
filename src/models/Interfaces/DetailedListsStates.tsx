

export const variantAlertTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;



export interface windowState{
    handleCrudContext: {handleCrud: 'create' | 'update' | 'delete' | 'view' | '', handleId?: number};
    dialogVisible: boolean;
    alertContext: {variant: typeof variantAlertTypes[number], 
        message: string, heading: string};
    dataHaveBeenFetched: boolean;
}