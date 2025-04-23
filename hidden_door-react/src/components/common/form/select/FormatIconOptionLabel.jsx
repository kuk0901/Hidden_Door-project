import React from "react";

const FormatIconOptionLabel = (option) => (
  <div
    className="icon-option-label"
    style={{ display: "flex", alignItems: "center" }}
  >
    {React.createElement(option.icon, {
      size: 20,
      color: "#000"
    })}
    {option.label}
  </div>
);

export default FormatIconOptionLabel;
