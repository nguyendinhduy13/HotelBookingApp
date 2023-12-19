import "./hotelfeatured.scss";
import React, { useState, useEffect, useCallback } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutLinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import { moneyAdapter } from "../../../functions/Adapter";
import { AddOrder } from "../../../middlewares/order";
import { AddUser } from "../../../middlewares/user";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { useSelector, useDispatch } from "react-redux";
import { setLocalStorage } from "../../../functions/asyncStorageFunctions";
import { setTargetMonth } from "../../../redux/Slices/Global";

const Featured = () => {
  const { typeMoney, targetThisMonth } = useSelector(
    (state) => state.global
  );
  const {order: totalOrder} = useSelector((state) => state.order);
  const dispatch = useDispatch();

  const totalToday = () => {
    var total = 0;
    const today = new Date();
    totalOrder.forEach((item) => {
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
    totalOrder.forEach((item) => {
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
    totalOrder.forEach((item) => {
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

  const handleAddVirtualData = async () => {
    const id_user = [
      "640ac9668df7f8a1209eebc1",
      "640aca4c8df7f8a1209eebc4",
      "6410ac705b9b6e3be5bb05e0",
      "641345867aaa3bc49837d05c",
      "648ead3ed91a0b9e8e5150bc",
      "648ead3fd91a0b9e8e5150bf",
      "648ead40d91a0b9e8e5150c2",
      "648ead40d91a0b9e8e5150c5",
      "648ead41d91a0b9e8e5150c8",
      "648ead41d91a0b9e8e5150cb",
      "648ead42d91a0b9e8e5150ce",
      "648ead43d91a0b9e8e5150d1",
      "648ead43d91a0b9e8e5150d4",
      "648ead44d91a0b9e8e5150d7",
      "648ead44d91a0b9e8e5150da",
      "648ead45d91a0b9e8e5150dd",
      "648ead46d91a0b9e8e5150e0",
      "648ead46d91a0b9e8e5150e3",
      "648ead47d91a0b9e8e5150e6",
      "648ead48d91a0b9e8e5150e9",
      "648ead48d91a0b9e8e5150ec",
      "648ead49d91a0b9e8e5150ef",
      "648ead49d91a0b9e8e5150f2",
      "648ead4ad91a0b9e8e5150f5",
      "648ead4bd91a0b9e8e5150f8",
      "648ead4bd91a0b9e8e5150fb",
      "648ead4cd91a0b9e8e5150fe",
      "648ead4cd91a0b9e8e515101",
      "648ead4dd91a0b9e8e515104",
      "648ead4ed91a0b9e8e515107",
      "648ead4ed91a0b9e8e51510a",
      "648ead4fd91a0b9e8e51510d",
      "648ead4fd91a0b9e8e515110",
      "648ead50d91a0b9e8e515113",
      "648ead51d91a0b9e8e515116",
      "648ead51d91a0b9e8e515119",
      "648ead52d91a0b9e8e51511c",
      "648ead52d91a0b9e8e51511f",
      "648ead53d91a0b9e8e515122",
      "648ead54d91a0b9e8e515125",
      "648ead54d91a0b9e8e515128",
      "648ead55d91a0b9e8e51512b",
      "648ead55d91a0b9e8e51512e",
      "648ead56d91a0b9e8e515131",
      "648ead57d91a0b9e8e515134",
      "648ead57d91a0b9e8e515137",
      "648ead58d91a0b9e8e51513a",
      "648ead58d91a0b9e8e51513d",
      "648ead59d91a0b9e8e515140",
      "648ead5ad91a0b9e8e515143",
      "648ead5ad91a0b9e8e515146",
      "648ead5bd91a0b9e8e515149",
      "648ead5bd91a0b9e8e51514c",
      "648ead5cd91a0b9e8e51514f",
      "648ead5cd91a0b9e8e515152",
      "648ead5dd91a0b9e8e515155",
      "648ead5ed91a0b9e8e515158",
      "648ead5ed91a0b9e8e51515b",
      "648ead5fd91a0b9e8e51515e",
      "648ead5fd91a0b9e8e515161",
      "648ead60d91a0b9e8e515164",
      "648ead61d91a0b9e8e515167",
      "648ead61d91a0b9e8e51516a",
      "648ead62d91a0b9e8e51516d",
      "648ead62d91a0b9e8e515170",
      "648ead63d91a0b9e8e515173",
      "648ead63d91a0b9e8e515176",
      "648ead64d91a0b9e8e515179",
      "648ead65d91a0b9e8e51517c",
      "648ead65d91a0b9e8e51517f",
      "648ead66d91a0b9e8e515182",
      "648ead66d91a0b9e8e515185",
      "648ead67d91a0b9e8e515188",
      "648ead68d91a0b9e8e51518b",
      "648ead68d91a0b9e8e51518e",
      "648ead69d91a0b9e8e515191",
      "648ead69d91a0b9e8e515194",
      "648ead6ad91a0b9e8e515197",
      "648ead6bd91a0b9e8e51519a",
      "648ead6bd91a0b9e8e51519d",
      "648ead6cd91a0b9e8e5151a0",
      "648ead6cd91a0b9e8e5151a3",
      "648ead6dd91a0b9e8e5151a6",
      "648ead6dd91a0b9e8e5151a9",
      "648ead6ed91a0b9e8e5151ac",
      "648ead6fd91a0b9e8e5151af",
      "648ead6fd91a0b9e8e5151b2",
      "648ead70d91a0b9e8e5151b5",
      "648ead70d91a0b9e8e5151b8",
      "648ead71d91a0b9e8e5151bb",
      "648ead72d91a0b9e8e5151be",
      "648ead72d91a0b9e8e5151c1",
      "648ead73d91a0b9e8e5151c4",
      "648ead73d91a0b9e8e5151c7",
      "648ead74d91a0b9e8e5151ca",
      "648ead74d91a0b9e8e5151cd",
      "648ead75d91a0b9e8e5151d0",
      "648ead76d91a0b9e8e5151d3",
      "648ead76d91a0b9e8e5151d6",
      "648ead77d91a0b9e8e5151d9",
      "648ead77d91a0b9e8e5151dc",
      "648ead78d91a0b9e8e5151df",
      "648ead79d91a0b9e8e5151e2",
      "648ead79d91a0b9e8e5151e5",
    ];
    const data_room_hotel = [
      {
        id_hotel: "raondalat",
        id_room: [
          "6400be1bf2a68a5c0483e175",
          "6400be5ef2a68a5c0483e179",
          "6400be98f2a68a5c0483e17d",
          "6400bebff2a68a5c0483e181",
        ],
      },
      {
        id_hotel: "aaronhotel",
        id_room: [
          "6400b92396d921ff1835ffa8",
          "6400ba36f2a68a5c0483e131",
          "6400ba56f2a68a5c0483e135",
          "6400ba89f2a68a5c0483e139",
        ],
      },
      {
        id_hotel: "amishotel",
        id_room: [
          "6400bae0f2a68a5c0483e13d",
          "6400bb29f2a68a5c0483e141",
          "6400bb57f2a68a5c0483e145",
          "6400bb7df2a68a5c0483e149",
          "6400bb9ff2a68a5c0483e14d",
        ],
      },
      {
        id_hotel: "azuraresort",
        id_room: [
          "6400bc11f2a68a5c0483e153",
          "6400bc32f2a68a5c0483e157",
          "6400bc4ef2a68a5c0483e15b",
          "6400bc7ff2a68a5c0483e15f",
        ],
      },
      {
        id_hotel: "maybungalow",
        id_room: [
          "6400bd11f2a68a5c0483e165",
          "6400bd81f2a68a5c0483e169",
          "6400bda9f2a68a5c0483e16d",
          "6400bdcbf2a68a5c0483e171",
        ],
      },
    ];
    const total = [
      1300000, 1442828, 800000, 900000, 1200000, 200000, 600000, 700000,
      1000000, 1500000, 1800000, 2500000, 3000000, 3500000, 4000000, 4500000,
      5000000,
    ];

    function randomDate(startDate, endDate) {
      let start = startDate.getTime();
      let end = endDate.getTime();
      let random = Math.floor(Math.random() * (end - start)) + start;
      return new Date(random);
    }

    function addDays(date, days) {
      let timestamp = date.getTime();
      timestamp += days * 24 * 60 * 60 * 1000;
      return new Date(timestamp);
    }

    for (let i = 0; i < 712; ) {
      const r = Math.floor(Math.random() * data_room_hotel.length);

      let start = randomDate(new Date(2021, 0, 1), new Date(2023, 5, 22));
      let end = addDays(start, Math.floor(Math.random() * 10));

      start = `${start.getFullYear()}-${
        start.getMonth() + 1
      }-${start.getDate()}`;
      end = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;

      const temp = {
        id_user: id_user[Math.floor(Math.random() * id_user.length)],
        id_room:
          data_room_hotel[r].id_room[
            Math.floor(Math.random() * data_room_hotel[r].id_room.length)
          ],
        id_hotel: data_room_hotel[r].id_hotel,
        total: total[Math.floor(Math.random() * total.length)],
        check_in: start,
        check_out: end,
        status: "Completed",
        paymented: true,
      };

      await AddOrder(temp).then((res) => {
        if (res.status === 200) {
          i++;
        } else {
        }
      });
    }
  };

  const handleAddVirtualUser = async () => {
    const FirstName = [
      "Nguyễn",
      "Trần",
      "Lê",
      "Phạm",
      "Hoàng",
      "Huỳnh",
      "Phan",
      "Vũ",
      "Võ",
      "Đặng",
      "Bùi",
      "Đỗ",
      "Hồ",
      "Ngô",
      "Dương",
      "Lý",
      "An",
      "Bạch",
      "Bảo",
      "Bửu",
    ];

    const MiddleName = [
      "Thị",
      "Văn",
      "Quốc",
      "Thế",
      "Thiên",
      "Thành",
      "Thái",
      "Viết",
      "Đức",
      "Nhật",
      "Hữu",
    ];

    const LastName = [
      "Huy",
      "Hùng",
      "Hưng",
      "Hải",
      "Hà",
      "Hạnh",
      "Hạ",
      "Hân",
      "Hào",
      "Hậu",
      "Hiếu",
      "Hiền",
      "Hiệp",
      "Hoa",
      "Hoài",
      "Hoàn",
      "Hoàng",
      "Hoan",
      "Hoạt",
    ];

    const Email = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "icloud.com",
      "hotmail.com",
      "mail.com",
      "zoho.com",
      "protonmail.com",
      "aol.com",
      "gmx.com",
    ];

    const Phone = [
      "032",
      "033",
      "034",
      "035",
      "036",
      "037",
      "038",
      "039",
      "070",
      "079",
      "077",
      "076",
      "078",
      "083",
      "084",
      "085",
      "081",
      "082",
      "088",
      "089",
      "090",
      "093",
      "089",
      "091",
      "094",
      "092",
      "056",
    ];

    const Type = ["google", "app"];

    const Password = [
      "123456",
      "123456789",
      "12345678",
      "1234567890",
      "12345678910",
      "12345678911",
      "12345678912",
      "12345678913",
      "12345678914",
      "12345678915",
      "12345678916",
      "12345678917",
      "12345678918",
      "12345678919",
      "12345678920",
    ];

    //xóa dấu tiếng việt
    const removeAccents = (str) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .replace(/ /g, "");
    };

    for (let i = 0; i < 100; i++) {
      const nametemp = `${
        FirstName[Math.floor(Math.random() * FirstName.length)]
      } ${MiddleName[Math.floor(Math.random() * MiddleName.length)]} ${
        LastName[Math.floor(Math.random() * LastName.length)]
      }`;
      const temp = {
        name: nametemp,

        email: `${removeAccents(nametemp)}${Math.floor(
          Math.random() * 100000000
        )}@${Email[Math.floor(Math.random() * Email.length)]}`,
        phone_number: `${
          Phone[Math.floor(Math.random() * Phone.length)]
        }${Math.floor(Math.random() * 100000000)}`,
        type: Type[Math.floor(Math.random() * Type.length)],
        password: Password[Math.floor(Math.random() * Password.length)],
      };

      await AddUser(temp).then((res) => {
        if (res.status === 200) {
        } else {
        }
      });
    }
  };
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
              // handleAddVirtualData();
              // handleAddVirtualUser();
              handleShowPopup();
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
