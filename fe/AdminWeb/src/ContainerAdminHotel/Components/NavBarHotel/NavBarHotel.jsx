import React from "react";
import "./navbarhotel.scss";
import avatar from "../../../assets/avatar.jpg";
import { useDispatch, useSelector } from "react-redux";

import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { setAnnouncementAuto, setTypeMoney } from "../../../redux/Slices/Global";

const NavBarHotel = () => {
  const dispatch = useDispatch();
  const { userInfo,typeMoney } = useSelector((state) => state.global);
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
          <div
            className="item"
            onClick={() => {
              handleChangeTypeMoney();
            }}
          >
            <AttachMoneyIcon className="icon" />
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <img src={avatar} alt="" className="avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarHotel;
