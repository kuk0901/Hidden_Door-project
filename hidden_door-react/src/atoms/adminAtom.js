import { atom } from "recoil";

export const adminState = atom({
  key: "adminState", // 고유한 ID (다른 atom과 겹치지 않도록)
  default: null
});
