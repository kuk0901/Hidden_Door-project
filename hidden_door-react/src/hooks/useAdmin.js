import { useRecoilState, useRecoilValue } from "recoil";
import {
  adminState,
  isSuperAdminSelector,
  isAdminSelector,
  isDirectorSelector
} from "../atoms/adminAtom";

/**
 * @description useAdmin Hook
 * @returns {Object} admin, setAdmin, isSuperAdmin, isDirector, isAdmin
 */
export const useAdmin = () => {
  const [admin, setAdmin] = useRecoilState(adminState);
  const isSuperAdmin = useRecoilValue(isSuperAdminSelector);
  const isDirector = useRecoilValue(isDirectorSelector);
  const isAdmin = useRecoilValue(isAdminSelector);

  return {
    admin,
    setAdmin,
    isSuperAdmin,
    isDirector,
    isAdmin
  };
};
