import React from "react";
import Business from "@pages/TableWindows/BusinessWindow.js";
import { BusinessAdapter } from "adapters/BusinessAdapter.js";
import { loadAbort } from "../utilities/LoadAbortAxios.utilities.js";
import axios from "axios";

const apiBase = "http://localhost:8000/";
const businessesApi = "locations/businesses";
const businessApi = "locations/business";

export const getAllBusiness = () => {
    const controller = loadAbort();
    const url = new URL(apiBase + businessesApi);
    return {call: axios.get(url.toString(), { signal: controller.signal }), controller };
}   

export const getBusiness = (id:number, params?: {timeout?: number, headers?: {}}) => {
    const controller = loadAbort();
    const url = new URL(apiBase + businessApi + '/' + id);
    return {call: axios.get(url.toString(), {signal: controller.signal, params }), controller };
}

export const createBusiness = (business: JSON, params?: {timeout?: number, headers?: {}}) => {
    const controller = loadAbort();
    const url = new URL(apiBase + businessApi);
    return {call: axios.post(url.toString(), business, { signal: controller.signal }), controller };
}

export const updateBusiness = (id:number, business: String, params?: {timeout?: number, headers?: {}}) => {
    const controller = loadAbort();
    const url = new URL(apiBase + businessApi + '/' + id);
    return {call: axios.put(url.toString(), business, { signal: controller.signal }), controller };
}

export const deleteBusiness = (id: number, params?: {timeout?: number, headers?: {}}) => {
    const controller = loadAbort();
    const url = new URL(apiBase + businessApi + '/' + id);
    return {call: axios.delete(url.toString(), { signal: controller.signal }), controller };
}
   