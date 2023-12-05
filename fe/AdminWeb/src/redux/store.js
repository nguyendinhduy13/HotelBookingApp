import { configureStore } from "@reduxjs/toolkit";
import { globalSlice } from "./Slices/Global";
import { orderSlice } from "./Slices/OrderReducer";
export const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
    order: orderSlice.reducer,
  },
});
