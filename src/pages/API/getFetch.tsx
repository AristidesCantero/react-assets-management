import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "inspector";

interface useFetchInterface {
    url: string;
    base: [string, ...string[]];
    id?: number;
    saveData : (data: any) => void;
    saveError : (error: boolean) => void;

}

export function GetFetch(useFetchInterface: useFetchInterface) {

    const { url, base, id } = useFetchInterface;
    const basicDomain = url + base.join('/') + (id ? '/'+id : '');

    const abortController = new AbortController();
    axios.get(basicDomain, { signal: abortController.signal })
    .then(response => response.data)
    .then(data => { 
    })
    .catch( error => {  } )
    .finally( () => { } );

    return () => { abortController.abort(); }
    };
