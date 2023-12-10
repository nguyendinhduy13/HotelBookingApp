import { GET, POST } from "../functions/fetchToBE";

export const GetAllOrders = async () => {
  const path = `/orders/getallorders`;
  const response = await GET(path);
  return response;
};

export const AddOrder = async (data) => {
  const path = `/orders/addneworder`;
  const response = await POST(path, data);
  return response;
};

export const GetOrderHotelByDate = async (data) => {
  const path = `/orders/gethotelbydate`;
  const response = await POST(path, data);
  return response;
};

export const GetOrderHotelByQuarter = async (data) => {
  const path = `/orders/gethotelbyquarter`;
  const response = await POST(path, data);
  return response;
};


export const GetOrderByDate = async (data) => {
  const path = `/orders/getbydate`;
  const response = await POST(path, data);
  return response;
};

export const GetOrderByQuarter = async (data) => {
  const path = `/orders/getbyquarter`;
  const response = await POST(path, data);
  return response;
};

export const GetOrderByID = async (data) => {
  const path = `/orders/${data}`;
  const response = await GET(path);
  return response;
};
