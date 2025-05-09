import { useState } from "react";
import { toast } from "react-toastify";
import Api from "@axios/api";
import useConfirm from "@hooks/useConfirm";

const PresentImageUploader = ({ escapeRoom, setEscapeRoom, onClose }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);
  const confirm = useConfirm();

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

    const isConfirmed = await confirm(
      `사이트의 대표 이미지를 정말로 수정하시겠습니까?`
    );

    if (!isConfirmed) {
      onClose();
      return;
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

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

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
