import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: "",
  isLoading: true,
  isDarkMode: false,
  announcement: [],
  typeMoney: "USD",
  targetThisMonth: 30000,
  stateSidebar: "Dashboard",
  totalHotel: [],
  totalOrder: [],
  totalUser: [],
  totalAdmin: [],
};

export const globalSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setTotalHotel: (state, action) => {
      state.totalHotel = action.payload;
    },
    setTotalOrder: (state, action) => {
      state.totalOrder = action.payload;
    },
    setTotalUser: (state, action) => {
      state.totalUser = action.payload;
    },
    setTotalAdmin: (state, action) => {
      state.totalAdmin = action.payload;
    },
    setTypeMoney: (state, action) => {
      state.typeMoney = action.payload;
    },
    setTargetMonth: (state, action) => {
      state.targetThisMonth = action.payload;
    },
    setStateSidebar: (state, action) => {
      state.stateSidebar = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAnnouncement: (state, action) => {
      state.announcement.push(action.payload);
    },
    removeAnnouncement: (state, action) => {
      if (action.payload.id !== null) {
        state.announcement = state.announcement.filter(
          (item) => item.id !== action.payload.id
        );
      } else {
        state.announcement.shift();
      }
    },
    updateData: (state, action) => {
      console.log(action.payload);
      switch (action.payload.type) {
        case "hotel":
          state.totalHotel.push(action.payload.data);
          break;
        case "admin":
          state.totalAdmin.data.admin.push(action.payload.data);
          console.log(state.totalAdmin);
          break;
        case "user":
          state.totalUser.data.users.push(action.payload.data);
          break;
        default:
          break;
      }
    },
    deleteData: (state, action) => {
      switch (action.payload.type) {
        case "hotel":
          state.totalHotel = state.totalHotel.filter(
            (item) => item._id !== action.payload.id
          );
          break;
        case "admin":
          state.totalAdmin.data.admin = state.totalAdmin.data.admin.filter(
            (item) => item._id !== action.payload.id
          );
          console.log("aaa");
          break;
        case "user":
          state.totalUser.data.users = state.totalUser.data.users.filter(
            (item) => item._id !== action.payload.id
          );
          break;
        default:
          break;
      }
    },
    updataSingleData: (state, action) => {
      const dataNew = action.payload.data;
      switch (action.payload.type) {
        case "hotel":
          //find index of specific object using findIndex method.
          const objIndex = state.totalHotel.findIndex(
            (obj) => obj._id === dataNew._id
          );
          //make new object of updated object.
          const updatedObj = { ...state.totalHotel[objIndex], ...dataNew };
          // make final new array of objects by combining updated object.
          const updateHotel = [
            ...state.totalHotel.slice(0, objIndex),
            updatedObj,
            ...state.totalHotel.slice(objIndex + 1),
          ];
          state.totalHotel = updateHotel;
          break;
        default:
          break;
      }
    },
  },
});

export const {
  setDarkMode,
  setTotalHotel,
  setTotalOrder,
  setTotalUser,
  setTotalAdmin,
  setTypeMoney,
  setUserInfo,
  setStateSidebar,
  setIsLoading,
  setAnnouncement,
  removeAnnouncement,
  updateData,
  deleteData,
  updataSingleData,
  setTargetMonth,
} = globalSlice.actions;

export default globalSlice.reducer;

export const setAnnouncementAuto = (announcement) => (dispatch) => {
  dispatch(setAnnouncement(announcement));
  setTimeout(() => {
    dispatch(removeAnnouncement({ id: null }));
  }, 3000);
};
