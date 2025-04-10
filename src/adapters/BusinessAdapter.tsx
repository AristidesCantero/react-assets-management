import adaptersInterface from "./adaptersInterface.js";



interface RawBusinessData {
    id: number;
    name: string;
    tin: string;
    utr: string;
}

export class BusinessAdapter implements adaptersInterface{

        dataTypes = {
            id: typeof Number,
            name: typeof String,
            TIN: typeof String,
            UTR: typeof String,
        }

    adapt(data: RawBusinessData) {
        let value = data;
        
        return {
            id: value.id,
            name: value.name,
            TIN: value.tin,
            UTR: value.utr,
        }
    }

    adaptList(data: RawBusinessData[]) {
        let values = data;
        
        return data.map((item: any) => {
            let value = Object.values(item)[0] as RawBusinessData;
            let convert: RawBusinessData = {
                id: value.id,
                name: value.name,
                tin: value.tin,
                utr: value.utr,
            };
            return this.adapt(value);
        })
    }
    
  
}