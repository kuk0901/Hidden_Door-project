import { atom, selector } from "recoil";

export const adminState = atom({
  key: "adminState",
  default: null
});

export const isSuperAdminSelector = selector({
  key: "isSuperAdminSelector",
  get: ({ get }) => {
    const admin = get(adminState);
    return admin?.roles.includes("ROLE_SUPER_ADMIN") || false;
  }
});

export const isAdminSelector = selector({
  key: "isAdminSelector",
  get: ({ get }) => {
    const admin = get(adminState);
    return admin?.roles.includes("ROLE_ADMIN") || false;
  }
});
