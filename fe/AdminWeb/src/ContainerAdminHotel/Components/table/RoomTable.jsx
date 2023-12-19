import React from "react";
import "./roomtable.scss";
import avatar from "../../../assets/avatar.jpg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
const RoomTable = ({ dataTable,userName }) => {
  const { typeMoney } = useSelector((state) => state.global);

  const moneyAdapter = (money, type) => {
    var m = 0;
    if (type === "VND") {
      m = money.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
    } else if (type === "USD") {
      m = (money / 23000).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    }
    return m.split(".")[1] === "00" ? m.split(".")[0] : m;
  };

  const paymentAdapter = (method) => {
    if (method === "payment-hotel") {
      return "Payment at hotel";
    } else if (method === "payment-online") {
      return "Payment online";
    }
  };

  const formatID = (id) => {
    //break id into 2 parts and add ... between them
    return id.slice(0, 5) + "..." + id.slice(id.length - 5, id.length);
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return dataTable? (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Order ID</TableCell>
            <TableCell className="tableCell">Customer</TableCell>
            <TableCell className="tableCell">Room</TableCell>
            <TableCell className="tableCell">Check In</TableCell>
            <TableCell className="tableCell">Check Out</TableCell>
            <TableCell className="tableCell">Cost</TableCell>
            <TableCell className="tableCell">Payment Method</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataTable?.length > 0 ? (
            dataTable
              ?.map(
                (item, index) =>
                  index < 5 && (
                    <TableRow key={item._id}>
                      <TableCell>{formatID(item._id)}</TableCell>
                      <TableCell className="tableCell">
                        {item.id_user.name||userName}
                      </TableCell>
                      <TableCell className="tableCell">
                        <div className="cellWrapper">
                          <img src={avatar} alt="" className="cellImg" />
                          {item.id_room.name}
                        </div>
                      </TableCell>
                      <TableCell className="tableCell">
                        {formatDate(item.check_in)}
                      </TableCell>
                      <TableCell className="tableCell">
                        {formatDate(item.check_out)}
                      </TableCell>
                      <TableCell className="tableCell">
                        {moneyAdapter(item.total, typeMoney)}
                      </TableCell>
                      <TableCell className="tableCell">
                        {paymentAdapter(item.payment_method)}
                      </TableCell>
                      <TableCell className="tableCell">
                        <span className={`status ${item.status}`}>
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
              )
              .reverse()
          ) : (
            <div className="empty">
              <p className="emptyText">No data</p>
            </div>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ) :(
    <div className="loading-table">
      <div className="loading-spinner-table"/>
    </div>
  )
};

export default RoomTable;
