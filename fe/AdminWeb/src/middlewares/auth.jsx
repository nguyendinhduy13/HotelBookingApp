import { POST } from "../functions/fetchToBE";

export const CheckLogin = async (token) => {
  const path = `/admins/checkLogin`;
  const data = { token: token };
  const response = await POST(path, data);
  return response;
};

export const SignIn = async (email, password) => {
  const path = `/admins/login`;
  const data = { email: email, password: password };
  const response = await POST(path, data);
  return response;
};
