import React from "react";
import * as FaIcons from "react-icons/fa";

// 새로 추가된 IconSelector 컴포넌트
const IconSelector = ({ selectedIcon, onIconChange }) => {
  const iconList = Object.entries(FaIcons).map(([name]) => (
    <option key={name} value={name}>
      {name}
    </option>
  ));

  return (
    <div className="icon-update">
      <div className="select-container">
        <label className="label" htmlFor="icon-select">
          아이콘 선택:{" "}
        </label>
        <select
          id="icon-select"
          name="icon"
          onChange={(e) => onIconChange(e.target.value)}
          value={selectedIcon || ""}
          className="select"
        >
          <option value="" className="option">
            아이콘 선택
          </option>
          {iconList}
        </select>

        {selectedIcon && (
          <div className="preview">
            <span className="preview--label">미리보기: </span>
            {React.createElement(FaIcons[selectedIcon], {
              size: 30,
              className: "preview--icon"
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default IconSelector;
