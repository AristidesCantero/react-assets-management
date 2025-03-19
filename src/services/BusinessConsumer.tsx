import React from "react";
import Business from "@pages/Business";
import { BusinessAdapter } from "adapters/BusinessAdapter";
import { loadAbort } from "../utilities/LoadAbortAxios.utilities";
import axios from "axios";

const apiBase = "http://localhost:8000/";
const businessApi = "locations/business";

export const getAllBusiness = () => {
    const controller = loadAbort();
    const url = new URL(apiBase + businessApi);
    return {call: axios.get(url.toString(), { signal: controller.signal }), controller };
}   

export const getBusiness = (id: number) => {
    const controller = loadAbort();
    const url = new URL(apiBase + businessApi + '/' + id);
    return {call: axios.get(url.toString(), { signal: controller.signal }), controller };
}

export const createBusiness = (business: Business) => {
    const controller = loadAbort();
    const url = new URL(apiBase + businessApi);
    return {call: axios.post(url.toString(), business, { signal: controller.signal }), controller };
}

export const updateBusiness = (id:number, business: Business) => {
    const controller = loadAbort();
    const url = new URL(apiBase + businessApi + '/' + id);
    return {call: axios.put(url.toString(), business, { signal: controller.signal }), controller };
}
   