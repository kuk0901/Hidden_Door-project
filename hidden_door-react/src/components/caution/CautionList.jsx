import { useState } from "react";
import CautionItem from "./CautionItem";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import InfoEditForm from "@components/common/form/InfoEditForm";
import IconSelector from "@components/common/form/select/IconSelector";
import Form from "@components/common/form/Form";
import useConfirm from "@hooks/useConfirm";
import { validationRules } from "@validation/validationRules";
import { useCautionList } from "@hooks/useCautionList";

const CautionList = () => {
  const { cautionList, setCautionList } = useCautionList();
  const [editingItem, setEditingItem] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const confirm = useConfirm();

  const { isAdmin } = useAdmin();

  // FIXME: 중복 검사
  const handleAddCaution = async (formData, reset) => {
    if (!selectedIcon) {
      toast.error("아이콘은 필수입력란입니다.");
      return;
    }

    const isConfirmed = await confirm(`주의사항을 추가하시겠습니까?`);

    if (!isConfirmed) {
      handleAddCancel();
      return;
    }

    try {
      const newCaution = {
        title: formData.title,
        content: formData.content,
        icon: selectedIcon || "FaExclamationTriangle"
      };

      const res = await Api.post("/cautions/caution/add", newCaution);

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setCautionList(res.data.data);
      setIsAdding(false);
      reset();
      setSelectedIcon(null);

      toast.success(res.data.msg);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  const addFields = [
    {
      name: "title",
      type: "text",
      placeholder: "주의사항 제목",
      label: "새 주의사항 제목",
      className: "l column caution",
      id: "add-title",
      autoFocus: true,
      validation: validationRules.title
    },
    {
      name: "content",
      type: "textarea",
      placeholder: "주의사항 내용",
      label: "새 주의사항 내용",
      className: "l column",
      id: "add-content",
      field: "textarea",
      validation: validationRules.content
    }
  ];

  const handleEditStart = (caution) => {
    setEditingItem(caution);
    setSelectedIcon(caution.icon);
    setTitle(caution.title);
    setContent(caution.content);
  };

  const handleEditCancel = () => {
    setEditingItem(null);
    resetForm();
  };

  const handleAddStart = () => {
    setIsAdding(true);
    setEditingItem(null);
    setSelectedIcon(null);
  };

  const handleAddCancel = () => {
    setIsAdding(false);
    resetForm();
  };

  const handleUpdateCaution = async () => {
    if (!editingItem) return;

    const isConfirmed = await confirm(
      `해당 주의사항 정보를 정말로 수정하시겠습니까?`
    );

    if (!isConfirmed) {
      handleEditCancel();
      return;
    }

    try {
      const updatedCaution = {
        ...editingItem,
        title,
        content,
        icon: selectedIcon || editingItem.icon
      };

      const res = await Api.put(
        `/cautions/caution/${editingItem.cautionId}`,
        updatedCaution
      );

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setCautionList(res.data.data);
      handleEditCancel();

      toast.success("해당 주의사항이 수정되었습니다.");
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedIcon(null);
  };

  return (
    <>
      {isAdmin && !editingItem && (
        <div className="btn-container btn-container__right">
          <button onClick={handleAddStart} className="btn">
            주의사항 추가
          </button>
        </div>
      )}

      <ul className="caution--list">
        {cautionList.map((caution) => (
          <CautionItem
            isAdmin={isAdmin}
            key={caution.cautionId}
            item={caution}
            handleVisible={() => handleEditStart(caution)}
          />
        ))}
      </ul>

      {isAdmin && isAdding && (
        <div className="caution--add">
          <IconSelector
            selectedIcon={selectedIcon}
            onIconChange={setSelectedIcon}
          />
          <Form
            onSubmit={handleAddCaution}
            fields={addFields}
            id="cautionAddForm"
          />
          <div className="btn-container">
            <button type="submit" form="cautionAddForm" className="btn">
              추가
            </button>
            <button onClick={() => setIsAdding(false)} className="btn">
              취소
            </button>
          </div>
        </div>
      )}

      {isAdmin && editingItem && (
        <div className="caution--edit">
          <IconSelector
            selectedIcon={selectedIcon}
            onIconChange={setSelectedIcon}
          />
          <InfoEditForm
            labelVal="주의사항 제목"
            currentTitle={title}
            onUpdate={handleUpdateCaution}
            onCancel={handleEditCancel}
            onChange={(e) => setTitle(e.target.value)}
            area={false}
            autoFocus={true}
          />
          <InfoEditForm
            labelVal="주의사항 내용"
            currentTitle={content}
            onUpdate={handleUpdateCaution}
            onCancel={handleEditCancel}
            onChange={(e) => setContent(e.target.value)}
            area={true}
            viewButton={true}
          />
        </div>
      )}
    </>
  );
};

export default CautionList;
