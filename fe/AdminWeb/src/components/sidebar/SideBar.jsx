import React from "react";
import "./sidebar.scss";
import { useSelector, useDispatch } from "react-redux";
import { setStateSidebar, setUserInfo } from "../../redux/Slices/Global";
import { setLocalStorage } from "../../functions/asyncStorageFunctions";
import CustomLink from "../customlink/CustomLink";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const SideBar = () => {
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
          <CustomLink to="admin">
            <li
              className={stateSidebar === "Admin" ? "onUse" : ""}
              onClick={() => {
                setActive("Admin");
              }}
            >
              <AdminPanelSettingsOutlinedIcon className="icon" />
              <span>Admins</span>
            </li>
          </CustomLink>
          <CustomLink to="user">
            <li
              className={stateSidebar === "Users" ? "onUse" : ""}
              onClick={() => {
                setActive("Users");
              }}
            >
              <PeopleOutlinedIcon className="icon" />
              <span>Users</span>
            </li>
          </CustomLink>
          <CustomLink to="hotel">
            <li
              className={stateSidebar === "Hotels" ? "onUse" : ""}
              onClick={() => {
                setActive("Hotels");
              }}
            >
              <ApartmentOutlinedIcon className="icon" />
              <span>Hotels</span>
            </li>
          </CustomLink>
          <CustomLink to="booking">
            <li
              className={stateSidebar === "Bookings" ? "onUse" : ""}
              onClick={() => {
                setActive("Bookings");
              }}
            >
              <ViewListOutlinedIcon className="icon" />
              <span>Bookings</span>
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
    </div>
  );
};

export default SideBar;
