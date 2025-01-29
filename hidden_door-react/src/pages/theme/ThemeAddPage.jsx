import { useState } from "react";
import FileForm from "@components/common/form/file/FileForm";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { validateThemeField } from "../../validation/validationRules";
import { useThemeList } from "@hooks/useThemeList";
import { useNavigate } from "react-router-dom";

/* * FIXME:
 * UI 수정 필요, genre 부분 errorMessage 위치 수정
 */

const ThemeAddPage = () => {
  const [genreList, setGenreList] = useState([
    { id: "asd1", name: "드라마", checked: false },
    { id: "asd2", name: "판타지", checked: false },
    { id: "asd3", name: "공포", checked: false },
    { id: "asd4", name: "스릴러", checked: false },
    { id: "asd5", name: "액션", checked: false },
    { id: "asd6", name: "SF", checked: false },
    { id: "asd7", name: "잠입", checked: false }
  ]);

  const [formData, setFormData] = useState({
    originalFileName: null,
    minParticipants: 0,
    maxParticipants: 0,
    level: 0,
    time: 0,
    price: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [genreError, setGenreError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const { setThemeList } = useThemeList();
  const navigate = useNavigate();

  const handleGenreChange = (id) => {
    setGenreList(
      genreList.map((genre) =>
        genre.id === id ? { ...genre, checked: !genre.checked } : genre
      )
    );
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, originalFileName: file }));
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreviewImage(fileURL);
    } else {
      setPreviewImage(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // number 타입인 경우 숫자로 변환
    const newValue = type === "number" ? Number(value) : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // 입력 값이 변경될 때마다 유효성 검사 수행
    const error = validateThemeField(name, newValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 모든 필드에 대해 유효성 검사 수행
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateThemeField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    // 장르 선택 검사
    const selectedGenres = genreList.filter((genre) => genre.checked);
    if (selectedGenres.length === 0) {
      setGenreError("최소 하나의 장르를 선택해주세요.");
    } else {
      setGenreError("");
    }

    // 에러가 있으면 제출을 중단
    if (Object.keys(newErrors).length > 0 || selectedGenres.length === 0) {
      toast.error("입력 정보를 확인해주세요.");
      return;
    }

    const submitData = new FormData();

    // 선택된 장르 이름을 추출하여 추가
    const selectedGenreNames = selectedGenres.map((genre) => genre.name);

    const themeDto = {
      minParticipants: formData.minParticipants,
      maxParticipants: formData.maxParticipants,
      level: formData.level,
      time: formData.time,
      price: formData.price.replaceAll(",", "").trim(),
      description: formData.description,
      genres: JSON.stringify(selectedGenreNames)
    };

    submitData.append(
      "themeDto",
      new Blob([JSON.stringify(themeDto)], { type: "application/json" })
    );
    submitData.append("originalFileName", formData.originalFileName);

    try {
      // API 호출 로직
      const res = await Api.post("/api/v1/themes/theme/add", submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setThemeList(res.data.data);
      // 성공 처리
      toast.success(res.data.msg);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  const themeFields = [
    {
      name: "originalFileName",
      id: "originalFileName",
      type: "file",
      field: "input",
      placeholder: "테마 이미지",
      label: "테마 이미지",
      themeForm: true,
      onChange: handleFileChange
    },
    {
      name: "minParticipants",
      id: "minParticipants",
      type: "number",
      field: "input",
      placeholder: "2",
      label: "최소인원",
      themeForm: true
    },
    {
      name: "maxParticipants",
      id: "maxParticipants",
      type: "number",
      field: "input",
      placeholder: "5",
      label: "최대인원",
      themeForm: true
    },
    {
      name: "level",
      id: "level",
      type: "number",
      field: "input",
      placeholder: "3",
      label: "난이도",
      themeForm: true
    },
    {
      name: "time",
      id: "time",
      type: "number",
      field: "input",
      placeholder: "플레이 시간 (분)",
      label: "time",
      themeForm: true
    },

    {
      name: "price",
      id: "price",
      type: "text",
      field: "input",
      placeholder: "20,000",
      label: "가격 (1인당)",
      themeForm: true
    },
    {
      name: "description",
      id: "description",
      field: "textarea",
      placeholder: "테마 설명을 간략하게 작성해 주세요.",
      label: "description",

      themeForm: true
    }
  ];

  return (
    <div className="themeForm-container">
      {/* 미리보기 컨테이너 */}
      <div className="preview-container text-center">
        {previewImage && (
          <img
            src={previewImage}
            alt="미리보기"
            style={{ maxWidth: "400px", maxHeight: "450px" }}
          />
        )}
      </div>

      {/* FileForm 사용 */}
      <FileForm
        onSubmit={handleSubmit}
        fields={themeFields}
        formData={formData}
        onInputChange={handleInputChange}
        errors={errors}
        id="themeForm"
      />

      {/* 장르 체크박스 섹션 */}
      <div className="genre-section">
        <div className="label-container">
          <label htmlFor="genre">
            <span className="text--red">*</span>장르 (중복 선택 가능)
          </label>
        </div>
        <div className="input-container">
          {genreList.map((genre) => (
            <div key={genre.id}>
              <input
                type="checkbox"
                id={`genre-${genre.id}`}
                name="genre"
                value={genre.name}
                checked={genre.checked}
                onChange={() => handleGenreChange(genre.id)}
              />
              <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
            </div>
          ))}
        </div>
        {genreError && <span className="text--red">{genreError}</span>}
      </div>

      <div className="btn-container">
        <button className="btn" type="submit" form="themeForm">
          테마 추가
        </button>
        <button onClick={() => navigate("/hidden_door/theme")} className="btn">
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default ThemeAddPage;
