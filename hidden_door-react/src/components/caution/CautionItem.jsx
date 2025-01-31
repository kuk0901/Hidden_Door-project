import { toast } from "react-toastify";
import * as FaIcons from "react-icons/fa";
import Button from "@components/common/buttons/Button";
import Api from "@axios/api";
import useConfirm from "@hooks/useConfirm";

const CautionItem = ({ admin, item, handleVisible, setSectionData }) => {
  const confirm = useConfirm();

  const IconComponent = FaIcons[item.icon];

  const formatContent = (content) => {
    const parts = content.split(/(?=※)/);

    return parts.map((part, index) => {
      if (part.startsWith("※")) {
        return (
          <span key={index} className="caution--content__red">
            {part}
          </span>
        );
      } else {
        return part;
      }
    });
  };

  const handleDeleteCaution = async () => {
    try {
      const isConfirmed = await confirm("정말 삭제하시겠습니까?");

      if (isConfirmed) {
        const res = await Api.delete(
          `/api/v1/cautions/caution/${item.cautionId}`
        );

        setSectionData(res.data.data);
        toast.success("해당 주의사항이 삭제되었습니다.");
      }
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <li className="caution--item">
      <div className="caution-content">
        <div className="icon-container">
          {IconComponent && <IconComponent size={50} />}
        </div>
        <div className="content-container">
          <div className="title">{item.title}</div>
          <div className="content">{formatContent(item.content)}</div>
        </div>
      </div>

      {admin && (
        <div className="btn-container">
          <Button text="수정" onClick={handleVisible} className="btn" />
          <Button
            text="삭제"
            onClick={handleDeleteCaution}
            className="btn delete"
          />
        </div>
      )}
    </li>
  );
};

export default CautionItem;
