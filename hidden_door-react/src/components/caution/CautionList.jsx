import React, { useState } from "react";
import CautionItem from "./CautionItem";
import * as FaIcons from "react-icons/fa";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import InfoEditForm from "@components/common/form/InfoEditForm";

const CautionList = ({ data, setSectionData }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { admin } = useAdmin();

  const iconList = Object.entries(FaIcons).map(([name]) => (
    <option key={name} value={name}>
      {name}
    </option>
  ));

  const handleIconChange = (e) => {
    const iconName = e.target.value;
    setSelectedIcon(() => FaIcons[iconName]);
  };

  const handleEditStart = (caution) => {
    setEditingItem(caution);
    setSelectedIcon(() => FaIcons[caution.icon]);
    setTitle(caution.title);
    setContent(caution.content);
  };

  const handleEditCancel = () => {
    setEditingItem(null);
    setSelectedIcon(null);
  };

  const handleUpdateCaution = async () => {
    if (!editingItem) return;

    try {
      const updatedCaution = {
        ...editingItem,
        title,
        content,
        icon: selectedIcon
          ? Object.keys(FaIcons).find((key) => FaIcons[key] === selectedIcon)
          : editingItem.icon
      };

      const res = await Api.put(
        `/api/v1/cautions/caution/${editingItem.cautionId}`,
        updatedCaution
      );

      setSectionData(res.data.data);
      handleEditCancel();

      toast.success("해당 주의사항이 수정되었습니다.");
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <>
      <ul className="caution--list">
        {data.map((caution) => (
          <CautionItem
            admin={admin}
            key={caution.cautionId}
            item={caution}
            handleVisible={() => handleEditStart(caution)}
            setSectionData={setSectionData}
          />
        ))}
      </ul>

      {admin && editingItem && (
        <div className="caution--edit">
          <div className="icon-update">
            <div className="current">
              <span className="current--label">현재 icon: </span>
              {FaIcons[editingItem.icon] &&
                React.createElement(FaIcons[editingItem.icon], {
                  size: 30,
                  id: "current-icon",
                  className: "current-icon"
                })}
            </div>
            <div className="select-container">
              <label className="label" htmlFor="icon-select">
                변경 icon:{" "}
              </label>
              <select
                id="icon-select"
                name="icon"
                onChange={handleIconChange}
                value={
                  selectedIcon
                    ? Object.keys(FaIcons).find(
                        (key) => FaIcons[key] === selectedIcon
                      )
                    : editingItem.icon
                }
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
                  {React.createElement(selectedIcon, {
                    size: 30,
                    className: "preview--icon"
                  })}
                </div>
              )}
            </div>
          </div>

          <InfoEditForm
            labelVal="주의사항 제목"
            currentTitle={title}
            onUpdate={handleUpdateCaution}
            onCancel={handleEditCancel}
            onChange={(e) => setTitle(e.target.value)}
            area={false}
            autoFocus={true}
          />
          <InfoEditForm
            labelVal="주의사항 내용"
            currentTitle={content}
            onUpdate={handleUpdateCaution}
            onCancel={handleEditCancel}
            onChange={(e) => setContent(e.target.value)}
            area={true}
            viewButton={true}
          />
        </div>
      )}
    </>
  );
};

export default CautionList;
