const emailRegex = /^(?=.{6,36}$)[a-z0-9_]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const priceRegex = /^\d{1,3}(,\d{3})*$/;
const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
const userNameRegex = /^([가-힣]{2,8}|[가-힣\d]{4,8})$/;

export { emailRegex, pwdRegex, priceRegex, phoneRegex, userNameRegex };
