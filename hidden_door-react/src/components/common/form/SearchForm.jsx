import { useEffect } from "react";
import { useForm } from "react-hook-form";

const SearchForm = ({ onSearch, fields, initialValues, onReset }) => {
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: initialValues
  });

  const selectedField = watch("searchField");

  // FIXME: useConfirm으로 수정
  const onSubmit = (data) => {
    if (data.searchField === "") {
      alert("검색 필드를 선택해주세요.");
      return;
    }
    onSearch(data.searchField, data.searchTerm);
  };

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="search-form">
      <select
        {...register("searchField", { required: true })}
        name="searchField"
        className="search-select"
      >
        {fields.map((field) => (
          <option
            key={field.value}
            value={field.value}
            disabled={field.value === "" && selectedField !== ""}
          >
            {field.label}
          </option>
        ))}
      </select>

      <input
        {...register("searchTerm")}
        name="searchTerm"
        type="text"
        placeholder="검색어를 입력하세요"
        className="search-input"
      />

      <div className="btn-container">
        <button type="submit" className="btn btn--search">
          검색
        </button>

        {onReset && (
          <button
            type="button"
            onClick={() => onReset()}
            className="btn btn--search"
          >
            초기화
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchForm;
