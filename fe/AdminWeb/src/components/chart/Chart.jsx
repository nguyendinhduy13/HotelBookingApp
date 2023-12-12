import React, { useState } from "react";
import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { moneyAdapter } from "../../functions/Adapter";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Chart = ({ dataChart, height, title }) => {
  const { typeMoney } = useSelector((state) => state.global);

  var dataByYear = [];
  var currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  var startYear = 2021;
  var endYear = 2023;

  for (var year = startYear; year <= endYear; year++) {
    var dataMonths = [];
    for (var month = 0; month < 12; month++) {
      dataMonths.push({
        name: getMonthName(month),
        Total: 0,
        showTotal: 0,
        count: 0,
        orders: [],
      });
    }
    dataByYear.push({ year: year, dataMonths: dataMonths });
  }

  function getMonthName(month) {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  }

  const handlePushData = () => {
    dataChart?.forEach((item) => {
      if (item.status !== "Cancelled") {
        const date = new Date(item.check_in);
        const month = date.getMonth();
        const year = dataByYear.findIndex((x) => x.year === date.getFullYear());

        dataByYear[year].dataMonths[month].Total += item.total;
        dataByYear[year].dataMonths[month].showTotal = moneyAdapter(
          dataByYear[year].dataMonths[month].Total,
          typeMoney
        );
        dataByYear[year].dataMonths[month].count += 1;
        dataByYear[year].dataMonths[month].orders.push(item);
      }
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="intro">{label}</p>
          <p className="label">{`Total : ${payload[0].payload.showTotal}`}</p>
        </div>
      );
    }
  };

  return (
    <div className="chart">
      <div className="top">
        <h1 className="title"> {title}</h1>
        {handlePushData()}
        <MoreVertIcon className="icon" fontSize="small" onClick={() => {}} />
      </div>
      <div className="left">
        <ResponsiveContainer width="96%" height={height}>
          <AreaChart
            width={730}
            height={250}
            data={dataByYear[currentYear - 2021].dataMonths.slice(
              0,
              currentMonth + 1
            )}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            onClick={(e) => console.log(dataByYear)}
          >
            <defs>
              <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="Total"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#total)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
