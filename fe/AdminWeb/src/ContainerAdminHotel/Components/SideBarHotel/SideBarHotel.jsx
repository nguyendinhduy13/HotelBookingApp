import React from "react";
import "./sidebarhotel.scss";
import { useSelector, useDispatch } from "react-redux";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined';
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import { setStateSidebar, setUserInfo } from "../../../redux/Slices/Global";
import { setLocalStorage } from "../../../functions/asyncStorageFunctions";
import CustomLink from "../../../components/customlink/CustomLink";

const SideBarHotel = () => {
  const dispatch = useDispatch();
  const { stateSidebar } = useSelector((state) => state.global);

  const setActive = (name) => {
    dispatch(setStateSidebar(name));
  };

  const handleLogout = () => {
    setLocalStorage("token", "");
    dispatch(setUserInfo(""));
  };

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Admin</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <CustomLink to="/">
            <li
              className={stateSidebar === "Dashboard" ? "onUse" : ""}
              onClick={() => {
                setActive("Dashboard");
              }}
            >
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </CustomLink>
          <p className="title">LIST</p>
          <CustomLink to="listroom">
            <li
              className={stateSidebar === "rooms" ? "onUse" : ""}
              onClick={() => {
                setActive("rooms");
              }}
            >
              <KingBedOutlinedIcon className="icon" />
              <span>List Room</span>
            </li>
          </CustomLink>
      
          <CustomLink to="listbooking">
            <li
              className={stateSidebar === "Bookings" ? "onUse" : ""}
              onClick={() => {
                setActive("Bookings");
              }}
            >
              <ViewListOutlinedIcon className="icon" />
              <span>Booking</span>
            </li>
          </CustomLink>
          <CustomLink to="listvehicle">
            <li
              className={stateSidebar === "Vehicles" ? "onUse" : ""}
              onClick={() => {
                setActive("Vehicles");
              }}
            >
              <TwoWheelerIcon className="icon" />
              <span>List Vehicle</span>
            </li>
          </CustomLink>
          <p className="title">SERVICE</p>
          <CustomLink to="chat">
            <li
              className={stateSidebar === "Chats" ? "onUse" : ""}
              onClick={() => {
                setActive("Chats");
              }}
            >
              <HeadsetMicIcon className="icon" />
              <div className="NewMsg" />
              <span>Chat</span>
            </li>
          </CustomLink>
          {/* <li
            className={stateSidebar === "Profile" ? "onUse" : ""}
            onClick={() => {
              setActive("Profile");
            }}
          >
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li> */}
          <p className="title">REVENUE</p>
          <CustomLink to="revenue">
            <li
              className={stateSidebar === "Revenue" ? "onUse" : ""}
              onClick={() => {
                setActive("Revenue");
              }}
            >
              <BarChartIcon className="icon" />
              <span>Revenue</span>
            </li>
          </CustomLink>
          <p className="title">ACCOUNT</p>
          <li
            className={stateSidebar === "Log" ? "onUse" : ""}
            onClick={() => {
              handleLogout();
            }}
          >
            <LogoutOutlinedIcon className="icon" />
            <span>Log out</span>
          </li>
        </ul>
      </div>
      {/* <div className="bottom">
        <div className="colorOption"></div>
        <div className="colorOption"></div>
      </div> */}
    </div>
  );
};

export default SideBarHotel;
