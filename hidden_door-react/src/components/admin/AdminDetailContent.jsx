import AdminDetailItem from "@components/admin/AdminDetailItem";
import RolesCheckboxGroup from "@components/admin/RolesCheckboxGroup";

// FIXME: 정보 수정 추가
const AdminDetailContent = ({ adminData, isSuperAdmin, onRolesChange }) => {
  const availableRoles = [
    "ROLE_USER",
    "ROLE_ADMIN",
    "ROLE_MANAGER",
    "ROLE_SUPER_ADMIN"
  ];

  return (
    <div className="admin--detail--content">
      <AdminDetailItem label="이름" value={adminData.userName} />
      <AdminDetailItem label="이메일" value={adminData.email} />
      <AdminDetailItem label="전화번호" value={adminData.phone} />
      <div className="admin--detail--item">
        <label className="admin--detail--label">역할</label>
        <RolesCheckboxGroup
          roles={availableRoles}
          userRoles={adminData.roles}
          onChange={onRolesChange}
          disabled={!isSuperAdmin}
        />
      </div>
    </div>
  );
};

export default AdminDetailContent;
