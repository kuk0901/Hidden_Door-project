import { useRecoilState } from "recoil";
import { escapeRoomState } from "../atoms/escapeRoomAtom";

/**
 * @description useEscapeRoom Hook
 * @returns {Object} escapeRoom, setEscapeRoom
 */
export const useEscapeRoom = () => {
  const [escapeRoom, setEscapeRoom] = useRecoilState(escapeRoomState);

  return {
    escapeRoom,
    setEscapeRoom
  };
};
