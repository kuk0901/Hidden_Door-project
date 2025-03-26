/**
 * @description 역할(role) 코드를 한글 설명으로 변환하는 함수
 * @param {string} role - 변환할 역할 코드
 * @returns {string} 한글로 변환된 역할 또는 원래 역할
 */
export const formatRole = (role) => {
  const roleMap = {
    ROLE_SUPER_ADMIN: "전체 관리자",
    ROLE_ADMIN: "관리자",
    ROLE_DIRECTOR: "관리 책임자",
    ROLE_MANAGER: "매니저"
  };
  return roleMap[role] || role;
};
