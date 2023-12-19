import React, { useEffect, useState } from "react";
import "./updatevehicle.scss";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../configFirebase/config";
import { UpdateVehicleInHotel } from "./apiUpdateVehicle";
import LoadingImage from "../../../Components/LoadingImage/LoadingImage";

const UpdateVehicle = ({ title }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState([]);
  const [formData, setFormData] = useState({});
  const [listImage, setListImage] = useState([]);
  const [progress, setProgress] = useState(0);
  const [startSave, setStartSave] = useState(false);

  useEffect(() => {
    const inputs = [
      {
        id: 1,
        label: "Name",
        type: "text",
        value: state.name,
        id_input: "name",
        placeholder: "Vehicle Name",
      },
      {
        id: 2,
        label: "Brand",
        type: "text",
        value: state.brand,
        id_input:"brand",
        placeholder: "Brand",
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
        type: "text",
        value: state.hotel_id,
        id_input: "hotel_id",
        placeholder: "ID",
      },
      {
        id: 5,
        label: "Description",
        type: "text",
        value: state.description,
        id_input: "description",
        placeholder: "Description",
      }
    ];

    let specification={
      max_Power:state.specification[0],
      Fuel:state.specification[1],
      speed_4s:state.specification[2],
      max_Speed:state.specification[3]
    }

    const formdata = {
      name: state.name,
      brand: state.brand,
      specification: specification,
      description: state.description,
      price: state.price,
      hotel_id: state.hotel_id,
    };
    setFormData(formdata);
    setInputs(inputs);
    setListImage(state.image);
  }, []);


  const handleAddListImage = async(file) => {
    //listImage have id, img
    startSave(true)
    const listImageTemp = [...listImage];
    for (let i = 0; i < file.length; i++) {
      const storageRef = ref(storage, `/${state.hotel_id}/${file[i].name}`);
    await  uploadBytes(storageRef, file[i]).then(async(snapshot) => {
        const pathReference = ref(storage, `/${state.hotel_id}/${file[i].name}`);
      await  getDownloadURL(pathReference).then((url) => {
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
      if(id==="max_power"||id==="Fuel"||id==="speed_4s"||id==="speed_max"){
        setFormData({ ...formData, "specification":{...formData.specification,[id]:value} });
        return;
      }
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleDeleteImage = async (img) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp.findIndex((item) => item === img);
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
      listImageTemp.splice(index, 1);
      setListImage(listImageTemp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      image: listImage,
    };
    const res = await UpdateVehicleInHotel(state.id, data);
    if(res.status===200){
      navigate("/listvehicle");
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
              <div className="formInput">
                    <label>Specification</label>
                    <input
                    type={"text"}
                    id={"max_Power"}
                    value={formData["specification"]&&formData["specification"]["max_Power"] || ""}
                    placeholder={"Max Power"}
                    onChange={handleChangeInput}
                    />
                    <input
                    type={"text"}
                    id={"Fuel"}
                    value={formData["specification"]&&formData["specification"]["Fuel"] || ""}
                    placeholder={"Fuel"}
                    onChange={handleChangeInput}
                    />
                    <input
                    type={"text"}
                    id={"speed_4s"}
                    value={formData["specification"]&&formData["specification"]["speed_4s"] || ""}
                    placeholder={"Speed 4s"}
                    onChange={handleChangeInput}
                    />
                    <input
                    type={"text"}
                    id={"max_Speed"}
                    value={formData["specification"]&&formData["specification"]["max_Speed"] || ""}
                    placeholder={"Max Speed"}
                    onChange={handleChangeInput}
                    />
                  </div>
              <button className="buttonSave">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateVehicle;
