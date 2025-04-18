import { isEqual } from "lodash";

const normalizeForThemeComparison = (data) => {
  return {
    themeId: data.themeId,
    themeName: data.themeName.trim(),
    originalFileName: data.originalFileName,
    storedFileName: data.storedFileName,
    level: data.level,
    time: data.time,
    price: Number(String(data.price).replace(/\D/g, "")),
    description: data.description,
    cleaningTime: data.cleaningTime,
    genre: [...data.genre].sort(),
    availableDays: [...data.availableDays].sort()
  };
};

export const themeIsUnchanged = (original, edited) => {
  return isEqual(
    normalizeForThemeComparison(original),
    normalizeForThemeComparison(edited)
  );
};

const normalizeForAdminComparison = (data) => {
  return {
    userName: data.userName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    roles: [...data.roles].sort()
  };
};

export const adminIsUnchanged = (original, edited) => {
  return isEqual(
    normalizeForAdminComparison(original),
    normalizeForAdminComparison(edited)
  );
};
