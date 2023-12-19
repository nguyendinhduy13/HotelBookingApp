import { GET } from "../../../functions/fetchToBE";

export const getAllVehicleInHotel=()=>{
        const path = `/vehicle/getallvehicles`;
        const response = GET(path);
        return response;
}

export const getVehicleById=(id)=>{
        const path = `/vehicle/getvehiclebyidhotel/${id}`;
        const response = GET(path);
        return response;
}