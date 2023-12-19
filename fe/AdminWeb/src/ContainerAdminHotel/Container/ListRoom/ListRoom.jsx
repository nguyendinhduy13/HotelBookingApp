import { useEffect, useState } from "react";
import "./listroom.scss";
import { getAllRoomInHotel } from "./apiListRoom";
import { useSelector } from "react-redux";
import DataTable from "../../Components/DataTable/DataTable";
import { useLocation } from "react-router-dom";

const ListRoom = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const {userInfo}=useSelector(state=>state.global)
  const location = useLocation();
  const initFetch = async () => {
    setIsLoading(true);
    const res = await getAllRoomInHotel();
    if (res.status === 200) {
      const data = res.data.filter(
        (item) => item.hotel_id === userInfo.idHotel
      );
      setData(data);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    initFetch();
  }, [location]);

  useEffect(() => {
    if(reload){
      initFetch();
      setReload(false)
    }
  }, [reload]);
  return (
    <>
      {isLoading ? (
            <div className="loading-table">
            <div className="loading-spinner-table"/>
          </div>
      ) : (
        <div className="list">
          <div className="listContainer">
            <DataTable data={data} setReload={setReload}/>
          </div>
        </div>
      )}
    </>
  );
};

export default ListRoom;
