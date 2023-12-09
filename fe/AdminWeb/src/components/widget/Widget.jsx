import React from "react";
import "./widget.scss";
import { setStateSidebar } from "../../redux/Slices/Global";
import { useDispatch } from "react-redux";
import CustomLink from "../customlink/CustomLink";

// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BarChartIcon from '@mui/icons-material/BarChart';
import { useSelector } from "react-redux";
import { moneyAdapter } from "../../functions/Adapter";

const Widget = ({ type }) => {
  const { totalOrder, totalHotel, totalUser, typeMoney } = useSelector(
    (state) => state.global
  );
  const dispatch = useDispatch();
  let data;

  const totalEarnings = () => {
    var total = 0;
    totalOrder.data?.forEach((item) => {
      if (item.status !== "Cancelled") {
        total += item.total;
      }
    });
    return moneyAdapter(total, typeMoney);
  };

  const handleNavigate = (state) => {
    dispatch(setStateSidebar(state));
  };

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        amount: totalUser?.data?.users?.length,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{ color: "crimson", backgroundColor: "rgba(255,0,0,0.2)" }}
          />
        ),
        state: "Users",
        to: "/user",
      };

      break;
    case "order":
      data = {
        title: "BOOKINGS",
        isMoney: false,
        link: "View all bookings",
        amount: totalOrder?.data?.length,
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
        to: "/booking",
      };
      break;
    case "revenue":
      data = {
        title: "Revenue",
        isMoney: false,
        amount: totalEarnings(),
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
    case "hotel":
      data = {
        title: "Hotels",
        isMoney: false,
        amount: totalHotel?.length,
        link: "See all hotels",
        icon: (
          <ApartmentIcon
            className="icon"
            style={{ color: "purple", backgroundColor: "rgba(128,0,128,0.2)" }}
          />
        ),
        state: "Hotels",
        to: "/hotel",
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data?.title}</span>
        <span className="counter">{data?.amount}</span>
        <CustomLink to={data?.to}>
          <span
            className="link"
            onClick={() => {
              handleNavigate(data?.state, data?.path);
            }}
          >
            {data?.link}
          </span>
        </CustomLink>
      </div>
      <div className="right">
        <div></div>
        {data?.icon}
      </div>
    </div>
  );
};

export default Widget;
