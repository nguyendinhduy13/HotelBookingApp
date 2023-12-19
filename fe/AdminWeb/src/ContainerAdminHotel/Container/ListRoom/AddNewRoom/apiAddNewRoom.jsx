import { POST } from "../../../../functions/fetchToBE";

export const AddNewRoomInHotel = (data) => {
        const res = POST("/rooms/addnewroom", data);
        return res;
}