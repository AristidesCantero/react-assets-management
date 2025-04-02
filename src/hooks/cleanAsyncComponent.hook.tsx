import { AxiosResponse } from "axios";
import { useEffect } from "react";


export const useAsync = (
    asyncFn: () => Promise<AxiosResponse<any, any>>,
    successFn : Function,
    returnFn : Function,
    dependencies: any[] = [],
    shouldWait?: boolean) => {
    useEffect(() => {
        if (shouldWait) { return;}
        let isActive = true;
        asyncFn().then((result) => {
            if(isActive){ successFn(result.data); }
        }).catch((error) => {console.log("Se ha cancelado una peticion");});
        return () => { returnFn && returnFn(); isActive = false; };
    }, dependencies);
}