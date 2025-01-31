import { useRecoilState } from "recoil";
import { escapeRoomState } from "../atoms/escapeRoomAtom";

export const useEscapeRoom = () => {
  const [escapeRoom, setEscapeRoom] = useRecoilState(escapeRoomState);

  return {
    escapeRoom,
    setEscapeRoom
  };
};
