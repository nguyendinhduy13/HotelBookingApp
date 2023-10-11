import { LOCAL_API_URL } from "../src/api";

export const AddNewComment = async (
  id_user,
  id_hotel,
  id_room,
  content,
  rating,
) => {
  const API = `${LOCAL_API_URL}/comments/addnewcomment`;
  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id_user, id_hotel, id_room, content, rating}),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      message:
        'An error occurred while adding new comment. Please try again later.',
      error: error,
    };
  }
};
