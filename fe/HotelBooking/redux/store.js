import { configureStore } from '@reduxjs/toolkit';
import { globalSlice } from './Globalreducer';
import VehicleReducer from './VehicleReducer';
const store = configureStore({
    reducer: {
        global: globalSlice.reducer,
        VehicleReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
