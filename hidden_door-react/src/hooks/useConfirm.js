import { useSetRecoilState } from "recoil";
import { confirmState } from "../atoms/confirmAtom";

const useConfirm = () => {
  const setConfirmState = useSetRecoilState(confirmState);

  const confirm = (message) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        message,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  return confirm;
};

export default useConfirm;
