import React from "react";
import "./widgetroom.scss";

import { useDispatch } from "react-redux";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useSelector } from "react-redux";
import CustomLink from "../../../components/customlink/CustomLink";
import { setStateSidebar } from "../../../redux/Slices/Global";
import BarChartIcon from '@mui/icons-material/BarChart';
import { moneyAdapter } from "../../../functions/Adapter";
const WidgetRoom = ({ type }) => {
  const { typeMoney} = useSelector(
    (state) => state.global
  );
  const {order,totalOrder}=useSelector(state=>state.order)
  const dispatch = useDispatch();
  let data;
  const diff = 20;

  const handleNavigate = (state) => {
    dispatch(setStateSidebar(state));
  };

  switch (type) {
    case "order":
      data = {
        title: "Booking",
        isMoney: false,
        link: "View all bookings",
        amount: order?.length,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              color: "goldenrod",
              backgroundColor: "rgba(218,165,32,0.2)",
            }}
          />
        ),
        state: "Orders",
        to: "/listbooking",
      };
      break;
    case "revenue":
      data = {
        title: "Revenue",
        isMoney: false,
        amount:moneyAdapter(totalOrder, typeMoney),
        link: "View revenue details",
        icon: (
          <BarChartIcon
            className="icon"
            style={{ color: "green", backgroundColor: "rgba(0,128,0,0.2)" }}
          />
        ),
        state: "Revenue",
        to: "/revenue",
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.amount}
        </span>
        <CustomLink to={data.to}>
          <span
            className="link"
            onClick={() => {
              handleNavigate(data.state, data.path);
            }}
          >
            {data.link}
          </span>
        </CustomLink>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default WidgetRoom;
