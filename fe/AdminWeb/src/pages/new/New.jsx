import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./new.scss";

import { CreateHotel } from "../../middlewares/hotel";
import { CreateAdmin } from "../../middlewares/admin";
import { setAnnouncementAuto, updateData } from "../../redux/Slices/Global";
import { GetImageUrl } from "../../functions/Global";
import { storage } from "../../configFirebase/config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import CancelIcon from "@mui/icons-material/Cancel";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const New = ({ title, inputs }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [dataFromExcel, setDataFromExcel] = useState(null);
  const [listImage, setListImage] = useState([]);
  const [isShowImage, setIsShowImage] = useState(false);
  const [imgIndex, setImgIndex] = useState(null);
  const [indexItemExcel, setIndexItemExcel] = useState(null);
  const [isSet, setIsSet] = useState(true);
  const [ExcelInfo, setExcelInfo] = useState(null);
  const [statusAdd, setStatusAdd] = useState(null);
  const [progress, setProgress] = useState({
    id: 0,
    value: 0,
  });
  const [startSave, setStartSave] = useState(false);

  const data = {};

  const handleAddListImage = (file) => {
    //listImage have id, img
    const listImageTemp = [...listImage];
    for (let i = 0; i < file?.length; i++) {
      listImageTemp.push({
        id: Math.random(),
        img: URL.createObjectURL(file[i]),
        fileImage: file[i],
      });
    }
    setListImage(listImageTemp);
  };

  const handleAddAvatarFromExcel = (file) => {
    const listImageTemp = [...dataFromExcel[indexItemExcel].image];
    listImageTemp[0] = {
      id: Math.random(),
      img: URL.createObjectURL(file[0]),
      fileImage: file[0],
    };
    const dataExcelTemp = [...dataFromExcel];
    dataExcelTemp[indexItemExcel].image = listImageTemp;
    setDataFromExcel(dataExcelTemp);
  };

  const handleAddListImageFromExcel = (file) => {
    const listImageTemp = [...dataFromExcel[indexItemExcel].image];
    for (let i = 0; i < file?.length; i++) {
      listImageTemp.push({
        id: Math.random(),
        img: URL.createObjectURL(file[i]),
        fileImage: file[i],
      });
    }
    const dataExcelTemp = [...dataFromExcel];
    dataExcelTemp[indexItemExcel].image = listImageTemp;
    setDataFromExcel(dataExcelTemp);
  };

  const handleDeleteImage = (id) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp.findIndex((item) => item.id === id);
    listImageTemp.splice(index, 1);
    setListImage(listImageTemp);
  };

  const handleDeleteImageFromExcel = (id, i) => {
    const listImageTemp = [...dataFromExcel[i].image];
    const index = listImageTemp.findIndex((item) => item.id === id);
    listImageTemp.splice(index, 1);
    const dataExcelTemp = [...dataFromExcel];
    dataExcelTemp[i].image = listImageTemp;
    setDataFromExcel(dataExcelTemp);
  };

  const handleOpenImage = (img) => {
    setIsShowImage(true);
    const index = listImage.findIndex((item) => item.id === img.id);
    setImgIndex(index);
  };

  const handleOpenImageFromExcel = (img, i) => {
    setIsShowImage(true);
    const index = dataFromExcel[i].image.findIndex(
      (item) => item.id === img.id
    );
    setImgIndex({
      index: index,
      indexExcel: i,
    });
  };

  const handleImportExcel = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      setExcelInfo(file);
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workBook = XLSX.read(data, { type: "array" });
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        const dataExcel = XLSX.utils.sheet_to_json(workSheet);

        if (!dataExcel[0].hasOwnProperty("image")) {
          dataExcel.forEach((item) => {
            item.image = [];
            item.status = "";
          });
        }
        setDataFromExcel(dataExcel);
        setStartSave(false);
        console.log(dataExcel);
      };
    };
    input.click();
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

  const DeleteArrayImageFromFirebase = async (data) => {
    for (let k = 0; k < data.length; ) {
      await handleDeleteImageToFirebase(data[k]);
      k++;
    }
  };

  const handleSaveAdmin = async (dataAgain) => {
    if (dataAgain) {
      if (dataAgain.image[0]) {
        await handleAddListImageToFirebase(
          "admin",
          dataAgain.image[0].fileImage
        );
      }
      data.idHotel = dataAgain.idhotel;
      data.name = dataAgain.name;
      data.email = dataAgain.email;
      data.phone_number = dataAgain.phone_number;
      data.password = String(dataAgain.password);
      data.country = dataAgain.country;
    } else {
      for (let i = 0; i < inputs?.length; i++) {
        if (inputs[i].id_input === "idhotel") {
          data["idHotel"] = document.getElementById(inputs[i].id_input).value;
        } else {
          data[inputs[i].id_input] = document.getElementById(
            inputs[i].id_input
          ).value;
        }
      }
      if (file) await handleAddListImageToFirebase("admin", file);
    }
    await CreateAdmin(data).then((res) => {
      if (res.status === 200) {
        dispatch(
          setAnnouncementAuto({
            message: "Create admin success!",
            type: "success",
          })
        );
        dispatch(
          updateData({
            type: "admin",
            data: res.data,
          })
        );
        setStatusAdd("success");
      } else {
        if (file) handleDeleteImageToFirebase(data.avatar);
        dispatch(
          setAnnouncementAuto({
            message: "Create admin fail!",
            type: "error",
          })
        );
        setStatusAdd("error");
      }
    });
  };

  const handleSaveAdminExcel = async () => {
    for (let i = 0; i < dataFromExcel.length; ) {
      if (dataFromExcel[i].image[0]) {
        await handleAddListImageToFirebase(
          "admin",
          dataFromExcel[i].image[0].fileImage
        );
      }
      data.idHotel = dataFromExcel[i].idhotel;
      data.name = dataFromExcel[i].name;
      data.email = dataFromExcel[i].email;
      data.phone_number = dataFromExcel[i].phone_number;
      data.password = String(dataFromExcel[i].password);
      data.country = dataFromExcel[i].country;
      await CreateAdmin(data).then((res) => {
        if (res.status === 200) {
          dispatch(
            setAnnouncementAuto({
              message: `Created admin ${dataFromExcel[i].name} success!`,
              type: "success",
            })
          );
          dispatch(
            updateData({
              type: "admin",
              data: res.data,
            })
          );
          const dataExcelTemp = [...dataFromExcel];
          dataExcelTemp[i].status = "success";
          setDataFromExcel(dataExcelTemp);
          i++;
        } else {
          if (dataFromExcel[i].image[0]) {
            handleDeleteImageToFirebase(data.avatar);
          }
          dispatch(
            setAnnouncementAuto({
              message: `Created admin ${dataFromExcel[i].name} fail!`,
              type: "error",
            })
          );
          const dataExcelTemp = [...dataFromExcel];
          dataExcelTemp[i].status = "error";
          setDataFromExcel(dataExcelTemp);
          i++;
        }
      });
    }
  };

  const handleSaveHotel = async () => {
    setStartSave(true);
    for (let i = 0; i < inputs?.length; i++) {
      data[inputs[i].id_input] = document.getElementById(
        inputs[i].id_input
      ).value;
    }
    data.image = [];
    for (let i = 0; i < listImage.length; ) {
      await handleAddListImageToFirebase(
        "hotel",
        listImage[i].fileImage,
        data.id
      );
      setProgress({
        value: ((i + 1) / listImage.length) * 100,
      });
      i++;
    }
    data.position = [data.latitude, data.longitude];
    CreateHotel(data).then((res) => {
      if (res.status === 200 && res.data.status !== 400) {
        dispatch(
          updateData({
            type: "hotel",
            data: res.data,
          })
        );
        dispatch(
          setAnnouncementAuto({
            message: "Create hotel success!",
            type: "success",
          })
        );
      } else if (res.data.status === 400) {
        dispatch(
          setAnnouncementAuto({
            message: res.data.message,
            type: "error",
          })
        );
        DeleteArrayImageFromFirebase(data.image);
      } else {
        dispatch(
          setAnnouncementAuto({
            message: "Create hotel fail!",
            type: "error",
          })
        );
        DeleteArrayImageFromFirebase(data.image);
      }
    });
  };

  const handleSaveHotelExcel = async () => {
    setStartSave(true);
    let isFail = false;
    for (let i = 0; i < dataFromExcel.length; ) {
      data.image = [];
      data.id = dataFromExcel[i].id;
      data.name = dataFromExcel[i].name;
      data.advantage = dataFromExcel[i].advantage;
      data.description = dataFromExcel[i].description;
      data.address = dataFromExcel[i].address;
      data.tag = dataFromExcel[i].tag;
      data.position = [dataFromExcel[i].latitude, dataFromExcel[i].longitude];
      setProgress({
        id: dataFromExcel[i].id,
        value: 0,
      });
      for (let j = 0; j < dataFromExcel[i].image.length; ) {
        await handleAddListImageToFirebase(
          "hotel",
          dataFromExcel[i].image[j].fileImage,
          dataFromExcel[i].id
        );
        setProgress({
          id: dataFromExcel[i].id,
          value: ((j + 1) / dataFromExcel[i].image.length) * 100,
        });
        j++;
      }
      await CreateHotel(data).then(async (res) => {
        if (res.status === 200 && res.data.status !== 400) {
          const dataExcelTemp = [...dataFromExcel];
          dataExcelTemp[i].status = "success";
          setDataFromExcel(dataExcelTemp);
          dispatch(
            updateData({
              type: "hotel",
              data: res.data,
            })
          );
        } else {
          isFail = true;
          await DeleteArrayImageFromFirebase(data.image);
          const dataExcelTemp = [...dataFromExcel];
          dataExcelTemp[i].status = "error";
          setDataFromExcel(dataExcelTemp);
        }
        i++;
      });
    }
    dispatch(
      setAnnouncementAuto({
        message: `Create hotel done!`,
        type: isFail ? "error" : "success",
      })
    );
  };

  const handleSave = (type, dataAgain) => {
    switch (type) {
      case "admin":
        handleSaveAdmin(dataAgain);
        break;
      case "adminExcel":
        handleSaveAdminExcel();
        break;
      case "hotel":
        handleSaveHotel();
        break;
      case "hotelExcel":
        handleSaveHotelExcel();
        break;
      default:
        break;
    }
  };

  return (
    <div className="new">
      <div className="container">
        <div className="top title">
          <h1>{title}</h1>
          <p
            className="uploadExcel"
            onClick={() => {
              handleImportExcel();
            }}
          >
            Import from excel
          </p>
        </div>
        {dataFromExcel ? (
          <>
            <div className="middleExcel">
              <div className="infoExcel">
                <div className="content">
                  Name:
                  <p>{ExcelInfo.name}</p>
                </div>
                <div className="tool">
                  <p
                    className="uploadExcel clear"
                    onClick={() => {
                      setDataFromExcel(null);
                    }}
                  >
                    Close
                  </p>
                  <p
                    className="uploadExcel"
                    onClick={() => {
                      handleSave(
                        inputs?.length === 6 ? "adminExcel" : "hotelExcel"
                      );
                    }}
                  >
                    Save all
                  </p>
                </div>
              </div>
            </div>

            <div className="bottomExcel">
              {dataFromExcel.map((item, index) => (
                <div className="bottom" key={index}>
                  <div className={`status ${item.status}`} />
                  <div className="left">
                    <p>
                      <span>{inputs?.length === 6 ? "Avatar" : "Images"}</span>
                    </p>
                    {progress.id === item.id && startSave && (
                      <div className="progress">
                        <Box sx={{ width: "100%" }}>
                          <LinearProgressWithLabel value={progress.value} />
                        </Box>
                      </div>
                    )}
                    <div className="container">
                      {inputs?.length === 6 && (
                        <div
                          className="avatarContainer"
                          onClick={() => {
                            if (isSet) {
                              setIndexItemExcel(index);
                              setIsSet(!isSet);
                            }
                          }}
                        >
                          <label htmlFor="fileAvatar">
                            <img
                              src={
                                dataFromExcel[index]?.image?.length > 0
                                  ? dataFromExcel[index]?.image[0]?.img
                                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                              }
                              alt=""
                              className="imgAvatar"
                            />
                            <input
                              type="file"
                              id="fileAvatar"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  handleAddAvatarFromExcel(e.target.files);
                                  setIsSet(!isSet);
                                  e.target.value = null;
                                }
                              }}
                              style={{ display: "none", cursor: "pointer" }}
                            />
                          </label>
                        </div>
                      )}
                      {dataFromExcel[index]?.image?.length > 0 &&
                        inputs.length === 6 && (
                          <ClearOutlinedIcon
                            onClick={() => {
                              handleDeleteImageFromExcel(
                                dataFromExcel[index]?.image[0]?.id,
                                index
                              );
                            }}
                            className="deleteAvatar"
                          />
                        )}
                      {inputs?.length === 8 && (
                        <div className="listImageContainer">
                          <div className="content">
                            {dataFromExcel[index]?.image.map((img) => (
                              <div
                                className="item"
                                key={img.id}
                                onClick={() => {
                                  setIndexItemExcel(index);
                                }}
                              >
                                <img
                                  src={img.img}
                                  alt=""
                                  className="imgList"
                                  onClick={() => {
                                    handleOpenImageFromExcel(img, index);
                                  }}
                                />
                                <ClearOutlinedIcon
                                  onClick={() => {
                                    handleDeleteImageFromExcel(img.id, index);
                                  }}
                                  className="divDelete"
                                />
                              </div>
                            ))}
                            <label htmlFor="listImage">
                              <div
                                className="bgAdd"
                                onClick={() => {
                                  setIndexItemExcel(index);
                                }}
                              >
                                <AddToPhotosIcon className="iconAdd" />
                              </div>
                              <input
                                type="file"
                                id="listImage"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handleAddListImageFromExcel(e.target.files);
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
                  {isShowImage && inputs?.length === 8 && (
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
                          src={
                            dataFromExcel[imgIndex.indexExcel].image[
                              imgIndex.index
                            ].img
                          }
                          alt=""
                          className="imgMiddle"
                        />
                        <div className="listImgMiddle">
                          {dataFromExcel[imgIndex.indexExcel].image.map(
                            (img) => (
                              <img
                                src={img.img}
                                alt=""
                                className={`imgListMiddle ${
                                  img.id ===
                                  dataFromExcel[imgIndex.indexExcel].image[
                                    imgIndex.index
                                  ].id
                                    ? "active"
                                    : "notActive"
                                }`}
                                key={img.id}
                                onClick={() => {
                                  setImgIndex({
                                    indexExcel: imgIndex.indexExcel,
                                    index: dataFromExcel[
                                      imgIndex.indexExcel
                                    ].image.findIndex(
                                      (item) => item.id === img.id
                                    ),
                                  });
                                }}
                              />
                            )
                          )}
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
                          <input
                            type={input.type}
                            id={input.id}
                            placeholder={input.placeholder}
                            value={item[input.id_input]}
                            onChange={(e) => {
                              const newItem = { ...item };
                              newItem[input.id_input] = e.target.value;
                              const newData = [...dataFromExcel];
                              newData[index] = newItem;
                              setDataFromExcel(newData);
                            }}
                          />
                        </div>
                      ))}
                      {item.status === "error" && (
                        <div
                          className="Divbutton"
                          onClick={() => {
                            handleSave(
                              inputs?.length === 6 ? "admin" : "hotel",
                              dataFromExcel[index]
                            );
                          }}
                        >
                          Save again
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="bottom">
              <div className={`status ${statusAdd}`} />
              <div className="left">
                <p>
                  <span>{inputs?.length === 6 ? "Avatar" : "Images"}</span>
                </p>
                <div className="container">
                  {inputs?.length === 6 && (
                    <label htmlFor="file">
                      <img
                        src={
                          file
                            ? URL.createObjectURL(file)
                            : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                        }
                        alt=""
                        className="imgAvatar"
                      />
                      <input
                        type="file"
                        id="file"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setFile(e.target.files[0]);
                            e.target.value = null;
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
                  {inputs?.length === 8 && (
                    <div className="listImageContainer">
                      {startSave && (
                        <div className="progress">
                          <Box sx={{ width: "100%" }}>
                            <LinearProgressWithLabel value={progress.value} />
                          </Box>
                        </div>
                      )}
                      <div className="content">
                        {listImage.map((img) => (
                          <div className="item" key={img.id}>
                            <img
                              src={img.img}
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
              {isShowImage && inputs?.length === 8 && (
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
                      src={listImage[imgIndex].img}
                      alt=""
                      className="imgMiddle"
                    />
                    <div className="listImgMiddle">
                      {listImage.map((img) => (
                        <img
                          src={img.img}
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

                      <input
                        type={input.type}
                        id={input.id_input}
                        placeholder={input.placeholder}
                        onChange={(e) => {
                          setStatusAdd(null);
                        }}
                      />
                    </div>
                  ))}
                  <div
                    className="Divbutton"
                    onClick={() => {
                      handleSave(inputs?.length === 6 ? "admin" : "hotel");
                    }}
                  >
                    Save
                  </div>
                </form>
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

export default New;
