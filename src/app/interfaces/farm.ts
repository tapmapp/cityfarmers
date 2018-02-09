export interface Farm {
    _id: string;
    farmer: string;
    name: string;
    temperature: number;
    temperatureVent: number;
    system: string; 
    city: string; 
    country: string;
    humidity: number;
    status: boolean;
    state: boolean;
    lightingOn: string;
    lightingOff: string;
    watering: number;
    created: string;
}