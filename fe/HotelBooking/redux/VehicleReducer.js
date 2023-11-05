import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    infoVehicle: null,
    idHotel: null,
    payment_method: {
        id: 'payment-hotel',
        name: 'Thanh toán tại khách sạn',
        image: 'https://cdn1.iconfinder.com/data/icons/condominium-juristic-management/64/Common_fee-fee-money-condominium-512.png',
        available: true,
    },
};

const VehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        saveInfoVehicle: (state, action) => {
            state.infoVehicle = action.payload;
        },
        clearInfoVehicle: state => {
            state.infoVehicle = null;
        },
        saveIdHotel: (state, action) => {
            state.idHotel = action.payload;
        },
        setPaymentMethod: (state, action) => {
            state.payment_method = action.payload;
        },
    },
});

export const {
    saveInfoVehicle,
    clearInfoVehicle,
    saveIdHotel,
    setPaymentMethod,
} = VehicleSlice.actions;
export default VehicleSlice.reducer;
