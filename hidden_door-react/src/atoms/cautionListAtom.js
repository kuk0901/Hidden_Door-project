import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "caution-list-persist",
  storage: sessionStorage
});

export const cautionListAtom = atom({
  key: "cautionListAtom",
  default: [],
  effects_UNSTABLE: [persistAtom]
});
