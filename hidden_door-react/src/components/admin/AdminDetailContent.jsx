import EditableAdminDetail from "@components/admin/EditableAdminDetail";
import ReadOnlyAdminDetail from "@components/admin/ReadOnlyAdminDetail";
import SuperAdminEditableDetail from "@components/admin/SuperAdminEditableDetail";

// FIXME: 정보 수정 추가
const AdminDetailContent = ({
  adminData,
  setAdminData,
  isSuperAdmin,
  currentAdminEmail
}) => {
  const availableRoles = [
    "ROLE_USER",
    "ROLE_ADMIN",
    "ROLE_MANAGER",
    "ROLE_SUPER_ADMIN"
  ];

  if (isSuperAdmin) {
    return (
      <SuperAdminEditableDetail
        adminData={adminData}
        setAdminData={setAdminData}
        availableRoles={availableRoles}
      />
    );
  } else if (currentAdminEmail === adminData.email) {
    return (
      <EditableAdminDetail adminData={adminData} setAdminData={setAdminData} />
    );
  } else {
    return <ReadOnlyAdminDetail adminData={adminData} />;
  }
};

export default AdminDetailContent;
