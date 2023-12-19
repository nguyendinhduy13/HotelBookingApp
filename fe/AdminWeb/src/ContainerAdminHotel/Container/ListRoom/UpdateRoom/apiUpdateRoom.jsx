import { POST } from "../../../../functions/fetchToBE";

export const UpdateRoomInHotel = (id,data) => {
        const res = POST(`/rooms/updateroom/${id}`, data);  
        return res;
}