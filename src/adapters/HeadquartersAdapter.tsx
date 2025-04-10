import adaptersInterface from "./adaptersInterface.js";

interface RawHeadquartersData {
    id: number,
    address: string,
    name: string,
    phone: number,
    business_key: number
}

export class HeadquartersAdapter implements adaptersInterface{

        dataTypes = {
            id: typeof Number,
            address: typeof String,
            name: typeof String,
            phone: typeof Number,
            business_key: typeof Number
        }


    adapt(data: RawHeadquartersData): {} {
        let value = data;
        
        return {
            id: value.id,
            address: value.address,
            name: value.name,
            phone: value.phone,
            business_key: value.business_key
        }
    }

    adaptList(data: RawHeadquartersData[]): {} {
        let values = data;
        
        return data.map((item: any) => {
            let value = Object.values(item)[0] as RawHeadquartersData;
            let convert: RawHeadquartersData = {
                id: value.id,
                address: value.address,
                name: value.name,
                phone: value.phone,
                business_key: value.business_key
            };
            return this.adapt(value);
        })
        
    }
    
  
}