import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        order: [],
        totalOrder: 0,
};

export const orderSlice = createSlice({
        name: "order",
        initialState,
        reducers: {
                setOrder: (state, action) => {
                        state.order = action.payload;
                },
                setTotalBooking: (state, action) => {
                        state.totalOrder = action.payload;
                }

        }
});

export const { setOrder,setTotalBooking } = orderSlice.actions;
export default orderSlice.reducer;

