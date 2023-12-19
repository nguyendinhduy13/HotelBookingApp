import { POST } from "../../../../functions/fetchToBE";

export const UpdateVehicleInHotel = (id,data) => {
        const res = POST(`/vehicle/updatevehicle/${id}`, data);  
        return res;
}