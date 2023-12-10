import { LOCAL_API_URL } from "../api";

export const POST = async (path, dataPost) => {
  try {
    const API = `${LOCAL_API_URL}${path}`;
    const response = await fetch(API, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      }),
      body: JSON.stringify(dataPost),
    });
    const data = await response.json();
    return { status: 200, data: data };
  } catch (error) {
    return { status: 401, data: { error: error } };
  }
};

export const GET = async (path) => {
  const API = `${LOCAL_API_URL}${path}`;
  try {
    const response = await fetch(API, {
      method: "GET",
    });
    const data = await response.json();
    return { status: 200, data: data };
  } catch (error) {
    return { status: 500, data: error };
  }
};

export const PUT = async (path, dataPut) => {
  const API = `${LOCAL_API_URL}${path}`;
  try {
    const response = await fetch(API, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      }),
      body: JSON.stringify(dataPut),
    });
    const data = await response.json();
    return { status: 200, data: data };
  } catch (error) {
    return { status: 500, data: error };
  }
};

export const DELETE = async (path) => {
  const API = `${LOCAL_API_URL}${path}`;
  try {
    const response = await fetch(API, {
      method: "DELETE",
    });
    const data = await response.json();
    return { status: 200, data: data };
  } catch (error) {
    return { status: 500, data: error };
  }
};
