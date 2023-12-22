import "./single.scss";
import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetSingleUser } from "../../middlewares/user";
import { GetSingleAdmin } from "../../middlewares/admin";
import { GetSingleHotel, UpdateHotel } from "../../middlewares/hotel";
import { GetOrderByID } from "../../middlewares/order";
import { setStateSidebar, updataSingleData } from "../../redux/Slices/Global";
import { moneyAdapter, paymentAdapter } from "../../functions/Adapter";
import { UpdateInfoAdmin } from "../../middlewares/admin";
import { setAnnouncementAuto, setTotalAdmin } from "../../redux/Slices/Global";
import { GetImageUrl } from "../../functions/Global";
import CustomLink from "../../components/customlink/CustomLink";
import Tooltip from "@mui/material/Tooltip";

import Chart from "../../components/chart/Chart";
import ListTable from "../../components/table/Table";
import avatar from "../../assets/avatar.jpg";
import Skeleton from "@mui/material/Skeleton";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import CancelIcon from "@mui/icons-material/Cancel";
import { storage } from "../../configFirebase/config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Single = ({ inputs }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const dispatch = useDispatch();
  const { typeMoney, totalAdmin } = useSelector((state) => state.global);

  const [isShow, setIsShow] = useState(true);
  const [user, setUser] = useState({});
  const [admin, setAdmin] = useState({});
  const [hotel, setHotel] = useState({});
  const [booking, setBooking] = useState({});
  const [file, setFile] = useState(null);
  const [listImage, setListImage] = useState([]);
  const [isShowImage, setIsShowImage] = useState(false);
  const [imgIndex, setImgIndex] = useState(null);
  const [dataDelete, setDataDelete] = useState([]);
  const [progress, setProgress] = useState(0);
  const [startSave, setStartSave] = useState(false);

  useEffect(() => {
    if (currentPath.split("/")[1] === "user") {
      dispatch(setStateSidebar("Users"));
      GetSingleUser(currentPath.split("/")[2]).then((res) => {
        if (res.status === 200) {
          setUser(res.data.data.user);
        }
      });
    } else if (currentPath.split("/")[1] === "admin") {
      dispatch(setStateSidebar("Admin"));
      GetSingleAdmin(currentPath.split("/")[2]).then((res) => {
        const data = res.data.data.admin;
        setAdmin({
          name: data.name,
          email: data.email,
          phone_number: data.phone_number,
          avatar: data.avatar,
          country: data.country,
          idhotel: data.dataHotel[0].name,
          password: "********",
        });
      });
    } else if (currentPath.split("/")[1] === "hotel") {
      dispatch(setStateSidebar("Hotels"));
      GetSingleHotel(currentPath.split("/")[2]).then((res) => {
        setListImage([]);
        if (res.status === 200) {
          const data = res.data;
          setHotel({
            id: data.id,
            name: data.name,
            advantage: data.advantage,
            description: data.description,
            address: data.address,
            tag: data.tag,
            longitude: data.position[0],
            latitude: data.position[1],
          });
          res.data.image.map((img) => {
            return setListImage((prev) => [
              ...prev,
              {
                id: Math.random(),
                img: img,
                new: false,
              },
            ]);
          });
        }
      });
    } else if (currentPath.split("/")[1] === "booking") {
      dispatch(setStateSidebar("booking"));
      GetOrderByID(currentPath.split("/")[2]).then((res) => {
        console.log(res.data.data);
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
    }
  }, [dispatch, currentPath]);

  const totalSpending = (data) => {
    var total = 0;
    data?.orders?.forEach((order) => {
      total += order.total;
    });
    return moneyAdapter(total, typeMoney);
  };

  const formatDescription = (description) => {
    if (description.length > 60) {
      return description.slice(0, 60) + "...";
    } else {
      return description;
    }
  };

  const handleOpenImage = (img) => {
    setIsShowImage(true);
    const index = listImage.findIndex((item) => item.id === img.id);
    setImgIndex(index);
  };

  const handleDeleteImage = async (id) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp.findIndex((item) => item.id === id);
    if (listImageTemp[index].new === false) {
      setDataDelete((prev) => [...prev, listImage[index]?.img]);
    }
    listImageTemp.splice(index, 1);
    setListImage(listImageTemp);
  };

  const handleAddListImage = (file) => {
    //listImage have id, img
    const listImageTemp = [];
    for (let i = 0; i < file.length; i++) {
      listImageTemp.push({
        id: Math.random(),
        img: URL.createObjectURL(file[i]),
        imageFile: file[i],
        new: true,
      });
    }
    setListImage((prev) => [...prev, ...listImageTemp]);
  };

  const handleAddListImageToFirebase = async (type, file, idhotel) => {
    const name =
      file.name.split(".")[0] +
      "_" +
      Math.random() +
      "." +
      file.name.split(".")[1];
    let storageRef = null;
    switch (type) {
      case "admin":
        storageRef = ref(storage, `/avatars/${name}`);
        await uploadBytes(storageRef, file).then(async (snapshot) => {
          const pathReference = ref(storage, `/avatars/${name}`);
          await getDownloadURL(pathReference).then((url) => {
            data.avatar = url;
          });
        });
        console.log(`Uploaded ${name} successfully`);
        break;
      case "hotel":
        storageRef = ref(storage, `/${idhotel}/${name}`);
        await uploadBytes(storageRef, file).then(async (snapshot) => {
          const pathReference = ref(storage, `/${idhotel}/${name}`);
          await getDownloadURL(pathReference).then((url) => {
            data.image.push(url);
          });
        });
        break;
      default:
        break;
    }
  };

  const handleDeleteImageToFirebase = async (img) => {
    const path = GetImageUrl(img);
    const desertRef = ref(storage, `/${path}`);
    // Delete the file
    await deleteObject(desertRef)
      .then(() => {
        console.log(`${path} deleted successfully`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateTotalAdmin = (data) => {
    const newData = [...totalAdmin?.data.admin];
    const index = newData.findIndex((item) => item._id === data._id);
    newData[index] = data;
    dispatch(
      setTotalAdmin({
        data: {
          admin: newData,
        },
      })
    );
  };

  const handleUpdateAdmin = async () => {
    const url = null;
    if (admin.avatar) GetImageUrl(admin?.avatar);
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].id_input === "name")
        data.name = document.getElementById(inputs[i].id_input).value;
      if (inputs[i].id_input === "phone_number")
        data.phone_number = document.getElementById(inputs[i].id_input).value;
      if (inputs[i].id_input === "country")
        data.country = document.getElementById(inputs[i].id_input).value;
    }
    if (file) {
      await handleAddListImageToFirebase("admin", file);
      if (admin.avatar) await handleDeleteImageToFirebase(admin.avatar);
    } else {
      data.avatar = admin.avatar;
    }

    UpdateInfoAdmin(currentPath.split("/")[2], data).then((res) => {
      if (res.status === 200) {
        updateTotalAdmin(res.data.data.admin);
        dispatch(
          setAnnouncementAuto({
            message: "Update successfully!",
            type: "success",
          })
        );
        if (url) handleDeleteImageToFirebase(url);
        setAdmin({
          ...admin,
          avatar: data.avatar,
        });
        setFile(null);
      } else {
        setAnnouncementAuto({
          message: "Update failed!",
          type: "error",
        });
        if (file) handleDeleteImageToFirebase(data.avatar);
      }
    });
  };

  const handleUpdateListImage = async () => {
    for (let i = 0; i < listImage.length; i++) {
      if (listImage[i].new === true) {
        await handleAddListImageToFirebase(
          "hotel",
          listImage[i].imageFile,
          hotel.id
        );
      } else {
        data.image.push(listImage[i].img);
      }
      setProgress((prev) => prev + 100 / listImage.length);
    }
    for (let i = 0; i < dataDelete.length; i++) {
      await handleDeleteImageToFirebase(dataDelete[i]);
    }
  };

  const data = {};
  const handleUpdateHotel = async () => {
    setStartSave(true);
    for (let i = 0; i < inputs.length; i++) {
      data[inputs[i].id_input] = document.getElementById(
        inputs[i].id_input
      ).value;
    }
    data.image = [];
    data.position = [data.latitude, data.longitude];
    delete data.latitude;
    delete data.longitude;
    await handleUpdateListImage();

    await UpdateHotel(currentPath.split("/")[2], data).then((res) => {
      if (res.status === 200) {
        dispatch(
          updataSingleData({
            data: res.data,
            type: "hotel",
          })
        );
        dispatch(
          setAnnouncementAuto({
            message: "Update successfully!",
            type: "success",
          })
        );
        setDataDelete([]);
      } else {
        setAnnouncementAuto({
          message: "Update failed!",
          type: "error",
        });
        for (let i = 0; i < listImage.length; i++) {
          if (listImage[i].new === true) {
            handleDeleteImageToFirebase(listImage[i].img);
          }
        }
      }
    });
  };

  const handleSave = (type) => {
    switch (type) {
      case "admin":
        handleUpdateAdmin();
        break;
      case "hotel":
        handleUpdateHotel();
        break;
      default:
        break;
    }
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="single">
      <div className="container">
        {currentPath.split("/")[1] === "user" ? (
          <>
            <div className="top">
              <div className="left">
                <h1 className="title">Information</h1>
                <div className="item">
                  {user?.email ? (
                    <img src={avatar} alt="" className="itemImg" />
                  ) : (
                    <Skeleton variant="circular" className="itemImg" />
                  )}
                  <div className="details">
                    {user?.email ? (
                      <h1 className="itemTitle">{user?.name}</h1>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                    {user?.email ? (
                      <div className="detailItem">
                        <span className="itemKey">Email:</span>
                        <span className="itemValue">{user?.email}</span>
                      </div>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                    {user?.email ? (
                      <div className="detailItem">
                        <span className="itemKey">Phone:</span>
                        <span className="itemValue">
                          {user?.phone_number || "null"}
                        </span>
                      </div>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                  </div>
                </div>
                <div className="booking">
                  {user?.email ? (
                    <div className="bookingItem">
                      <span className="itemKey">Total Orders:</span>
                      <span className="itemValue">{user?.orders?.length}</span>
                    </div>
                  ) : (
                    <Skeleton variant="text" className="skeletonText" />
                  )}
                  {user?.email ? (
                    <div className="bookingItem">
                      <span className="itemKey">Total Spending:</span>
                      <span className="itemValue">{totalSpending(user)}</span>
                    </div>
                  ) : (
                    <Skeleton variant="text" className="skeletonText" />
                  )}
                </div>
              </div>
              <div className="right">
                <Chart
                  dataChart={user?.orders}
                  height={200}
                  title={"User Spending (Last 6 Months)"}
                />
              </div>
            </div>
            <div className="bottom">
              <div className="listContainer">
                <div className="listTitle">Last Transactions</div>
                <ListTable dataTable={user?.orders} userName={user?.name} />
              </div>
            </div>
          </>
        ) : currentPath.split("/")[1] === "admin" ? (
          <>
            <div className="bottomAdmin">
              <div className="left">
                <p>
                  <span>Avatar</span>
                </p>
                <div className="container">
                  {inputs.length === 6 && (
                    <label htmlFor="file">
                      {admin?.email ? (
                        <img
                          src={
                            file
                              ? URL.createObjectURL(file)
                              : admin?.avatar
                              ? admin?.avatar
                              : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                          }
                          alt=""
                          className="imgAvatar"
                        />
                      ) : (
                        <Skeleton
                          variant="circular"
                          className="avatarContainer"
                        />
                      )}

                      <input
                        type="file"
                        id="file"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setFile(e.target.files[0]);
                          }
                        }}
                        style={{ display: "none", cursor: "pointer" }}
                      />
                    </label>
                  )}
                  {file && (
                    <ClearOutlinedIcon
                      onClick={() => {
                        setFile(null);
                      }}
                      className="deleteAvatar"
                    />
                  )}
                </div>
              </div>
              <div className="right">
                <p>
                  <span>Informations</span>
                </p>
                <form>
                  {inputs.map((input) => (
                    <div className="formInput" key={input.id}>
                      <label>
                        {input.label === "ID Hotel" ? "Hotel" : input.label}
                      </label>
                      {admin?.email ? (
                        <input
                          type={input.type}
                          id={input.id_input}
                          placeholder={input.placeholder}
                          value={admin[input.id_input] || ""}
                          disabled={input.disabled}
                          onChange={(e) => {
                            setAdmin({
                              ...admin,
                              [input.id_input]: e.target.value,
                            });
                          }}
                        />
                      ) : (
                        <Skeleton variant="text" className="skeletonInput" />
                      )}
                    </div>
                  ))}
                  <div
                    className="Divbutton"
                    onClick={() => {
                      handleSave("admin");
                    }}
                  >
                    Save
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : currentPath.split("/")[1] === "hotel" ? (
          <>
            <div className="bottomHotel">
              <div className="left">
                <p>
                  <span>Images</span>
                </p>
                {startSave && (
                  <div className="progress">
                    <Box sx={{ width: "100%" }}>
                      <LinearProgressWithLabel value={progress} />
                    </Box>
                  </div>
                )}
                <div className="container">
                  {inputs.length === 8 && (
                    <div className="listImageContainer">
                      <div className="content">
                        {listImage?.map((img) => (
                          <div className="item" key={img.id}>
                            <img
                              src={img?.img}
                              alt=""
                              className="imgList"
                              onClick={() => {
                                handleOpenImage(img);
                              }}
                            />
                            <ClearOutlinedIcon
                              onClick={() => {
                                handleDeleteImage(img.id);
                              }}
                              className="divDelete"
                            />
                          </div>
                        ))}
                        <label htmlFor="listImage">
                          <div className="bgAdd">
                            <AddToPhotosIcon className="iconAdd" />
                          </div>
                          <input
                            type="file"
                            id="listImage"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                handleAddListImage(e.target.files);
                                e.target.value = null;
                              }
                            }}
                            style={{ display: "none", cursor: "pointer" }}
                            multiple
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {isShowImage && inputs.length === 8 && (
                <div className="middle">
                  <div
                    className="containerMiddle"
                    onClick={(e) => {
                      if (e.target.classList.contains("containerMiddle")) {
                        setIsShowImage(false);
                      }
                    }}
                  >
                    <CancelIcon
                      className="iconCancel"
                      onClick={() => {
                        setIsShowImage(false);
                      }}
                    />
                    <img
                      src={listImage[imgIndex]?.img}
                      alt=""
                      className="imgMiddle"
                    />
                    <div className="listImgMiddle">
                      {listImage.map((img) => (
                        <img
                          src={img?.img}
                          alt=""
                          className={`imgListMiddle ${
                            img.id === listImage[imgIndex].id
                              ? "active"
                              : "notActive"
                          }`}
                          key={img.id}
                          onClick={() => {
                            setImgIndex(
                              listImage.findIndex((item) => item.id === img.id)
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="right">
                <p>
                  <span>Informations</span>
                </p>
                <form>
                  {inputs.map((input) => (
                    <div className="formInput" key={input.id}>
                      <label>{input.label}</label>
                      {hotel?.id ? (
                        <input
                          type={input.type}
                          id={input.id_input}
                          placeholder={input.placeholder}
                          value={hotel[input.id_input] || ""}
                          disabled={input.disabled}
                          onChange={(e) => {
                            setHotel({
                              ...hotel,
                              [input.id_input]: e.target.value,
                            });
                          }}
                        />
                      ) : (
                        <Skeleton variant="text" className="skeletonInput" />
                      )}
                    </div>
                  ))}
                  <div
                    className="Divbutton"
                    onClick={() => {
                      handleSave("hotel");
                    }}
                  >
                    Save
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
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
                        <span className="itemValue">
                          {booking?.user?.email}
                        </span>
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
          </>
        )}
      </div>
    </div>
  );
};

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default Single;
