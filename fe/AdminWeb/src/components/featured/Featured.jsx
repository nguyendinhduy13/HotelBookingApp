import "./featured.scss";
import React, { useState, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutLinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import { moneyAdapter } from "../../functions/Adapter";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { useSelector, useDispatch } from "react-redux";
import { setLocalStorage } from "../../functions/asyncStorageFunctions";
import { setTargetMonth } from "../../redux/Slices/Global";

import { handleAddVirtualData } from "../../functions/Virtual";

const Featured = () => {
  const { totalOrder, typeMoney, targetThisMonth } = useSelector(
    (state) => state.global
  );
  const dispatch = useDispatch();

  const totalToday = () => {
    var total = 0;
    const today = new Date();
    totalOrder.data?.forEach((item) => {
      const date = new Date(item.check_in);
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear() &&
        item.status !== "Cancelled"
      ) {
        total += item.total;
      }
    });
    return moneyAdapter(total, typeMoney);
  };

  const totalThisWeek = () => {
    const now = new Date(); // Lấy ngày hiện tại
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    ); // Lấy ngày bắt đầu của tuần
    const endOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (6 - now.getDay())
    ); // Lấy ngày kết thúc của tuần
    var total = 0;
    totalOrder.data?.forEach((item) => {
      const date = new Date(item.check_in);
      if (
        date >= startOfWeek &&
        date <= endOfWeek &&
        item.status !== "Cancelled"
      ) {
        total += item.total;
      }
    });
    return moneyAdapter(total, typeMoney);
  };

  const totalThisMonth = () => {
    const now = new Date(); // Lấy ngày hiện tại
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Lấy ngày bắt đầu của tháng
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Lấy ngày kết thúc của tháng

    var total = 0;
    totalOrder.data?.forEach((item) => {
      const date = new Date(item.check_in);
      if (
        date >= startOfMonth &&
        date <= endOfMonth &&
        item.status !== "Cancelled"
      ) {
        total += item.total;
      }
    });
    return moneyAdapter(total, typeMoney);
  };

  const compare = (a, b) => {
    if (typeMoney === "USD") {
      var tempa = a.split(".");
      var tempb = b.split(".");

      tempa[0] = tempa[0].replace("$", "").replace(",", "");
      tempb[0] = tempb[0].replace("$", "").replace(",", "");

      return tempa[0] - tempb[0];
    } else if (typeMoney === "VND") {
      tempa = a.replace("VND", "");
      tempb = b.replace("VND", "");
      tempa = tempa.replace(".", "");
      tempb = tempb.replace(".", "");

      return tempa - tempb;
    }
  };

  const percentToday = (a, b) => {
    if (typeMoney === "USD") {
      var tempa = a.split(".");
      var tempb = b.split(".");

      tempa[0] = tempa[0].replace("$", "").replace(/,/g, "");
      tempb[0] = tempb[0].replace("$", "").replace(/,/g, "");

      return ((tempa[0] / tempb[0]) * 100).toFixed(2);
    } else if (typeMoney === "VND") {
      tempa = a.replace("VND", "");
      tempb = b.replace("VND", "");
      tempa = tempa.replace(/\./g, "");
      tempb = tempb.replace(/\./g, "");

      return ((tempa / tempb) * 100).toFixed(2);
    }
  };

  const [targetWeek, setW] = useState(
    moneyAdapter((targetThisMonth / 4) * 23000, typeMoney)
  );
  const [targetMonth, setM] = useState(
    moneyAdapter(targetThisMonth * 23000, typeMoney)
  );

  useEffect(() => {
    setW(moneyAdapter((targetThisMonth / 4) * 23000, typeMoney));
    setM(moneyAdapter(targetThisMonth * 23000, typeMoney));
  }, [targetThisMonth]);

  const [showPopup, setShowPopup] = useState(false);
  const [target, setTarget] = useState(targetThisMonth);
  const handleShowPopup = () => {
    setShowPopup(!showPopup);
  };

  const handleChange = (e) => {
    const newValue = e.target.value; // Get the new input value
    setTarget(newValue); // Update the target value
  };

  const handleSaveTarget = () => {
    if (target > 0) {
      setLocalStorage("target", target);
      dispatch(setTargetMonth(target));
      setShowPopup(false);
    }
  };

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <Tooltip
          title="
        Change target
        "
          placement="bottom"
        >
          <MoreVertIcon
            className="icon"
            fontSize="small"
            onClick={() => {
              // handleShowPopup();
              handleAddVirtualData();
            }}
          />
        </Tooltip>
        <div className={`changetarget ${showPopup ? "active" : ""}`}>
          <div className="header">
            <p className="title">Change target</p>
          </div>
          <div className="bodyFuck">
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <InputLabel htmlFor="standard-adornment-amount">
                Target
              </InputLabel>
              <Tooltip
                title="
        The target must be > 0
        "
                placement="bottom"
                arrow={true}
                describeChild={false}
              >
                <Input
                  id="standard-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      {typeMoney === "USD" ? "$" : "VND"}
                    </InputAdornment>
                  }
                  type="number"
                  value={target}
                  onChange={handleChange}
                  onKeyDown={(e)=>{
                    
                    if(e.key==="Enter"){
                      handleSaveTarget();
                    }
                  }}
                />
              </Tooltip>
            </FormControl>
            <CheckCircleIcon
              className={`icon ${
                target !== targetThisMonth ? "activeFuck" : ""
              }`}
              onClick={() => {
                handleSaveTarget();
              }}
            />
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar
            value={percentToday(totalToday(), targetMonth)}
            text={`${percentToday(totalToday(), targetMonth)}%`}
            strokeWidth={3}
          />
        </div>
        <p className="title">Total orders made today</p>
        <p className="amount">{totalToday()}</p>
        <p className="desc">
          Previous transactions processing. Last payments may not be included.
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Target</div>
            <div className="itemResult positive">
              <div className="resultAmount">
                {moneyAdapter(targetThisMonth * 23000, typeMoney)}
              </div>
            </div>
          </div>

          <div className="item">
            <div className="itemTitle">This Week</div>
            <div
              className={`itemResult ${
                compare(totalThisWeek(), targetWeek) < 0
                  ? "negative"
                  : "positive"
              }`}
            >
              {compare(totalThisWeek(), targetWeek) < 0 ? (
                <KeyboardArrowDownIcon fontSize="small" />
              ) : (
                <KeyboardArrowUpOutLinedIcon fontSize="small" />
              )}
              <div className="resultAmount">{totalThisWeek()}</div>
            </div>
          </div>

          <div className="item">
            <div className="itemTitle">This Month</div>
            <div
              className={`itemResult ${
                compare(totalThisMonth(), targetMonth) < 0
                  ? "negative"
                  : "positive"
              }`}
            >
              {compare(totalThisMonth(), targetMonth) < 0 ? (
                <KeyboardArrowDownIcon fontSize="small" />
              ) : (
                <KeyboardArrowUpOutLinedIcon fontSize="small" />
              )}
              <div className="resultAmount">{totalThisMonth()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
