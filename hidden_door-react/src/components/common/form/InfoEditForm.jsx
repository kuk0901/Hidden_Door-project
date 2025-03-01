import EditTextareaField from "@components/common/form/textarea/EditTextareaField";
import EditInputField from "@components/common/form/input/EditInputField";
import ButtonGroup from "@components/common/buttons/ButtonGroup";

const InfoEditForm = ({
  labelVal,
  currentTitle,
  onUpdate,
  onCancel,
  onChange,
  onRef,
  area,
  viewButton,
  autoFocus
}) => {
  const renderField = () => {
    const commonProps = {
      id: "title",
      name: "title",
      defaultValue: onRef ? currentTitle : undefined,
      value: onChange ? currentTitle : undefined,
      onChange: onChange,
      onRef: onRef,
      autoFocus: autoFocus
    };

    return area ? (
      <EditTextareaField {...commonProps} />
    ) : (
      <EditInputField {...commonProps} />
    );
  };

  if (!onRef && !onChange) return null;

  return (
    <article className="edit-form">
      <div className="input-section">
        <div className="label-container">
          <label htmlFor="title">{labelVal}</label>
        </div>
        {renderField()}
      </div>
      {viewButton && <ButtonGroup onUpdate={onUpdate} onCancel={onCancel} />}
    </article>
  );
};

export default InfoEditForm;
