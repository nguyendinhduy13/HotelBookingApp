import { GET, POST, DELETE, PUT } from "../functions/fetchToBE";

export const GetAllHotels = async () => {
  const path = `/hotels/getall`;
  const response = await GET(path);
  return response;
};

export const GetSingleHotel = async (id) => {
  const path = `/hotels/getbyid/${id}`;
  const response = await GET(path);
  return response;
};

export const CreateHotel = async (data) => {
  const path = `/hotels/addnewhotel`;
  const response = await POST(path, data);
  return response;
};

export const DeleteHotel = async (id) => {
  const path = `/hotels/delete/${id}`;
  const response = await DELETE(path);
  return response;
};

export const UpdateHotel = async (id, data) => {
  const path = `/hotels/update/${id}`;
  const response = await PUT(path, data);
  return response;
};
