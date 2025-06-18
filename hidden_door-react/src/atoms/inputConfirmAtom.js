import { atom } from "recoil";

/**
 * @description input confirm state atom
 */
export const inputConfirmState = atom({
  key: "inputConfirmState",
  default: {
    isOpen: false,
    message: "",
    password: "",
    onConfirm: null,
    onCancel: null
  }
});
