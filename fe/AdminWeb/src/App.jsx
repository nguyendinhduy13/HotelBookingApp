import "./app.scss";
import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getLocalStorage } from "./functions/asyncStorageFunctions";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { Home, Login, List, Single, New, Chat, Revenue } from "./pages";
import SideBar from "./components/sidebar/SideBar";
import NavBar from "./components/navbar/NavBar";
import Announce from "./components/announce/Announce";

import { AdminInputs, HotelInputs } from "./formSource";

import { GetAllOrders } from "./middlewares/order";
import { GetAllHotels } from "./middlewares/hotel";
import { GetAllUsers } from "./middlewares/user";
import { CheckLogin } from "./middlewares/auth";
import { GetAllAdmins } from "./middlewares/admin";

import {
  setTotalHotel,
  setTotalOrder,
  setTotalUser,
  setTotalAdmin,
  setUserInfo,
  setStateSidebar,
  setIsLoading,
  setAnnouncementAuto,
  setTargetMonth,
} from "./redux/Slices/Global";

import HomeHotel from "./ContainerAdminHotel/Container/Home/Home";
import SideBarHotel from "./ContainerAdminHotel/Components/SideBarHotel/SideBarHotel";
import NavBarHotel from "./ContainerAdminHotel/Components/NavBarHotel/NavBarHotel";
import ListRoom from "./ContainerAdminHotel/Container/ListRoom/ListRoom";
import ListBooking from "./ContainerAdminHotel/Container/ListBooking/ListBooking";
import {
  RoomInputs,
  VehicleInputs,
} from "./ContainerAdminHotel/Components/Input/DataInput";
import AddNewRoom from "./ContainerAdminHotel/Container/ListRoom/AddNewRoom/AddNewRoom";
import UpdateRoom from "./ContainerAdminHotel/Container/ListRoom/UpdateRoom/UpdateRoom";
import BookingDetail from "./ContainerAdminHotel/Container/ListBooking/BookingDetail/BookingDetail";
import ListVehicle from "./ContainerAdminHotel/Container/ListVehicle/ListVehicle";
import AddNewVehicle from "./ContainerAdminHotel/Container/ListVehicle/AddNewVehicle/AddNewVehicle";
import UpdateVehicle from "./ContainerAdminHotel/Container/ListVehicle/UpdateVehicle/UpdateVehicle";
import RevenueHotel from "./ContainerAdminHotel/Container/Revenue/RevenueHotel";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userInfo, isLoading } = useSelector((state) => state.global);

  useEffect(() => {
    GetAllHotels().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalHotel(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    getLocalStorage("target").then((res) => {
      if (res) {
        dispatch(setTargetMonth(res));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    GetAllOrders().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalOrder(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    GetAllUsers().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalUser(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    GetAllAdmins().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalAdmin(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    getLocalStorage("token").then((res) => {
      if (res) {
        CheckLogin(res).then((res) => {
          if (res.status === 200) {
            dispatch(setUserInfo(res.data.data.admin));
            dispatch(setIsLoading(false));
          } else {
            dispatch(setUserInfo(""));
            dispatch(setIsLoading(false));
            dispatch(
              setAnnouncementAuto({
                message: "Please login to continue!",
                type: "error",
              })
            );
          }
        });
      } else {
        dispatch(setUserInfo(""));
        dispatch(setIsLoading(false));
        dispatch(
          setAnnouncementAuto({
            message: "Please login to continue!",
            type: "error",
          })
        );
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const currentpath = location.pathname;
    if (userInfo.roll === "adminapp") {
      if (currentpath === "/") {
        dispatch(setStateSidebar("Dashboard"));
      } else if (currentpath.split("/")[1] === "user") {
        dispatch(setStateSidebar("Users"));
      } else if (currentpath.split("/")[1] === "admin") {
        dispatch(setStateSidebar("Admin"));
      } else if (currentpath.split("/")[1] === "hotel") {
        dispatch(setStateSidebar("Hotels"));
      } else if (currentpath.split("/")[1] === "booking") {
        dispatch(setStateSidebar("Bookings"));
      } else if (currentpath.split("/")[1] === "chat") {
        dispatch(setStateSidebar("Chats"));
      } else if (currentpath.split("/")[1] === "revenue") {
        dispatch(setStateSidebar("Revenue"));
      }
    } else {
      if (currentpath === "/") {
        dispatch(setStateSidebar("Dashboard"));
      } else if (currentpath.split("/")[1] === "listroom") {
        dispatch(setStateSidebar("rooms"));
      } else if (currentpath.split("/")[1] === "listbooking") {
        dispatch(setStateSidebar("Bookings"));
      }
      else if (currentpath.split("/")[1] === "listvehicle") {
        dispatch(setStateSidebar("Vehicles"));
      }
      else if (currentpath.split("/")[1] === "revenue") {
        dispatch(setStateSidebar("Revenue"));
      }
      else if (currentpath.split("/")[1] === "chat") {
        dispatch(setStateSidebar("Chats"));
      }
    }
  }, [location.pathname, userInfo.roll, dispatch]);

  return (
    <div className="app">
      {isLoading ? (
        <></>
      ) : userInfo.roll === "adminapp" ? (
        <>
          <div className="main">
            {userInfo && <SideBar />}
            <div className="container">
              {userInfo && <NavBar />}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Routes>
                  <Route path="/">
                    <Route
                      path="/"
                      element={userInfo ? <Home /> : <Navigate to="/login" />}
                    />
                    <Route
                      path="login"
                      element={userInfo ? <Navigate to="/" /> : <Login />}
                    />
                    <Route
                      path="chat"
                      element={userInfo ? <Chat /> : <Navigate to="/login" />}
                    />

                    <Route path="user">
                      <Route
                        index
                        element={userInfo ? <List /> : <Navigate to="/login" />}
                      />
                      <Route
                        path=":userId"
                        element={
                          userInfo ? <Single /> : <Navigate to="/login" />
                        }
                      />
                    </Route>

                    <Route path="admin">
                      <Route
                        index
                        element={userInfo ? <List /> : <Navigate to="/login" />}
                      />
                      <Route
                        path=":adminId"
                        element={
                          userInfo ? (
                            <Single inputs={AdminInputs} />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                      <Route
                        path="new"
                        element={
                          userInfo ? (
                            <New title={"Add New Admin"} inputs={AdminInputs} />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                    </Route>

                    <Route path="booking">
                      <Route
                        index
                        element={userInfo ? <List /> : <Navigate to="/login" />}
                      />
                      <Route
                        path=":bookingId"
                        element={
                          userInfo ? (
                            <Single inputs={HotelInputs} />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                    </Route>

                    <Route path="hotel">
                      <Route
                        index
                        element={userInfo ? <List /> : <Navigate to="/login" />}
                      />
                      <Route
                        path=":hotelId"
                        element={
                          userInfo ? (
                            <Single inputs={HotelInputs} />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                      <Route
                        path="new"
                        element={
                          userInfo ? (
                            <New title={"Add New Hotel"} inputs={HotelInputs} />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                    </Route>

                    <Route path="chat">
                      <Route
                        index
                        element={userInfo ? <Chat /> : <Navigate to="/login" />}
                      />
                      <Route
                        path=":userID"
                        element={userInfo ? <Chat /> : <Navigate to="/login" />}
                      />
                    </Route>

                    <Route path="revenue">
                      <Route
                        index
                        element={
                          userInfo ? <Revenue /> : <Navigate to="/login" />
                        }
                      />
                      {/* <Route
                      path=":userID"
                      element={
                        userInfo ? <Revenue /> : <Navigate to="/login" />
                      }
                    /> */}
                    </Route>
                  </Route>

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </LocalizationProvider>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="main">
            {userInfo && <SideBarHotel />}
            <div className="container">
              {userInfo && <NavBarHotel />}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Routes>
                  <Route path="/">
                    <Route
                      path="/"
                      element={
                        userInfo ? <HomeHotel /> : <Navigate to="/login" />
                      }
                    />
                    <Route
                      path="login"
                      element={userInfo ? <Navigate to="/" /> : <Login />}
                    />
                    <Route
                      path="chat"
                      element={userInfo ? <Chat /> : <Navigate to="/login" />}
                    />

                    <Route path="listroom">
                      <Route
                        index
                        element={
                          userInfo ? <ListRoom /> : <Navigate to="/login" />
                        }
                      />
                      <Route
                        path="new"
                        element={
                          userInfo ? (
                            <AddNewRoom
                              title={"Add New Room"}
                              inputs={RoomInputs}
                            />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                      <Route
                        path="edit/:roomId"
                        element={
                          userInfo ? (
                            <UpdateRoom title={"Update Room"} />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                    </Route>

                    <Route path="listbooking">
                      <Route
                        index
                        element={
                          userInfo ? <ListBooking /> : <Navigate to="/login" />
                        }
                      />
                      <Route
                        path=":bookingId"
                        element={
                          userInfo ? (
                            <BookingDetail />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                    </Route>
                    

                    <Route path="listvehicle">
                      <Route
                        index
                        element={
                          userInfo ? <ListVehicle /> : <Navigate to="/login" />
                        }
                      />
                       <Route
                        path="new"
                        element={
                          userInfo ? (
                            <AddNewVehicle
                              title={"Add New Vehicle"}
                              inputs={VehicleInputs}
                            />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                      <Route
                        path="edit/:vehicleId"
                        element={
                          userInfo ? (
                            <UpdateVehicle title={"Update Vehicle"} />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                    </Route>

                    <Route path="revenue">
                      <Route
                        index
                        element={
                          userInfo ? <RevenueHotel /> : <Navigate to="/login" />
                        }
                      />
                    </Route>

                    <Route path="user">
                      <Route
                        path=":userId"
                        element={
                          userInfo ? <Single /> : <Navigate to="/login" />
                        }
                      />
                    </Route>

                    <Route path="hotels">
                      <Route
                        index
                        element={userInfo ? <List /> : <Navigate to="/login" />}
                      />
                      <Route
                        path=":hotelId"
                        element={
                          userInfo ? <Single /> : <Navigate to="/login" />
                        }
                      />
                      <Route
                        path="new"
                        element={userInfo ? <New /> : <Navigate to="/login" />}
                      />
                    </Route>
                  </Route>

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </LocalizationProvider>
            </div>
          </div>
        </>
      )}
      <Announce />
    </div>
  );
}

export default App;
