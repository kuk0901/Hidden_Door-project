import { useState } from "react";
import FileForm from "@components/common/form/file/FileForm";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { validateThemeField } from "@validation/validationRules";
import { useNavigate } from "react-router-dom";
import {
  themeFields,
  initialGenreList,
  initialAvailableDayList
} from "@utils/fields/themeFields";
import useConfirm from "@hooks/useConfirm";
import CheckboxGroup from "@components/common/form/input/CheckboxGroup";

const ThemeAddPage = () => {
  const [genreList, setGenreList] = useState(initialGenreList);
  const [availableDayList, setAvailableDayList] = useState(
    initialAvailableDayList
  );
  const [formData, setFormData] = useState({
    file: null,
    themeName: "",
    minParticipants: 0,
    maxParticipants: 0,
    level: 0,
    time: 0,
    price: "",
    description: "",
    cleaningTime: 0
  });

  const [errors, setErrors] = useState({});
  const [genreError, setGenreError] = useState("");
  const [availableDayError, setAvailableDayError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();
  const confirm = useConfirm();

  const handleGenreChange = (id) => {
    setGenreList(
      genreList.map((genre) =>
        genre.id === id ? { ...genre, checked: !genre.checked } : genre
      )
    );
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, file }));
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreviewImage(fileURL);
    } else {
      setPreviewImage(null);
    }
  };

  const handleAvailableDayChange = (id) => {
    setAvailableDayList(
      availableDayList.map((day) =>
        day.id === id ? { ...day, checked: !day.checked } : day
      )
    );
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

    // 요일 선택 검사
    const selectedAvailableDays = availableDayList.filter((day) => day.checked);
    if (selectedAvailableDays.length === 0) {
      setAvailableDayError("최소 하나의 요일을 선택해주세요.");
    } else {
      setAvailableDayError("");
    }

    // 에러가 있으면 제출을 중단
    if (
      Object.keys(newErrors).length > 0 ||
      selectedGenres.length === 0 ||
      selectedAvailableDays.length === 0
    ) {
      toast.error("입력 정보를 확인해주세요.");
      return;
    }

    const submitData = new FormData();

    // 선택된 장르, 요일 추출
    const selectedGenreNames = selectedGenres.map((genre) => genre.name);
    const selectedAvailableDayNames = selectedAvailableDays.map(
      (day) => day.value
    );
    const themeDto = {
      themeName: formData.themeName,
      minParticipants: formData.minParticipants,
      maxParticipants: formData.maxParticipants,
      level: formData.level,
      time: formData.time,
      price: formData.price.replaceAll(",", "").trim(),
      description: formData.description,
      cleaningTime: formData.cleaningTime,
      genre: selectedGenreNames,
      availableDays: selectedAvailableDayNames
    };

    submitData.append(
      "themeDto",
      new Blob([JSON.stringify(themeDto)], { type: "application/json" })
    );
    submitData.append("file", formData.file);

    const isConfirmed = await confirm(`테마를 추가하시겠습니까?`);

    if (!isConfirmed) {
      return;
    }

    try {
      const res = await Api.post("/themes/theme/add", submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.status !== 200) {
        toast.error("테마 추가에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      navigate(`/hidden_door/theme/${res.data.data}?register=true`);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  const themeFieldsWithOnChange = themeFields(null).map((field) => {
    if (field.name === "originalFileName") {
      return { ...field, onChange: handleFileChange };
    }
    return field;
  });

  return (
    <div className="themeForm-container">
      {/* 미리보기 컨테이너 */}
      <div className="preview-container text-center">
        <div className="label-container">
          <label htmlFor="preview-img">이미지 미리보기</label>
        </div>
        {previewImage ? (
          <img
            src={previewImage}
            alt="미리보기"
            className="preview-img"
            id="preview-img"
          />
        ) : (
          <div className="preview-img">선택한 이미지를 볼 수 있습니다.</div>
        )}
      </div>

      {/* FileForm 사용 */}
      <FileForm
        onSubmit={handleSubmit}
        fields={themeFieldsWithOnChange}
        formData={formData}
        onInputChange={handleInputChange}
        errors={errors}
        id="themeForm"
      />

      <CheckboxGroup
        title="장르 (중복 선택 가능)"
        name="genre"
        items={genreList}
        onChange={handleGenreChange}
        error={genreError}
      />

      <CheckboxGroup
        title="운영 요일 (중복 선택 가능)"
        name="day"
        items={availableDayList}
        onChange={handleAvailableDayChange}
        error={availableDayError}
      />

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
