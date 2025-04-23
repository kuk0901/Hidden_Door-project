import Select from "react-select";
import * as FaIcons from "react-icons/fa";
import FormatIconOptionLabel from "@components/common/form/select/formatIconOptionLabel";

const iconOptions = Object.entries(FaIcons).map(([name]) => ({
  value: name,
  icon: FaIcons[name]
}));

const IconSelector = ({ selectedIcon, onIconChange, labelText }) => (
  <>
    <label htmlFor="icon-select" className="bold icon-selector-label">
      {labelText || "주의사항 아이콘"}
    </label>
    <Select
      id="icon-select"
      className="icon-select"
      options={iconOptions}
      value={iconOptions.find((opt) => opt.value === selectedIcon)}
      onChange={(option) => onIconChange(option?.value || "")}
      formatOptionLabel={FormatIconOptionLabel}
      placeholder="아이콘 선택"
      isClearable
    />
  </>
);

export default IconSelector;
