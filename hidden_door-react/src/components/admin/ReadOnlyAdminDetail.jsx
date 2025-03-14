import AdminDetailItem from "@components/admin/AdminDetailItem";
import AdminRoleItem from "@components/admin/AdminRoleItem";

const ReadOnlyAdminDetail = ({ adminData }) => {
  return (
    <div className="admin--detail--content">
      <AdminDetailItem label="이름" value={adminData.userName} />
      <AdminDetailItem label="이메일" value={adminData.email} />
      <AdminDetailItem label="전화번호" value={adminData.phone} />
      <AdminRoleItem roles={adminData.roles} />
    </div>
  );
};
export default ReadOnlyAdminDetail;
