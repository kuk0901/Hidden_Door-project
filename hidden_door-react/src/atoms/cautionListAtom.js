import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

/**
 * @description: Caution state atom
 * @use persistAtom
 */
const { persistAtom } = recoilPersist({
  key: "caution-list-persist",
  storage: sessionStorage
});

export const cautionListAtom = atom({
  key: "cautionListAtom",
  default: [],
  effects_UNSTABLE: [persistAtom]
});
