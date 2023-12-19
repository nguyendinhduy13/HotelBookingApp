import React, { useEffect, useState } from "react";
import "./addnewroom.scss";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Select from "react-select";
import Switch from "../../../Components/Switch/Switch";
import { AddNewRoomInHotel } from "./apiAddNewRoom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { storage } from "../../../../configFirebase/config";
import LoadingImage from "../../../Components/LoadingImage/LoadingImage";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

const AddNewRoom = ({ title, inputs }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.global);
  const [formData, setFormData] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);
  const [uti, setUti] = useState([]);
  const [value, setValue] = useState(false);
  const [listImage, setListImage] = useState([]);
  const [progress, setProgress] = useState(0);
  const [startSave, setStartSave] = useState(false);
  let options = [
    { value: "Bồn tắm", label: "Bồn tắm" },
    { value: "Bếp riêng", label: "Bếp riêng" },
    { value: "Nhìn ra hồ", label: "Nhìn ra hồ" },
    { value: "Nhìn ra thành phố", label: "Nhìn ra thành phố" },
    { value: "Nhìn ra sông", label: "Nhìn ra sông" },
    { value: "TV màn hình phẳng", label: "TV màn hình phẳng" },
    { value: "Hệ thống cách âm", label: "Hệ thống cách âm" },
    { value: "Wifi miễn phí", label: "Wifi miễn phí" },
    { value: "Ban công", label: "Ban công" },
    { value: "Tầm nhìn ra khung cảnh", label: "Tầm nhìn ra khung cảnh" },
    {
      value: "Phòng tắm riêng trong phòng",
      label: "Phòng tắm riêng trong phòng",
    },
    { value: "Điều hòa không khí", label: "Điều hòa không khí" },
    { value: "Sân hiên", label: "Sân hiên" },
  ];

  const handleChange = (selectedOptions) => {
    let dataUti = selectedOptions.map((item) => item.value);
    setUti(dataUti);
    setSelectedOptions(selectedOptions);
  };

  const handleAddListImage = async(file) => {
    setStartSave(true);
    setProgress(0);
    //listImage have id, img
    const listImageTemp = [...listImage];
    for (let i = 0; i < file.length; i++) {
      const storageRef = ref(storage, `/${userInfo.idHotel}/${file[i].name}`);
     await uploadBytes(storageRef, file[i]).then(async(snapshot) => {
        const pathReference = ref(
          storage,
          `/${userInfo.idHotel}/${file[i].name}`
        );
       await getDownloadURL(pathReference).then((url) => {
          listImageTemp.push(url);
        });
      });
      setProgress(((i+1) / file.length)*100);
    }
    setListImage(listImageTemp);
    // 'file' comes from the Blob or File API
  };

  const handleAddListImageExcel = async(file, index) => {
    setStartSave(true);
    setProgress(0);
    //listImage have id, img
    let listImageTemp = [...listImage];
    for (let i = 0; i < file.length; i++) {
      const storageRef = ref(storage, `/${userInfo.idHotel}/${file[i].name}`);
      await uploadBytes(storageRef, file[i]).then(async(snapshot) => {
        const pathReference = ref(storage, `/${userInfo.idHotel}/${file[i].name}`);
       await getDownloadURL(pathReference).then((url) => {
            listImageTemp[index].img.push(url);
        });
        setProgress(((i+1) / file.length)*100);
      })
    }
    setListImage(listImageTemp);
    // 'file' comes from the Blob or File API
  };

  useEffect(() => {
    setFormData({ ...formData, hotel_id: userInfo.idHotel });
  }, []);

  const handleChangeInput = (e) => {
    const { id, value } = e.target;
    if (id === "price") {
      let price = parseInt(value);
      setFormData({ ...formData, [id]: price });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleImportExcel = () => {
    setListImage([]);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx, .xls";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workBook = XLSX.read(data, { type: "array" });
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        const dataExcel = XLSX.utils.sheet_to_json(workSheet);
        //add field image
        let listImageTemp = [...listImage];
        setDataExcel(dataExcel);
        dataExcel.forEach((item,index) => {
          let urlExcel = {
            id: index,
            img: [],
          };
          listImageTemp.push(urlExcel);
          let selected = item.utility.split(", ");
          let seleted = selected.map((item) => ({ value: item, label: item }));
          item.utility = seleted;
        });
        setListImage(listImageTemp);
      };
    };
    input.click();
  };

  const handleSaveDataExcel = () => {
    const dataExcelTemp = [...dataExcel];
    const listImageTemp = [...listImage];
    dataExcelTemp.forEach(async(item,index) => {
      const data = {
        ...item,
        hotel_id: userInfo.idHotel,
        image: listImageTemp[index].img,
        utility:item.utility.map((item) => item.value),
        tag: [],
      };
      const res = await AddNewRoomInHotel(data);
      if(res.status===200&&index===dataExcelTemp.length-1){
        navigate("/listroom"); 
      }
    });
  };

  const handleDeleteImage = (img) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp.findIndex((item) => item === img);
    const match = img.match(/\/o\/(.+?)\?/);
    let imagePath = "";
    if (match) {
      imagePath = decodeURIComponent(match[1]);
    }
    const desertRef = ref(storage, `/${imagePath}`);
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
    listImageTemp.splice(index, 1);
    setListImage(listImageTemp);
  };

  const handleDeleteImageExcel =async (img,indexDelete) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp[indexDelete].img.findIndex((item) => item === img);
    const match = img.match(/\/o\/(.+?)\?/);
    let imagePath = "";
    if (match) {
      imagePath = decodeURIComponent(match[1]);
    }
    const desertRef = ref(storage, `/${imagePath}`);
    // Delete the file
   await deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
    listImageTemp[indexDelete].img.splice(index, 1);
    setListImage(listImageTemp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      image: listImage,
      isactive: value,
      utility: uti,
      tag: [],
    };
    const res = await AddNewRoomInHotel(data);
    if (res.status === 200) {
      navigate("/listroom");
    }
  };

  return (
    <div className="new">
      <div className="container">
        <div className="top">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 20px",
            }}
          >
            <h1>{title}</h1>
            <button className="buttonImport" onClick={handleImportExcel}>
              Import Excel
            </button>
          </div>
          {dataExcel.length > 0 ? (
            <div>
              {dataExcel.map((item, index) => (
                <div className="bottom">
                  <div className="left">
                    <div className="listImageContainer">
                      {startSave&&<LoadingImage progress={progress}/>}
                      <div className="content">
                        {listImage[index]&&
                        listImage[index].img.map((img) => (
                          <div className="item">
                            <img src={img} alt="" className="imgList" />
                            <ClearOutlinedIcon
                              onClick={() => {
                                handleDeleteImageExcel(img,index);
                              }}
                              className="divDelete"
                            />
                          </div>
                        ))}
                        <label htmlFor={`listImage${index}`}>
                          <AddPhotoAlternateIcon className="iconAdd" />
                          <input
                            type="file"
                            id={`listImage${index}`}
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                handleAddListImageExcel(e.target.files,index);
                              }
                            }}
                            style={{ display: "none", cursor: "pointer" }}
                            multiple
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <form onSubmit={handleSubmit}>
                      {inputs.map((input) => (
                        <div className="formInput" key={input.id}>
                          <label>{input.label}</label>
                          <input
                            type="text"
                            id={input.id_input}
                            value={
                              input.id_input !== "hotel_id"
                                ? item[input.id_input] || ""
                                : userInfo.idHotel
                            }
                            placeholder={input.placeholder}
                            onChange={(e) => {
                              const newItem = { ...item };
                              newItem[input.id_input] = e.target.value;
                              const newData = [...dataExcel];
                              newData[index] = newItem;
                              setDataExcel(newData);
                            }}
                          />
                        </div>
                      ))}
                      <Select
                        className="selectStyle"
                        options={options}
                        isMulti
                        value={item.utility}
                        onChange={(e) => {
                          const newItem = { ...item };
                          newItem.utility = e;
                          const newData = [...dataExcel];
                          newData[index] = newItem;
                          setDataExcel(newData);
                        }}
                      />
                      <div className="switchStyle">
                        <span className="spanStyle">Active</span>
                        <Switch
                          isOn={item.isactive}
                          handleToggle={() => {
                            const newItem = { ...item };
                            newItem.isactive = !newItem.isactive;
                            const newData = [...dataExcel];
                            newData[index] = newItem;
                            setDataExcel(newData);
                          }}
                          index={index}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              ))}
              <button className="buttonExcel" onClick={handleSaveDataExcel}>Save</button>
            </div>
          ) : (
            <div className="bottom">
              <div className="left">
                <div className="listImageContainer">
                {startSave&&<LoadingImage progress={progress}/>}
                  <div className="content">
                    {listImage.map((img) => (
                      <div className="item">
                        <img src={img} alt="" className="imgList" />
                        <ClearOutlinedIcon
                          onClick={() => {
                            handleDeleteImage(img);
                          }}
                          className="divDelete"
                        />
                      </div>
                    ))}
                    <label htmlFor="listImage">
                      <AddPhotoAlternateIcon className="iconAdd" />
                      <input
                        type="file"
                        id="listImage"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleAddListImage(e.target.files);
                          }
                        }}
                        style={{ display: "none", cursor: "pointer" }}
                        multiple
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="right">
                <form onSubmit={handleSubmit}>
                  {inputs.map((input) => (
                    <div className="formInput" key={input.id}>
                      <label>{input.label}</label>
                      <input
                        type={input.type}
                        id={input.id_input}
                        value={
                          input.id_input !== "hotel_id"
                            ? formData[input.id_input] || ""
                            : userInfo.idHotel
                        }
                        placeholder={input.placeholder}
                        onChange={handleChangeInput}
                      />
                    </div>
                  ))}
                  <Select
                    className="selectStyle"
                    options={options}
                    isMulti
                    value={selectedOptions}
                    onChange={handleChange}
                  />
                  <div className="switchStyle">
                    <span className="spanStyle">Active</span>
                    <Switch
                      isOn={value}
                      handleToggle={() => setValue(!value)}
                    />
                  </div>
                  <button className="buttonSave">Save</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewRoom;
