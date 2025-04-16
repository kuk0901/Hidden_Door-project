export const themeFields = (theme = null) => {
  const fields = [
    {
      name: "originalFileName",
      id: "originalFileName",
      type: "file",
      field: "input",
      placeholder: "테마 이미지",
      label: "테마 이미지",
      themeForm: true,
      required: !theme,
      onChange: null
    },
    {
      name: "themeName",
      id: "themeName",
      type: "text",
      placeholder: "테마 명",
      label: "테마 명",
      themeForm: true,
      className: "m"
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
      placeholder: "60",
      label: "플레이 시간(분)",
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
      label: "테마 설명",
      themeForm: true
    },
    {
      name: "cleaningTime",
      id: "cleaningTime",
      type: "number",
      field: "input",
      placeholder: "20",
      label: "청소시간 (분)",
      themeForm: true
    }
  ];
  return fields;
};

export const initialGenreList = [
  { id: "asd1", name: "드라마", checked: false },
  { id: "asd2", name: "판타지", checked: false },
  { id: "asd3", name: "공포", checked: false },
  { id: "asd4", name: "스릴러", checked: false },
  { id: "asd5", name: "액션", checked: false },
  { id: "asd6", name: "SF", checked: false },
  { id: "asd7", name: "잠입", checked: false }
];

export const initialAvailableDayList = [
  { id: "ert1", name: "월", value: "MONDAY", checked: false },
  { id: "ert2", name: "화", value: "TUESDAY", checked: false },
  { id: "ert3", name: "수", value: "WEDNESDAY", checked: false },
  { id: "ert4", name: "목", value: "THURSDAY", checked: false },
  { id: "ert5", name: "금", value: "FRIDAY", checked: false },
  { id: "ert6", name: "토", value: "SATURDAY", checked: false },
  { id: "ert7", name: "일", value: "SUNDAY", checked: false }
];
