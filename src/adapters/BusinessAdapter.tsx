import adaptersInterface from "./adaptersInterface.js";



interface RawBusinessData {
    id: number;
    name: string;
    tin: string;
    utr: string;
    creation_date: Date;
    update_date: Date;
}

export class BusinessAdapter implements adaptersInterface{

        dataTypes = {
            id: typeof Number,
            name: typeof String,
            TIN: typeof String,
            UTR: typeof String,
            creation_date: typeof Date,
            update_date: typeof Date,
        }
    

    setted = false
    value: RawBusinessData = {} as RawBusinessData;

    get FormattedCreationDate(){
        return new Date( this.value.creation_date).toDateString();
    }

    adapt(data: RawBusinessData) {
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