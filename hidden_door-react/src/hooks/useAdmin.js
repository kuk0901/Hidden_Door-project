import { useRecoilState, useRecoilValue } from "recoil";
import {
  adminState,
  isSuperAdminSelector,
  isAdminSelector
} from "../atoms/adminAtom";

export const useAdmin = () => {
  const [admin, setAdmin] = useRecoilState(adminState);
  const isSuperAdmin = useRecoilValue(isSuperAdminSelector);
  const isAdmin = useRecoilValue(isAdminSelector);

  return {
    admin,
    setAdmin,
    isSuperAdmin,
    isAdmin
  };
};
