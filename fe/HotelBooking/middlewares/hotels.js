import { LOCAL_API_URL } from '../src/api';

export const GetAllHotels = async () => {
    const API = `${LOCAL_API_URL}/hotels/getall`;
    try {
        const response = await fetch(API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return { status: 200, data: data };
    } catch (error) {
        return {
            status: 401,
            message:
                'An error occurred while getting all hotels. Please try again later.',
            error: error,
        };
    }
};
