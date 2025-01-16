import { atom } from "recoil";

export const confirmState = atom({
  key: "confirmState",
  default: {
    isOpen: false,
    message: "",
    onConfirm: null,
    onCancel: null
  }
});
