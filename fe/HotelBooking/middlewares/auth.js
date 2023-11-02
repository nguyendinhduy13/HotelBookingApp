import {LOCAL_API_URL} from '../src/api';

export const CheckLogin = async token => {
  console.log('HOST: ' + LOCAL_API_URL);
  const API = `${LOCAL_API_URL}/auth/checkLogin`;
  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token: token}),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {status: 401, data: {message: 'Unauthorized'}, error: error};
  }
};

