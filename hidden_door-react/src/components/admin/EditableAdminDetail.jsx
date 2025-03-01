import AdminDetailItem from "@components/admin/AdminDetailItem";
import InfoEditForm from "@components/common/form/InfoEditForm";

// FIXME: AdminEditForm 컴포넌트 사용으로 변경
const EditableAdminDetail = ({ adminData }) => (
  <div className="admin--detail--content">
    <InfoEditForm labelVal="이름" currentTitle={adminData.userName} />
    <AdminDetailItem label="이메일" value={adminData.email} />
    <InfoEditForm labelVal="전화번호" currentTitle={adminData.phone} />
    <AdminDetailItem label="역할" value={adminData.roles.join(", ")} />

    {/* pwd */}
    <div className="">
      <label htmlFor="pwd"></label>
      <input id="pwd" name="pwd" type="password" />
    </div>

    {/* pwd check*/}
    <div>
      <label htmlFor="pwdCheck"></label>
      <input id="pwdCheck" name="pwdCheck" type="password" />
    </div>
  </div>
);

export default EditableAdminDetail;
