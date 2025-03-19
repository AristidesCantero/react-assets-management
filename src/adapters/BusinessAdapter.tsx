import React from "react";
import { R } from "react-router/dist/development/route-data-BmvbmBej";
import { number } from "yup";



interface RawBusinessData {
    id: number;
    name: string;
    tin: string;
    utr: string;
    creation_date: Date;
    update_date: Date;
}

export class BusinessAdapter {

    private dataTypes = {
        id: typeof Number,
        name: typeof String,
        TIN: typeof String,
        UTR: typeof String,
        creation_date: typeof Date,
        update_date: typeof Date,
    }

    private setted: boolean = false;
    private value: RawBusinessData = {} as RawBusinessData;

    get FormattedCreationDate(){
        return new Date( this.value.creation_date).toDateString();
    }

    public adapt(data: RawBusinessData) {
        this.value = data;
        
        return {
            id: this.value.id,
            name: this.value.name,
            TIN: this.value.tin,
            UTR: this.value.utr,
            creation_date: this.value.creation_date,
            update_date: this.value.update_date,
        }
    }
    
  
}