const emailRegex = /^(?=.{6,36}$)[a-z0-9_]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const pwdRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,21}$/;
const priceRegex = /^\d{1,3}(,\d{3})*$/;
const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
const userNameRegex = /^[가-힣]{2,8}$\d/;

export { emailRegex, pwdRegex, priceRegex, phoneRegex, userNameRegex };
