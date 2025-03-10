import AdminEditForm from "@components/common/form/AdminEditForm";
import { toast } from "react-toastify";
import useConfirm from "@hooks/useConfirm";
import Api from "@axios/api";
import AdminRoleItem from "@components/admin/AdminRoleItem";

// FIXME: AdminEditForm 컴포넌트 사용으로 변경
const EditableAdminDetail = ({
  adminData,
  setAdminData,
  availableRoles,
  page,
  setPage,
  search,
  setSearch
}) => {
  const confirm = useConfirm();

  const handleSubmit = async (data) => {
    try {
      const isConfirmed = await confirm(
        `관리자 정보를 정말로 수정하시겠습니까?`
      );
      if (!isConfirmed) return;

      delete data.pwdCheck;

      const res = await Api.post(
        `/admins/account/update/${adminData.adminId}`,
        data
      );

      const updatedState = {
        adminData: res.data.data,
        page: page,
        search: search
      };

      setAdminData(updatedState.adminData);
      setPage(updatedState.page);
      setSearch(updatedState.search);
      toast.success("관리자 정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      toast.error(error.message || "");
    }
  };

  return (
    <div className="admin--detail--content">
      <AdminEditForm
        adminData={adminData}
        onSubmit={handleSubmit}
        setAdminData={setAdminData}
        availableRoles={availableRoles}
        formId="adminInfoUpdateForm"
      />

      <AdminRoleItem roles={adminData.roles} />

      <div className="btn-container">
        <button type="submit" form="adminInfoUpdateForm" className="btn">
          저장
        </button>
      </div>
    </div>
  );
};

export default EditableAdminDetail;
