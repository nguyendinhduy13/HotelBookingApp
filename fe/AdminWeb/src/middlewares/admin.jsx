import { GET, POST, PUT, DELETE } from "../functions/fetchToBE";

export const GetAllAdmins = async () => {
  const path = `/admins/getall`;
  const response = await GET(path);
  return response;
};

export const GetSingleAdmin = async (id) => {
  const path = `/admins/${id}`;
  const response = await GET(path);
  return response;
};

export const UpdateInfoAdmin = async (id, dataPut) => {
  const path = `/admins/update/${id}`;
  const response = await PUT(path, dataPut);
  return response;
};

export const CreateAdmin = async (dataPost) => {
  const path = `/admins/register`;
  const response = await POST(path, dataPost);
  return response;
};

export const DeleteAdmin = async (id) => {
  const path = `/admins/delete/${id}`;
  const response = await DELETE(path);
  return response;
};
