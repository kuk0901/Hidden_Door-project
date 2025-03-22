/**
 * @description useImgUrl Hook
 * @returns {string} server image url
 */
export const useImgUrl = (storedFileName) => {
  return import.meta.env.VITE_APP_IMG_URL + storedFileName;
};
