import { useForm } from "react-hook-form";

const SearchForm = ({ onSearch, fields, initialValues }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: initialValues
  });

  const onSubmit = (data) => {
    onSearch(data.searchField, data.searchTerm);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="search-form">
      <select
        {...register("searchField")}
        name="searchField"
        className="search-select"
      >
        {fields.map((field) => (
          <option key={field.value} value={field.value}>
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
      <button type="submit" className="btn btn--search">
        검색
      </button>
    </form>
  );
};

export default SearchForm;
