import React from "react";
import { Headquarters } from "models/Interfaces/LocationInterfaces.js";
import { BusinessAdapter } from "adapters/BusinessAdapter.js";
import { loadAbort } from "utilities/LoadAbortAxios.utilities.js";
import axios from "axios";


const apiBase = "http://localhost:8000/";
const businessApi = "locations/headquarters";

export const getAllHeadquarters = () => {
    const controller = loadAbort();
    const url = new URL(apiBase + businessApi);
    return {call: axios.get(url.toString(), { signal: controller.signal }), controller };
}

export const getBusinessHeadquarters = (id: number) => {
    const controller = loadAbort();
    const url = new URL(apiBase + businessApi + '/' + id);
    return {call: axios.get(url.toString(), { signal: controller.signal }), controller };
}