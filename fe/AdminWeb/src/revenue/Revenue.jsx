import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { moneyAdapter } from "../../functions/Adapter";
import "./revenue.scss";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import dayjs from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { MonthCalendar } from "@mui/x-date-pickers/MonthCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import Radio from "@mui/material/Radio";

import { GetOrderByDate, GetOrderByQuarter } from "../../middlewares/order";

import {
  BarChart,
  AreaChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(isLastDay && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
}));

function Day(props) {
  const { day, selectedDay, ...other } = props;

  if (selectedDay == null) {
    return <PickersDay day={day} {...other} />;
  }

  const start = selectedDay.startOf("week");
  //check if end is in the future
  const end = selectedDay.endOf("week").isAfter(dayjs())
    ? dayjs()
    : selectedDay.endOf("week");

  const dayIsBetween = day.isBetween(start, end, null, "[]");
  const isFirstDay = day.isSame(start, "day");
  const isLastDay = day.isSame(end, "day");

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={dayIsBetween ? { px: 2.5, mx: 0 } : {}}
      dayIsBetween={dayIsBetween}
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
    />
  );
}

function Custom(props) {
  const { day, firstDay, lastDay, ...other } = props;

  if (firstDay === "" || lastDay === "") {
    return <PickersDay day={day} {...other} />;
  }

  const isBetween = day.isBetween(firstDay, lastDay, null, "[]");
  const isFirstDay = day.isSame(firstDay, "day");
  const isLastDay = day.isSame(lastDay, "day");

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={isBetween ? { px: 2.5, mx: 0 } : {}}
      dayIsBetween={isBetween}
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
    />
  );
}

const options = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"];

function Revenue() {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [valueDay, setValueDay] = useState();
  const [valueWeek, setValueWeek] = useState();
  const [valueMonth, setValueMonth] = useState();
  const [valueCustom, setValueCustom] = useState({
    startDate: "",
    endDate: "",
  });
  const [dataChart, setDataChart] = useState([]);
  const [dataShowQuarter, setDataShowQuarter] = useState([]);
  const isFirstChoise = useRef(true);
  const [loading, setLoading] = useState(true);
  const [loadingQ, setLoadingQ] = useState(true);
  const [typeSelect, setTypeSelect] = useState("day");
  const [typeShow, setTypeShow] = useState("Today:");
  const [showDropdown, setShowDropdown] = useState(false);
  const [valueQuarter, setValueQuarter] = React.useState(options[1]);

  const { typeMoney, totalOrder } = useSelector((state) => state.global);

  var dataByYear = [];
  var startYear = 2021;
  var endYear = 2023;

  for (var year = startYear; year <= endYear; year++) {
    var dataMonths = [];
    for (var month = 0; month < 12; month++) {
      dataMonths.push({
        name: getMonthName(month),
        indexMonth: month + 1,
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

  const handlePushData = useCallback(() => {
    totalOrder.data?.forEach((item) => {
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
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="intro">{label}</p>
          <p className="label">{`Total : ${moneyAdapter(
            payload[0].payload.total,
            typeMoney
          )}`}</p>
        </div>
      );
    }
  };

  const CustomTooltipQuarter = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="intro">{label}</p>
          <p className="label">{`Total : ${moneyAdapter(
            payload[0].payload[selectedValue?.first],
            typeMoney
          )}`}</p>
          {selectedValue?.second !== "" && (
            <p className="label">{`Total : ${moneyAdapter(
              payload[0].payload[selectedValue?.second],
              typeMoney
            )}`}</p>
          )}
        </div>
      );
    }
  };

  useEffect(() => {
    handlePushData();
  }, []);

  const formatD = (date) => {
    //format like 2023-6-21
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleFormatDate = async (data, s, e) => {
    const dataByDate = [];
    const start = new Date(s);
    const end = new Date(e);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const numDays = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));

    if (numDays === 0) {
      const date = new Date(s);
      const dateF = formatD(date);
      const item = {
        date: dateF,
        total: 0,
        showTotal: 0,
        count: 0,
        name: formatDate(date).split(",")[0],
      };
      dataByDate.push(item);
    } else {
      for (let i = 0; i < numDays; i++) {
        const date = new Date(s);
        date.setDate(date.getDate() + i);
        const dateF = formatD(date);
        const item = {
          date: dateF,
          total: 0,
          showTotal: 0,
          count: 0,
          name: formatDate(date).split(",")[0],
        };
        dataByDate.push(item);
      }
    }

    data?.forEach((item) => {
      const index = dataByDate.findIndex((x) => x.date === item.check_in);
      if (index !== -1) {
        dataByDate[index].total += item.total;
        dataByDate[index].showTotal = moneyAdapter(
          dataByDate[index].total,
          typeMoney
        );
        dataByDate[index].count += 1;
      }
    });

    return dataByDate;
  };

  const handleGetDataChart = useCallback((startDate, endDate) => {
    const start = formatD(startDate);
    const end = formatD(endDate);
    const data = {
      start: start,
      end: end,
    };
    GetOrderByDate(data).then(async (res) => {
      if (res.status === 200) {
        const dataByDate = await handleFormatDate(
          res.data.data,
          startDate,
          endDate
        );
        setDataChart(dataByDate);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    handleGetDataChart(startDate, endDate);
  }, [endDate]);

  const handleOpenCalendar = () => {
    setOpenCalendar(!openCalendar);
  };

  const handleChooseType = (type) => {
    setTypeSelect(type);
  };

  const formatDate = (date) => {
    try {
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    } catch (error) {
      return "";
    }
  };

  const handleChooseDate = (date) => {
    switch (typeSelect) {
      case "day":
        setValueDay(date);
        setStartDate(dayjs(date).toDate());
        setEndDate(dayjs(date).toDate());
        setTypeShow("Today:");
        setValueWeek();
        setValueMonth();
        setValueCustom({
          startDate: "",
          endDate: "",
        });
        setOpenCalendar(false);
        break;
      case "week":
        setValueWeek(date);
        const startWeek = dayjs(date).startOf("week").toDate();
        const endWeek = dayjs(date).endOf("week").isAfter(dayjs())
          ? dayjs().toDate()
          : dayjs(date).endOf("week").toDate();
        setStartDate(startWeek);
        setEndDate(endWeek);
        setTypeShow("Week:");
        setValueDay();
        setValueMonth();
        setValueCustom({
          startDate: "",
          endDate: "",
        });
        setOpenCalendar(false);
        break;

      case "month":
        setValueMonth(date);
        const today = new Date();
        const startMonth = dayjs(date).startOf("month").toDate();
        const endMonth = dayjs(date)
          .endOf("month")
          .isSame(dayjs(today).endOf("month"))
          ? today
          : dayjs(date).endOf("month").toDate();
        setStartDate(startMonth);
        setEndDate(endMonth);
        setTypeShow("Month:");
        setValueWeek();
        setValueDay();
        setValueCustom({
          startDate: "",
          endDate: "",
        });
        setOpenCalendar(false);
        break;
      case "custom":
        if (isFirstChoise.current) {
          setValueCustom({
            startDate: date,
            endDate: "",
          });
          isFirstChoise.current = false;
        } else {
          setValueCustom({
            startDate: valueCustom.startDate,
            endDate: date,
          });
          const startCustom = dayjs(valueCustom.startDate).toDate();
          const endCustom = dayjs(date).toDate();
          setStartDate(startCustom);
          setEndDate(endCustom);
          setOpenCalendar(false);
          setTypeShow("Custom:");
          setValueWeek();
          setValueMonth();
          setValueDay();
          isFirstChoise.current = true;
        }
        break;
      default:
        break;
    }
  };

  const [selectedValue, setSelectedValue] = useState({
    first: "2023",
    second: "",
  });
  const handleChange = (event) => {
    if (selectedValue.second === "") {
      setSelectedValue({
        ...selectedValue,
        second: event.target.value,
      });
    } else {
      setSelectedValue({
        first: selectedValue.second,
        second: event.target.value,
      });
    }
  };
  const controlProps = (item) => ({
    checked: selectedValue.first === item || selectedValue.second === item,
    onChange: handleChange,
    value: item,
    name: "size-radio-button-demo",
    inputProps: { "aria-label": item },
    onClick: () => {
      if (item === selectedValue.second && selectedValue.first !== "") {
        setSelectedValue({
          ...selectedValue,
          second: "",
        });
      } else if (item === selectedValue.first && selectedValue.second !== "") {
        setSelectedValue({
          first: selectedValue.second,
          second: "",
        });
      }
    },
    disabled: selectedValue.first === item && selectedValue.second === "",
  });

  const handleGetDataQuarter = useCallback(async (value) => {
    const data = {
      quarter: Number(value.split(" ")[1]),
    };
    await GetOrderByQuarter(data).then((res) => {
      setDataShowQuarter(res.data.data);
    });
    setLoadingQ(false);
  }, []);

  useEffect(() => {
    setLoadingQ(true);
    handleGetDataQuarter(valueQuarter);
  }, [valueQuarter]);

  const [dataChartQuarter, setDataChartQuarter] = useState([]);
  const handleChooseYearToGetDataQuarter = useCallback(
    (first, second) => {
      const indexFirst = dataShowQuarter.findIndex(
        (x) => x.year === Number(first)
      );
      const indexSecond = dataShowQuarter.findIndex(
        (x) => x.year === Number(second)
      );
      const data =
        indexSecond !== -1
          ? [
              {
                name: dataShowQuarter[indexFirst]?.month[0].name,
                [first]: dataShowQuarter[indexFirst]?.month[0].total,
                [second]: dataShowQuarter[indexSecond]?.month[0].total,
              },
              {
                name: dataShowQuarter[indexFirst]?.month[1].name,
                [first]: dataShowQuarter[indexFirst]?.month[1].total,
                [second]: dataShowQuarter[indexSecond]?.month[1].total,
              },
              {
                name: dataShowQuarter[indexFirst]?.month[2].name,
                [first]: dataShowQuarter[indexFirst]?.month[2].total,
                [second]: dataShowQuarter[indexSecond]?.month[2].total,
              },
            ]
          : [
              {
                name: dataShowQuarter[indexFirst]?.month[0].name,
                [first]: dataShowQuarter[indexFirst]?.month[0].total,
              },
              {
                name: dataShowQuarter[indexFirst]?.month[1].name,
                [first]: dataShowQuarter[indexFirst]?.month[1].total,
              },
              {
                name: dataShowQuarter[indexFirst]?.month[2].name,
                [first]: dataShowQuarter[indexFirst]?.month[2].total,
              },
            ];
      setDataChartQuarter(data);
    },
    [dataShowQuarter]
  );
  useEffect(() => {
    handleChooseYearToGetDataQuarter(
      selectedValue?.first,
      selectedValue?.second
    );
  }, [selectedValue, dataShowQuarter]);

  return (
    <div className="revenue">
      <div className="container">
        <div className="overview">
          <div className="overview__title">
            <p>Overview</p>
            <div className="overview__title--header--date">
              <p>
                <span>(GMT+07:00)</span>
              </p>
              <div
                onClick={() => {
                  handleOpenCalendar();
                }}
                className={`overview__title__date ${
                  openCalendar ? "active" : ""
                }`}
              >
                <div className="overview__title__date--type">{typeShow}</div>
                <div className="overview__title__date--time">
                  {formatDate(startDate)}
                </div>
                <div className="overview__title__date--time">-</div>
                <div className="overview__title__date--time">
                  {formatDate(endDate)}
                </div>
                <CalendarTodayIcon className="icon" />
              </div>
            </div>
            <div className={`date-picker ${openCalendar ? "active" : ""}`}>
              <div className="date-picker__header">
                <div
                  onClick={() => {
                    handleChooseType("day");
                  }}
                  className={`date-picker__header--title ${
                    typeSelect === "day" ? "active" : ""
                  }`}
                >
                  Day
                </div>
                <div>|</div>
                <div
                  onClick={() => {
                    handleChooseType("week");
                  }}
                  className={`date-picker__header--title ${
                    typeSelect === "week" ? "active" : ""
                  }`}
                >
                  Week
                </div>
                <div>|</div>
                <div
                  onClick={() => {
                    handleChooseType("month");
                  }}
                  className={`date-picker__header--title ${
                    typeSelect === "month" ? "active" : ""
                  }`}
                >
                  Month
                </div>
                <div>|</div>
                <div
                  onClick={() => {
                    handleChooseType("custom");
                  }}
                  className={`date-picker__header--title ${
                    typeSelect === "custom" ? "active" : ""
                  }`}
                >
                  Custom
                </div>
              </div>
              <div className="date-picker__content">
                {typeSelect === "day" && (
                  <DateCalendar
                    value={valueDay}
                    onChange={(newValue) => {
                      handleChooseDate(newValue);
                    }}
                    disableFuture
                  />
                )}
                {typeSelect === "week" && (
                  <DateCalendar
                    value={valueWeek}
                    showDaysOutsideCurrentMonth
                    fixedWeekNumber={6}
                    onChange={(newValue) => {
                      handleChooseDate(newValue);
                    }}
                    slots={{ day: Day }}
                    slotProps={{
                      day: {
                        selectedDay: valueWeek,
                      },
                    }}
                    disableFuture
                  />
                )}
                {typeSelect === "month" && (
                  <MonthCalendar
                    value={valueMonth}
                    onChange={(newValue) => {
                      handleChooseDate(newValue);
                    }}
                    disableFuture
                  />
                )}
                {typeSelect === "custom" && (
                  <DateCalendar
                    showDaysOutsideCurrentMonth
                    fixedWeekNumber={6}
                    date={new Date()}
                    onChange={(newValue) => {
                      handleChooseDate(newValue);
                    }}
                    slots={{ day: Custom }}
                    slotProps={{
                      day: {
                        firstDay: valueCustom.startDate,
                        lastDay: valueCustom.endDate,
                      },
                    }}
                    disableFuture
                  />
                )}
              </div>
            </div>
          </div>
          <div className="overview__content">
            <div className="overview__content--header">
              <div className="overview__content--header--title">Revenue</div>
            </div>
            <div className="overview__content--chart">
              {loading ? (
                <>
                  <CircularProgress />
                </>
              ) : typeShow === "Today:" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={dataChart}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(value) =>
                        `${moneyAdapter(value, typeMoney, "chart")}`
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="total"
                      fill="#82ca9d"
                      barSize={30}
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    width={500}
                    height={300}
                    data={dataChart}
                    syncId="anyId"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(value) =>
                        `${moneyAdapter(value, typeMoney, "chart")}`
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="quarter">
          <div className="quarter__content">
            <div className="quarter__content--header">
              <div className="quarter__content--header--title">Quarter</div>

              <div
                onClick={() => {
                  setShowDropdown(!showDropdown);
                }}
                className="dropdown"
              >
                <p>{valueQuarter}</p>
                <KeyboardArrowDownIcon className="icon" />
              </div>
              <div
                className={`
                dropdown__content ${showDropdown ? "active" : ""}
                `}
              >
                {options.map((item, index) => (
                  <div
                    className="dropdown__content--item"
                    key={index}
                    onClick={() => {
                      setValueQuarter(item);
                      setShowDropdown(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="quarter__content--container">
              {loadingQ ? (
                <div className="loadingQ">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <div className="tab">
                    <div className="yearTab">
                      {dataShowQuarter
                        .map((item, index) => (
                          <div
                            key={index}
                            className={`yearTab--item ${
                              selectedValue?.first === `${item.year}`
                                ? selectedValue?.second === ""
                                  ? "disable"
                                  : ""
                                : ""
                            }`}
                          >
                            <div className="yearTab--item--header">
                              <div className="yearTab--item--title">
                                Year: {item.year}
                              </div>
                              <Radio
                                {...controlProps(`${item.year}`)}
                                size="small"
                              />
                            </div>
                            <div className="yearTab--item--content">
                              {moneyAdapter(item.totalQuarter, typeMoney)}
                            </div>
                          </div>
                        ))
                        .reverse()}
                    </div>
                  </div>
                  <div className="chartQuarter">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        width={500}
                        height={300}
                        data={dataChartQuarter}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          tickFormatter={(value) =>
                            `${moneyAdapter(value, typeMoney, "chart")}`
                          }
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tickFormatter={(value) =>
                            `${moneyAdapter(value, typeMoney, "chart")}`
                          }
                        />
                        <Tooltip content={<CustomTooltipQuarter />} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey={selectedValue?.first}
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey={selectedValue?.second}
                          stroke="#82ca9d"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
