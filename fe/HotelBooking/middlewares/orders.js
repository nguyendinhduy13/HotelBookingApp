import {LOCAL_API_URL} from '../src/api';

export const GetOrders = async id => {
  const API = `${LOCAL_API_URL}/orders/user/${id}`;
  try {
    const response = await fetch(API);
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      message:
        'An error occurred while getting orders. Please try again later.',
      error: error,
    };
  }
};

export const GetOrder = async id => {
  const API = `${LOCAL_API_URL}/orders/${id}`;
  try {
    const response = await fetch(API);
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      message: 'An error occurred while getting order. Please try again later.',
      error: error,
    };
  }
};

export const UpdateReview = async id => {
  const API = `${LOCAL_API_URL}/orders/reviewd/${id}`;
  try {
    const response = await fetch(API, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      message:
        'An error occurred while updating review. Please try again later.',
      error: error,
    };
  }
};

