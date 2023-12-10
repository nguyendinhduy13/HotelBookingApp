import { POST } from "../functions/fetchToBE";

export const SendMessage = async (data) => {
  const path = `/messages/sendmsg`;
  const response = await POST(path, data);
  return response;
};

export const ReceiveMessage = async (data) => {
  const path = `/messages/getmsg`;
  const response = await POST(path, data);
  return response;
};

export const GetListUser = async (data) => {
  const path = `/messages/getallmsg`;
  const response = await POST(path, data);
  return response;
};

export const DeleteConversation = async (data) => {
  const path = `/messages/deleteallmsg`;
  const response = await POST(path, data);
  return response;
};
