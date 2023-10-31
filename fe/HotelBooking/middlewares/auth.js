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

export const SignIn = async (email, password) => {
  try {
    const response = await fetch(`${LOCAL_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      data: {
        message: 'An error occurred while signing in. Please try again later.',
      },
      error: error,
    };
  }
};

export const CreateAccount = async (
  name,
  phone_number,
  email,
  password,
  type,
) => {
  try {
    const response = await fetch(`${LOCAL_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, phone_number, email, password, type}),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      data: {
        message: 'An error occurred while signing up. Please try again later.',
      },
      error: error,
    };
  }
};

export const APIUpdateProfile = async (
  name,
  phone_number,
  email,
  tokenNotification,
) => {
  try {
    const response = await fetch(`${LOCAL_API_URL}/auth/updateProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, phone_number, email, tokenNotification}),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      data: {
        message:
          'An error occurred while updating profile. Please try again later.',
      },
      error: error,
    };
  }
};

export const APIChangePassword = async (email, old_password, new_password) => {
  try {
    const response = await fetch(`${LOCAL_API_URL}/auth/changePassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, old_password, new_password}),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      data: {
        message:
          'An error occurred while changing password. Please try again later.',
      },
      error: error,
    };
  }
};

export const APIUpdateTokenNotification = async (tokenNotification, email) => {
  try {
    const response = await fetch(
      `${LOCAL_API_URL}/auth/updateTokenNotification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({tokenNotification, email}),
      },
    );
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      data: {
        message:
          'An error occurred while updating token notification. Please try again later.',
      },
      error: error,
    };
  }
};
