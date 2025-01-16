import { useRecoilState } from "recoil";
import { adminState } from "../atoms/adminAtom";

export const useAdmin = () => {
  const [admin, setAdmin] = useRecoilState(adminState);

  return {
    admin,
    setAdmin
  };
};
