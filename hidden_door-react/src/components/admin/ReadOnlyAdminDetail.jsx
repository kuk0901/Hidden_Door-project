import AdminDetailItem from "@components/admin/AdminDetailItem";

const ReadOnlyAdminDetail = ({ adminData }) => (
  <div className="admin--detail--content">
    <AdminDetailItem label="이름" value={adminData.userName} />
    <AdminDetailItem label="이메일" value={adminData.email} />
    <AdminDetailItem label="전화번호" value={adminData.phone} />
    <AdminDetailItem label="역할" value={adminData.roles.join(", ")} />
  </div>
);
export default ReadOnlyAdminDetail;
