import {LOCAL_API_URL} from '../../api';

export const GetAllVehicle = async() => {
  const API = `${LOCAL_API_URL}/vehicle/getallvehicles`;
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

export const GetVehicleById = async(id) => {
  const API = `${LOCAL_API_URL}/vehicle/getvehiclebyidhotel/${id}`;
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
}

export const AddNewVehicle = async (data) => {
  const API = `${LOCAL_API_URL}/vehicle/addnewvehicle`;
  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return {status: 200, data: res};
  } catch (error) {
    return {
      status: 401,
      message:
        'An error occurred while getting orders. Please try again later.',
      error: error,
    };
  }
}
