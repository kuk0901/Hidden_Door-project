import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

/**
 * @description: EscapeRoom state atom
 * @use persistAtom
 */
const { persistAtom } = recoilPersist({
  key: "escape-room-persist",
  storage: sessionStorage
});

export const escapeRoomState = atom({
  key: "escapeRoomState",
  default: {
    roomId: "",
    roomName: "",
    location: "",
    title: "",
    explanation: "",
    contactInfo: "",
    storedFileName: "",
    originalFileName: "",
    themeHeaderTitle: "",
    themeHeaderSubtitle: "",
    themeDetailHeaderTitle: "",
    themeDetailHeaderSubtitle: ""
  },
  effects_UNSTABLE: [persistAtom]
});
