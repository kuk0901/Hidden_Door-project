import useConfirm from "@hooks/useConfirm";
import { toast } from "react-toastify";
import Api from "@axios/api";
import { useNavigate } from "react-router-dom";

const DeleteThemeButton = ({ themeId, themeName }) => {
  const confirm = useConfirm();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const isConfirmed = await confirm(
      `"${themeName}" 테마를 정말로 삭제하시겠습니까?`
    );

    if (isConfirmed) {
      themeDeleteFnc();
    }
  };

  const themeDeleteFnc = async () => {
    try {
      const res = await Api.delete(`/themes/theme/${themeId}`);

      if (res.status !== 200) {
        toast.error(
          `${themeName} 테마를 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.`
        );
        return;
      }

      navigate(`/hidden_door/theme?delete=true&tn=${themeName}`);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <button className="btn delete" onClick={handleDelete}>
      테마 삭제
    </button>
  );
};

export default DeleteThemeButton;
