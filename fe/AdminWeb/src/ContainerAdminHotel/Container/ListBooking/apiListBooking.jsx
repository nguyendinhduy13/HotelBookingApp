import {GET, POST} from '../../../functions/fetchToBE';

export const GetAllOrders = async () => {
  const path = `/orders/getallorders`;
  const response = await GET(path);
  return response;
};


export const SendNotification = async (data) => {
  const path = `/admins/notification`;
  const response = await POST(path,data);
  return response;
}

