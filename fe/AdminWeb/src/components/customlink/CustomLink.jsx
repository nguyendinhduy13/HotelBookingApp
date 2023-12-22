import React from "react";
import { Link } from "react-router-dom";
import "./customlink.scss";

const CustomLink = ({ to, children }) => {
  return (
    <div>
      <Link
        to={to}
        className="customlink"
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        {children}
      </Link>
    </div>
  );
};

export default CustomLink;
