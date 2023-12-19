import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {SendNotification } from "../apiListBooking";
import Skeleton from "@mui/material/Skeleton";
import avatar from "../../../../assets/avatar.jpg";
import { moneyAdapter } from "../../../../functions/Adapter";
import "./bookingdetail.scss";
import { GetOrderByID } from "../../../../middlewares/order";
import CustomLink from "../../../../components/customlink/CustomLink";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateStatusInOrder } from "../../../Components/DataTable/apiDataTable";
import Tooltip from "@mui/material/Tooltip";
const BookingDetail = () => {
  const navigate = useNavigate();
  const { typeMoney } = useSelector((state) => state.global);
  const { bookingId } = useParams();
  const [booking, setBooking] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const [isShow, setIsShow] = useState(true);
  const initFetch = async () => {
    GetOrderByID(currentPath.split("/")[2]).then((res) => {
      if (res.status === 200) {
        if (res.data.data.id_vehicle === undefined) {
          setIsShow(false);
        }
        setBooking({
          user: res.data.data.id_user,
          room: res.data.data.id_room,
          vehicle: res.data.data.id_vehicle,
          order: res.data.data,
        });
      }
    });
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
  };
// {
//   "token": "cu6j7fwwTl-9vIFgdnhQLz:APA91bG0TPPq5ynKv4jF5p5zexw4-rWTXVgHd-c3p0Nf2UUCGjhSzQpbRd0MsvLcDO92sUiw-cblYhf88gnpFHRnZmL1BaGxNlVFr2nInYe8ANb4rfP31niKP0_pBmjkpmEhhmjwuHHv",
//   "title": "Thông báo",
//   "body": "Bạn đã đặt phòng thành công huy",
//   "data": {
//       "type": "booking",
//       "id_user":"640aca4c8df7f8a1209eebc4",
//       "id_booking":"646cd8fbbe03ac27ed28c617",
//       "id_hotel":"raondalat"
//   }
// }

  const ConfirmBooking = async () => {
      const dataNoti = {
        token:booking?.user?.tokenNotification,
        title:"Thông báo",
        body:"Đơn đặt phòng của bạn đã được xác nhận",
        data:{
          type:"booking",
          id_user:booking?.user?._id,
          id_booking:booking?.order?._id,
          id_hotel:booking?.order?.id_hotel
        }
      }
      const res = await updateStatusInOrder(bookingId,"Completed");
      if (res.status===200){
        const resNoti = await SendNotification(dataNoti);
        navigate("/listbooking")
      }
  }

  const CancelBooking = async () => {
    const dataNoti = {
      token:booking?.user?.tokenNotification,
      title:"Thông báo",
      body:"Đơn đặt phòng của bạn đã bị hủy. Xin vui lòng đặt lại phòng khác",
      data:{
        type:"booking",
        id_user:booking?.user?._id,
        id_booking:booking?.order?._id,
        id_hotel:booking?.order?.id_hotel
      }
    }
      const res = await updateStatusInOrder(bookingId,"Cancelled");
      if(res.status===200){
        const resNoti = await SendNotification(dataNoti);
        navigate("/listbooking")
      }
    }

  useEffect(() => {
    initFetch();
  }, []);

  const paymentAdapter = (method) => {
    if (method === "payment-hotel") {
      return "Payment at hotel";
    } else if (method === "payment-online") {
      return "Payment online";
    } else if (method === "payment-zalopay") {
      return "Payment ZaloPay";
    }
  };

  const formatDescription = (description) => {
    if (description.length > 60) {
      return description.slice(0, 60) + "...";
    } else {
      return description;
    }
  };

  return (
    <div className="bookingDetail">
      <div className="container">
        <>
          <div className="top">
            <div className="left">
              <h1 className="title">Information</h1>
              <div className="item">
                {booking?.user?.email ? (
                  <img src={avatar} alt="" className="itemImg" />
                ) : (
                  <Skeleton variant="circular" className="itemImg" />
                )}
                <div className="detailss">
                  {booking?.user?.email ? (
                    <CustomLink to={`/user/${booking?.user?._id}`}>
                      <h1 className="itemTitle">{booking?.user?.name}</h1>
                    </CustomLink>
                  ) : (
                    <Skeleton variant="text" className="skeletonText dif" />
                  )}
                  {booking?.user?.email ? (
                    <div className="detailItem">
                      <span className="itemKey">Email:</span>
                      <span className="itemValue">{booking?.user?.email}</span>
                    </div>
                  ) : (
                    <Skeleton variant="text" className="skeletonText dif" />
                  )}
                  {booking?.user?.email ? (
                    <div className="detailItem">
                      <span className="itemKey">Phone:</span>
                      <span className="itemValue">
                        {booking?.user?.phone_number || "null"}
                      </span>
                    </div>
                  ) : (
                    <Skeleton variant="text" className="skeletonText dif" />
                  )}
                </div>
              </div>
            </div>
            <div className="right booking">
              <div className="room">
                <h1 className="title">Room</h1>
                <div className="roomItem">
                  {booking?.room?.name ? (
                    <img
                      src={booking?.room?.image[0]}
                      alt=""
                      className="imgRoom"
                    />
                  ) : (
                    <Skeleton variant="circular" className="imgRoom" />
                  )}

                  <div className="details">
                    {booking?.room?.name ? (
                      <h1 className="itemTitle">{booking?.room?.name}</h1>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                    {booking?.room?.description ? (
                      <div className="detailItem">
                        <span className="itemKey">Description:</span>
                        <span className="itemValue">
                          {formatDescription(booking?.room?.description) ||
                            "null"}
                        </span>
                      </div>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                    {booking?.room?.utility ? (
                      <div className="detailItem">
                        <span className="itemKey">Utility:</span>
                        <span className="itemValue">
                          {booking?.room?.utility?.map((item, index) =>
                            index < 5
                              ? item +
                                `
                              ${index === 4 ? "" : ","}
                              `
                              : ""
                          )}
                        </span>
                      </div>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="listContainer">
              <div className="listTitle">Order</div>
              <div className="detailOrder">
                {isShow ? (
                  <Tooltip
                    title={
                      <div className="customToolTip">
                        <div className="item">
                          {" "}
                          Fuel: ${booking?.vehicle?.specification[0]?.Fuel}
                        </div>
                        <div className="item">
                          {" "}
                          Power: $
                          {booking?.vehicle?.specification[0]?.max_Power}
                        </div>
                        <div className="item">
                          {" "}
                          Speed: $
                          {booking?.vehicle?.specification[0]?.max_Speed}
                        </div>
                        <div className="item">
                          {" "}
                          Speed 4s: $
                          {booking?.vehicle?.specification[0]?.speed_4s}
                        </div>
                      </div>
                    }
                    followCursor={true}
                    placement="right"
                  >
                    <div className="vehicle">
                      {booking?.vehicle?.name ? (
                        <img
                          src={booking?.vehicle?.image[0]}
                          alt=""
                          className="vehicleImg"
                        />
                      ) : (
                        <Skeleton variant="circular" className="vehicleImg" />
                      )}
                     <div className="infoVehicle">
                          <div className="nameV">
                            {booking?.vehicle?.name ? (
                              <h1 className="itemTitle">
                                {booking?.vehicle?.name}
                              </h1>
                            ) : (
                              <Skeleton
                                variant="text"
                                className="skeletonText dif"
                              />
                            )}
                          </div>
                          <div className="inforV">
                            <div className="itemV">
                              {booking?.vehicle?.brand ? (
                                <div className="detailItem">
                                  <span className="itemKey">Brand:</span>
                                  <span className="itemValue">
                                    {booking?.vehicle?.brand || "null"}
                                  </span>
                                </div>
                              ) : (
                                <Skeleton
                                  variant="text"
                                  className="skeletonText dif"
                                />
                              )}
                              {booking?.vehicle?.price ? (
                                <div className="detailItem">
                                  <span className="itemKey">Price:</span>
                                  <span className="itemValue">
                                    {booking?.vehicle?.price || "null"}
                                  </span>
                                </div>
                              ) : (
                                <Skeleton
                                  variant="text"
                                  className="skeletonText dif"
                                />
                              )}
                            </div>
                            <div className="itemV">
                              {booking?.order?.start_date ? (
                                <div className="detailItem">
                                  <span className="itemKey">Start:</span>
                                  <span className="itemValue">
                                    {formatDate(booking?.order?.start_date) || "null"}
                                  </span>
                                </div>
                              ) : (
                                <Skeleton
                                  variant="text"
                                  className="skeletonText dif"
                                />
                              )}
                              {booking?.order?.end_date ? (
                                <div className="detailItem">
                                  <span className="itemKey">End:</span>
                                  <span className="itemValue">
                                    {formatDate(booking?.order?.end_date) || "null"}
                                  </span>
                                </div>
                              ) : (
                                <Skeleton
                                  variant="text"
                                  className="skeletonText dif"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                    </div>
                  </Tooltip>
                ) : (
                  <></>
                )}

                <div className="info">
                  <div className="detailItem">
                    <span className="itemKey">Check In:</span>
                    <span className="itemValue">
                      {formatDate(booking?.order?.check_in)}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Check Out:</span>
                    <span className="itemValue">
                      {formatDate(booking?.order?.check_out)}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Total:</span>
                    <span className="itemValue">
                      {moneyAdapter(booking?.order?.total, typeMoney)}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Status:</span>
                    <span className={`itemValue ${booking?.order?.status}`}>
                      {booking?.order?.status}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Payment Method:</span>
                    <span className="itemValue">
                      {paymentAdapter(booking?.order?.payment_method)}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Payment:</span>
                    <span className="itemValue">
                      {booking?.order?.paymented ? "Paid" : "Not Paid"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="actionButton">
            {booking?.order?.status === "Pending" && (
              <button
                onClick={(event) => {
                  event.preventDefault();
                  ConfirmBooking();
                }}
                className="buttonSave"
              >
                Confirm
              </button>
            )}
            {booking?.order?.status === "Pending" && (
              <button
                onClick={(event) => {
                  event.preventDefault();
                  CancelBooking();
                }}
                className="buttonCancel"
              >
                Cancel
              </button>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default BookingDetail;
