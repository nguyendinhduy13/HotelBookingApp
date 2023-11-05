import {LOCAL_API_URL} from '../src/api';

export const SendMessage = async data => {
  const API = `${LOCAL_API_URL}/messages/sendmsg`;
  const {from, fromType, to, toType, message} = data;
  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        fromType,
        to,
        toType,
        message,
      }),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {status: 500, data: error};
  }
};

export const RecieveMessage = async data => {
  const API = `${LOCAL_API_URL}/messages/getmsg`;
  const {from, to} = data;
  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
      }),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {status: 500, data: error};
  }
};
