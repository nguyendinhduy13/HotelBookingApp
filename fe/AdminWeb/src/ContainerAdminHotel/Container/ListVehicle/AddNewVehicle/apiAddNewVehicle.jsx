import { POST } from "../../../../functions/fetchToBE";

export const AddNewVehicleInHotel = (data) => {
        const res = POST("/vehicle/addnewvehicle", data);
        return res;
}