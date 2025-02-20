import { useForm } from "react-hook-form";

// FIXME: 구조만 잡아놓은 상태
const SearchForm = ({ onSearch, fields }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    onSearch(data.searchField, data.searchTerm);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="search-form">
      <select {...register("searchField")} className="search-select">
        {fields.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>
      <input
        {...register("searchTerm")}
        type="text"
        placeholder="검색어를 입력하세요"
        className="search-input"
      />
      <button type="submit">검색</button>
    </form>
  );
};

export default SearchForm;
