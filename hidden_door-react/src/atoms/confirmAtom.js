import { atom } from "recoil";

/**
 * @description Confirm state atom
 */
export const confirmState = atom({
  key: "confirmState",
  default: {
    isOpen: false,
    message: "",
    onConfirm: null,
    onCancel: null
  }
});
