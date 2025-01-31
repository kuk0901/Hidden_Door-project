import { useState } from "react";
import { toast } from "react-toastify";
import Api from "@axios/api";

const PresentImageUploader = ({ escapeRoom, setEscapeRoom, onClose }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreviewImage(fileURL);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await Api.patch(
        `/api/v1/escape-rooms/info/update-image/${escapeRoom.roomId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      setEscapeRoom(res.data.data);
      toast.success(res.data.msg);
      onClose();
    } catch (error) {
      toast.error(error.message || "이미지 업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="img-update--section">
      <div className="presentImg-container">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        {previewImage && (
          <div className="preview-container text-center">
            <img
              src={previewImage}
              alt="미리보기"
              style={{ maxWidth: "400px", maxHeight: "450px" }}
            />
          </div>
        )}
      </div>

      <div className="btn-container">
        <button onClick={handleSubmit} className="btn">
          이미지 업데이트
        </button>
        <button className="btn" onClick={onClose}>
          취소
        </button>
      </div>
    </div>
  );
};

export default PresentImageUploader;
