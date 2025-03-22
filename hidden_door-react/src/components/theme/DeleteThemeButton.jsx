import useConfirm from "@hooks/useConfirm";
import { useThemeList } from "@hooks/useThemeList";
import { toast } from "react-toastify";
import Api from "@axios/api";
import { useNavigate } from "react-router-dom";

const DeleteThemeButton = ({ themeId, themeName }) => {
  const confirm = useConfirm();
  const { setThemeList } = useThemeList();
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
      const res = await Api.delete(`/api/v1/themes/theme/delete/${themeId}`);

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setThemeList(res.data.data);
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
