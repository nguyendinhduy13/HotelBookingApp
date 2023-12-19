import React from "react";
import "./switch.scss";

const Switch = ({ isOn, handleToggle,index}) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={()=>{
          handleToggle()
        }}
        className="react-switch-checkbox"
        id={`react-switch-new-${index}`}
        type="checkbox"
      />
      <label
        style={{ background: isOn && "#06D6A0" }}
        className="react-switch-label"
        htmlFor={`react-switch-new-${index}`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};
export default Switch;
