import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import ListTable from "../../components/table/Table";
import { useSelector } from "react-redux";
const Home = () => {
  const { totalOrder } = useSelector((state) => state.global);
  return (
    <div className="home">
      <div className="homeContainer">
        <div className="widgets">
          <Widget type="user" />
          <Widget type="hotel" />
          <Widget type="order" />
          <Widget type="revenue" />
        </div>
        <div className="charts">
          <Featured />
          <Chart
            dataChart={totalOrder.data}
            height={360}
            title={"Last 6 Months (Revenue)"}
          />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Orders</div>
          <ListTable dataTable={totalOrder.data} />
        </div>
      </div>
    </div>
  );
};

export default Home;
