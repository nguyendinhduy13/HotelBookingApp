import { GET } from "../../../functions/fetchToBE";

export const getAllRoomInHotel=()=>{
        const path = `/rooms/getallrooms`;
        const response = GET(path);
        return response;
}