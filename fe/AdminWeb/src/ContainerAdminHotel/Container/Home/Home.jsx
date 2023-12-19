import "./Home.scss";


import { useDispatch, useSelector } from "react-redux";
import RoomTable from "../../Components/table/RoomTable";
import WidgetRoom from "../../Components/widget/WidgetRoom";
import Chart from "../../../components/chart/Chart";
import { useEffect, useState } from "react";
import {  GetAllOrders } from "./apiHome";

import { setOrder, setTotalBooking } from "../../../redux/Slices/OrderReducer";
import Loading from "../../Components/Loading/Loading";
import HotelFeatured from "../../Components/Featured/HotelFeatured";
const HomeHotel = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {userInfo}=useSelector(state=>state.global)
  const initFetch = async () => {
    setIsLoading(true);
    const res = await GetAllOrders();
    if (res.status === 200) {
      const data = res.data.data.filter(
        (item) => item.id_hotel === userInfo.idHotel
      );
      const recentOrders = data.sort((a, b) => new Date(b.check_in) - new Date(a.check_in)).slice(0, 5);
      let total = 0;
      await data.map((item) => {
        if (item.status !== "Cancelled"){
        total += item.total;
        }
      });
      dispatch(setTotalBooking(total));
      dispatch(setOrder(data));
      setData(recentOrders);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initFetch();
  }, []);

  return (
    <>
    {isLoading ? <Loading/>:
    <div className="home">
      <div className="homeContainer">
        <div className="widgets">
          <WidgetRoom type="order" />
          <WidgetRoom type="revenue" />
        </div>
        <div className="charts">
          <HotelFeatured />
          <Chart
            dataChart={data}
            height={360}
            title={"Last 6 Months (Revenue)"}
          />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Orders</div>
          <RoomTable dataTable={data} />
        </div>
      </div>
    </div>
    }
    </>
  );
};

export default HomeHotel;
