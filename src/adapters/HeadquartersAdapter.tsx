import adaptersInterface from "./adaptersInterface.js";

interface RawHeadquartersData {
    id: number,
    address: string,
    name: string,
    phone: number,
    creation_date: Date,
    update_date: Date,
    business_key: number
}

export class HeadquartersAdapter implements adaptersInterface{

        dataTypes = {
            id: typeof Number,
            address: typeof String,
            name: typeof String,
            phone: typeof Number,
            creation_date: typeof Date,
            update_date: typeof Date,
            business_key: typeof Number
        }
    

    setted = false
    value: RawHeadquartersData = {} as RawHeadquartersData;

    FormattedDate(date: Date){
        return new Date(date).toDateString();
    }

    adapt(data: RawHeadquartersData) {
        this.value = data;
        
        return {
            id: this.value.id,
            address: this.value.address,
            name: this.value.name,
            phone: this.value.phone,
            creation_date: this.FormattedDate(this.value.creation_date),
            update_date: this.FormattedDate(this.value.update_date),
            business_key: this.value.business_key
        }
    }
    
  
}