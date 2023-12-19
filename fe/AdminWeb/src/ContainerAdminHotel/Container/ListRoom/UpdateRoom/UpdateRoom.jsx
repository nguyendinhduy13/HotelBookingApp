import React, { useEffect, useState } from "react";
import "./updateroom.scss";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Select from "react-select";
import Switch from "../../../Components/Switch/Switch";
import { AddNewRoomInHotel, UpdateRoomInHotel } from "./apiUpdateRoom";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../configFirebase/config";
import LoadingImage from "../../../Components/LoadingImage/LoadingImage";

const UpdateRoom = ({ title }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState([]);
  const [file, setFile] = useState(null);
  const { userInfo } = useSelector((state) => state.global);
  const [formData, setFormData] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
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

  useEffect(() => {
    const inputs = [
      {
        id: 1,
        label: "Name",
        type: "text",
        id_input: "name",
        value: state.name,
        placeholder: "Room Name",
      },
      {
        id: 2,
        label: "Description",
        type: "text",
        id_input: "description",
        value: state.description,
        placeholder: "Description for the room",
      },
      {
        id: 3,
        label: "Price",
        type: "text",
        value: state.price,
        id_input: "price",
        placeholder: "Price",
      },
      {
        id: 4,
        label: "ID Hotel",
        value: state.hotel_id,
        type: "text",
        id_input: "hotel_id",
        placeholder: "ID",
      },
    ];

    const formdata = {
      name: state.name,
      description: state.description,
      price: state.price,
      hotel_id: state.hotel_id,
    };
    setFormData(formdata);
    setInputs(inputs);
    setListImage(state.image);
    setValue(state.isactive);
    setUti(state.utility);
    let seleted = state.utility.map((item) => ({ value: item, label: item }));
    setSelectedOptions(seleted);
  }, []);

  const handleChange = (selectedOptions) => {
    let dataUti = selectedOptions.map((item) => item.value);
    setUti(dataUti);
    setSelectedOptions(selectedOptions);
  };

  const handleAddListImage = async(file) => {
    setStartSave(true);
    //listImage have id, img
    const listImageTemp = [...listImage];
    for (let i = 0; i < file.length; i++) {
      const storageRef = ref(storage, `/${state.hotel_id}/${file[i].name}`);
     await uploadBytes(storageRef, file[i]).then(async(snapshot) => {
        const pathReference = ref(storage, `/${state.hotel_id}/${file[i].name}`);
       await getDownloadURL(pathReference).then((url) => {
          listImageTemp.push(url);
        });
      });
      setProgress(((i+1) / file.length)*100);
    }
    setListImage(listImageTemp);
    // 'file' comes from the Blob or File API
 
  };

  const handleChangeInput = (e) => {
    const { id, value } = e.target;
    if (id === "price") {
      let price = parseInt(value);
      setFormData({ ...formData, [id]: price });
    } else {
      setFormData({ ...formData, [id]: value });
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { 
      ...formData,
      image: listImage,
      isactive: value,
      utility: uti,
      tag: [],
    };
    const res = await UpdateRoomInHotel(state.id, data);
    if (res.status === 200) {
      navigate("/listroom");
    }
  };

  return (
    <div className="new">
      <div className="container">
        <div className="top">
          <h1>{title}</h1>
        </div>
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
                    value={formData[input.id_input] || ""}
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
                <Switch isOn={value} handleToggle={() => setValue(!value)} />
              </div>
              <button className="buttonSave">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoom;
