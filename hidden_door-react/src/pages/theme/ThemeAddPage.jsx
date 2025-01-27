import { useState } from "react";
import FileForm from "@components/common/form/file/FileForm";
// import Api from "@axios/api";
import { toast } from "react-toastify";

/* * FIXME:
 * form 위치 고려해서 genre 부분 옮겨야 함 -> scss 추가도 필요
 * 수정 form 구조 고려해서 InputFiled 변경해야 할 수도 있음 -> file
 * 객체 key-value 학인
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

  const [previewImage, setPreviewImage] = useState(null);

  const handleGenreChange = (id) => {
    setGenreList(
      genreList.map((genre) =>
        genre.id === id ? { ...genre, checked: !genre.checked } : genre
      )
    );
  };

  // preview
  const handleFileChange = (file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreviewImage(fileURL);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (data, reset) => {
    const selectedGenres = genreList
      .filter((genre) => genre.checked)
      .map((genre) => genre.name);

    const formData = new FormData();

    // 폼 데이터에 장르 추가
    formData.append("genres", JSON.stringify(selectedGenres));

    // 다른 필드들 추가
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    try {
      console.log(formData);
      // const res = await Api.post("/api/v1/themes", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data"
      //   }
      // });

      // 성공 처리
      reset();
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
      type: "file",
      field: "input",
      placeholder: "테마 이미지",
      errorMessage: "이미지를 선택해주세요",
      label: "테마 이미지",
      themeForm: true,
      onChange: handleFileChange
    },
    {
      name: "minParticipants",
      type: "number",
      field: "input",
      placeholder: "2",
      errorMessage: "최소 인원을 입력해주세요",
      label: "최소인원",
      themeForm: true
    },
    {
      name: "maxParticipants",
      type: "number",
      field: "input",
      placeholder: "5",
      errorMessage: "최대 인원을 입력해주세요",
      label: "최대인원",
      themeForm: true
    },
    {
      name: "level",
      type: "number",
      field: "input",
      placeholder: "3",
      errorMessage: "난이도를 입력해주세요",
      label: "난이도",
      themeForm: true
    },
    {
      id: "time",
      name: "time",
      type: "number",
      field: "input",
      placeholder: "플레이 시간 (분)",
      errorMessage: "플레이 시간을 입력해주세요",
      label: "time",
      themeForm: true
    },

    {
      id: "price",
      name: "price",
      type: "text",
      field: "input",
      placeholder: "20,000",
      errorMessage: "가격을 입력해주세요",
      label: "가격 (1인당)",
      themeForm: true
    },
    {
      id: "description",
      name: "description",
      field: "textarea",
      placeholder: "테마 설명",
      errorMessage: "테마 설명을 입력해주세요",
      label: "description",
      themeForm: true
    }
  ];

  return (
    <div className="themeForm-container">
      {/* 미리보기 컨테이너 */}
      <div className="preview-container">
        {previewImage && (
          <img
            src={previewImage}
            alt="미리보기"
            style={{ maxWidth: "300px", maxHeight: "300px" }}
          />
        )}
      </div>

      {/* FileForm 사용 */}
      <FileForm
        onSubmit={handleSubmit}
        fields={themeFields}
        btnText="테마 추가"
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
      </div>
    </div>
  );
};

export default ThemeAddPage;
