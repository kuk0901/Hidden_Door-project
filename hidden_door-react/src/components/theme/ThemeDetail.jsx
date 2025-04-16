import { useImgUrl } from "@hooks/useImgUrl";
import ThemeInfo from "@components/theme/ThemeInfo";
import { useEffect, useState } from "react";
import FileForm from "@components/common/form/file/FileForm";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { validateThemeField } from "@validation/validationRules";
import {
  themeFields,
  initialGenreList,
  initialAvailableDayList
} from "@utils/fields/themeFields";
import { formatNumberToPrice } from "@utils/format/number";
import DeleteThemeButton from "@components/theme/DeleteThemeButton";
import useConfirm from "@hooks/useConfirm";
import { useAdmin } from "@hooks/useAdmin";
import CheckboxGroup from "@components/common/form/input/CheckboxGroup";

const ThemeDetail = ({ theme, setTheme }) => {
  const [themeEditVisible, setThemeEditVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [genreList, setGenreList] = useState(
    initialGenreList.map((genre) => {
      const isChecked = theme.genre.includes(genre.name);
      return { ...genre, checked: isChecked };
    })
  );

  const [availableDayList, setAvailableDayList] = useState(
    initialAvailableDayList.map((day) => {
      const isChecked = theme.availableDays.includes(day.value);
      return { ...day, checked: isChecked };
    })
  );
  const [errors, setErrors] = useState({});
  const [genreError, setGenreError] = useState("");
  const [availableDayError, setAvailableDayError] = useState("");

  const [formData, setFormData] = useState({
    file: null,
    themeName: theme.themeName,
    minParticipants: theme.minParticipants,
    maxParticipants: theme.maxParticipants,
    level: theme.level,
    time: theme.time,
    price: formatNumberToPrice(theme.price),
    description: theme.description,
    cleaningTime: theme.cleaningTime,
    availableDays: theme.availableDays
  });
  const confirm = useConfirm();
  const { isAdmin } = useAdmin();

  const handleEditClick = () => {
    setThemeEditVisible(true);
  };

  const handleGenreChange = (id) => {
    setGenreList(
      genreList.map((genre) =>
        genre.id === id ? { ...genre, checked: !genre.checked } : genre
      )
    );
  };

  const handleAvailableDayChange = (id) => {
    setAvailableDayList(
      availableDayList.map((day) =>
        day.id === id ? { ...day, checked: !day.checked } : day
      )
    );
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, file }));
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreviewImage(fileURL);
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

  const themeFieldsWithOnChange = themeFields(theme).map((field) => {
    if (field.name === "originalFileName") {
      return { ...field, onChange: handleFileChange };
    }
    return field;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 모든 필드에 대해 유효성 검사 수행
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateThemeField(key, formData[key], theme);
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
    if (Object.keys(newErrors).length > 0 || selectedGenres.length === 0) {
      toast.error("입력 정보를 확인해주세요.");
      return;
    }

    const submitData = new FormData();

    // 선택된 장르 이름을 추출하여 추가
    const selectedGenreNames = selectedGenres.map((genre) => genre.name);
    const selectedAvailableDayNames = selectedAvailableDays.map(
      (day) => day.value
    );

    const themeDto = {
      themeId: theme.themeId,
      themeName: formData.themeName,
      originalFileName: theme.originalFileName,
      storedFileName: theme.storedFileName,
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
    if (formData.file) {
      submitData.append("file", formData.file);
    }

    const isConfirmed = await confirm(
      `"${theme.themeName}" 테마 정보를 정말로 수정하시겠습니까?`
    );

    if (!isConfirmed) {
      setThemeEditVisible(false);
      return;
    }

    // FIXME: 변경 내용 확인(서버)
    try {
      const res = await Api.put(`/themes/theme/${theme.themeId}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setTheme(res.data.data);
      setThemeEditVisible(false);
      toast.success(res.data.msg);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  useEffect(() => {
    if (themeEditVisible) {
      const editFormContainer = document.querySelector(".edit-form-container");
      if (editFormContainer) {
        window.scrollTo({
          top: editFormContainer.offsetTop,
          behavior: "smooth"
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [themeEditVisible]);

  return (
    <section className="theme-section">
      <div className="container theme-title--line">
        <h3 className="theme-title">The door: {theme.themeName}</h3>

        {isAdmin && (
          <div className="btn-container">
            <button className="btn" onClick={handleEditClick}>
              테마 정보 수정
            </button>
            <DeleteThemeButton
              themeId={theme.themeId}
              themeName={theme.themeName}
            />
          </div>
        )}
      </div>

      <div className="info-line">
        <div className="img-container">
          <img
            src={useImgUrl(theme.storedFileName)}
            alt={`${theme.themeName} img`}
            className="img"
          />
        </div>

        <ThemeInfo theme={theme} />
      </div>

      {/* 테마 수정 form 영역 */}
      {themeEditVisible && (
        <div className="themeForm-container edit-form-container">
          {/* 새로운 파일 미리보기 */}
          {previewImage && (
            <div className="preview-container text-center">
              <img
                src={previewImage}
                alt="미리보기"
                style={{ maxWidth: "400px", maxHeight: "450px" }}
              />
            </div>
          )}

          {/* FileForm 사용 */}
          <FileForm
            onSubmit={handleSubmit}
            fields={themeFieldsWithOnChange}
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
            id="themeEditForm"
            theme={theme}
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
            <button className="btn" type="submit" form="themeEditForm">
              수정 완료
            </button>
            <button onClick={() => setThemeEditVisible(false)} className="btn">
              취소
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ThemeDetail;
