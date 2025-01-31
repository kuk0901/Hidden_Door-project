import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "theme-list-persist",
  storage: sessionStorage
});

export const themeListAtom = atom({
  key: "themeListAtom",
  default: [],
  effects_UNSTABLE: [persistAtom]
});
