import React from "react";
import "./navbar.scss";
import avatar from "../../assets/avatar.jpg";
import { useSelector, useDispatch } from "react-redux";
import { setTypeMoney, setAnnouncementAuto } from "../../redux/Slices/Global";

import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
// import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
// import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const NavBar = () => {
  const dispatch = useDispatch();
  const { userInfo, typeMoney } = useSelector((state) => state.global);

  const handleChangeTypeMoney = () => {
    if (typeMoney === "VND") {
      dispatch(setTypeMoney("USD"));
    } else {
      dispatch(setTypeMoney("VND"));
    }
    dispatch(
      setAnnouncementAuto({
        message: "Change type money successfully!",
        type: "success",
        id: Math.random(),
      })
    );
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          Hello, <span className="name">{userInfo.name}</span>
        </div>
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            <span>English</span>
          </div>
          <div className="item">
            <DarkModeOutlinedIcon className="icon" />
          </div>
          <div
            className="item"
            onClick={() => {
              handleChangeTypeMoney();
            }}
          >
            <AttachMoneyIcon className="icon" />
            <span>{typeMoney === "VND" ? "VND" : "USD"}</span>
          </div>
          <div className="item">
            <img src={avatar} alt="" className="avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
