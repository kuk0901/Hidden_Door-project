export const emailRegex = /^(?=.{6,36}$)[a-z0-9_]+@[a-z0-9.-]+\.[a-z]{2,}$/;
export const pwdRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,21}$/;
export const priceRegex = /^\d{1,3}(,\d{3})*$/;
