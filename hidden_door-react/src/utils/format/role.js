export const formatRole = (role) => {
  const roleMap = {
    ROLE_SUPER_ADMIN: "전체 관리자",
    ROLE_ADMIN: "관리자",
    ROLE_MANAGER: "매니저"
  };
  return roleMap[role] || role;
};
