import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

/**
 * @description: Faq state atom
 * @use persistAtom
 */
const { persistAtom } = recoilPersist({
  key: "faq-list-persist",
  storage: sessionStorage,
});

export const faqListAtom = atom({
  key: "faqListAtom",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
