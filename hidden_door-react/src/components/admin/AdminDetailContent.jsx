import EditableAdminDetail from "@components/admin/EditableAdminDetail";
import ReadOnlyAdminDetail from "@components/admin/ReadOnlyAdminDetail";
import SuperAdminEditableDetail from "@components/admin/SuperAdminEditableDetail";

const AdminDetailContent = ({
  adminData,
  setAdminData,
  isSuperAdmin,
  currentAdminEmail,
  page,
  setPage,
  search,
  setSearch
}) => {
  const availableRoles = [
    "ROLE_USER",
    "ROLE_ADMIN",
    "ROLE_DIRECTOR",
    "ROLE_SUPER_ADMIN"
  ];

  if (isSuperAdmin) {
    return (
      <SuperAdminEditableDetail
        adminData={adminData}
        setAdminData={setAdminData}
        availableRoles={availableRoles}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
      />
    );
  } else if (currentAdminEmail === adminData.email) {
    return (
      <EditableAdminDetail
        adminData={adminData}
        setAdminData={setAdminData}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
      />
    );
  } else {
    return (
      <ReadOnlyAdminDetail
        adminData={adminData}
        page={page}
        setPage={setPage}
        search={search}
      />
    );
  }
};

export default AdminDetailContent;
