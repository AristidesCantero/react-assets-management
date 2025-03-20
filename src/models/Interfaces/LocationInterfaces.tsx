import React from "react";


export interface Business {
    id: number,
    name: string,
    tin: string,
    utr: string,
    creation_date: Date,
    update_date: Date,
};

export interface Location {
    id: Number,
    name: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
    email: String,
    website: String,
    business: Business,
};

