import AdminEditForm from "@components/common/form/AdminEditForm";
import { toast } from "react-toastify";
import useConfirm from "@hooks/useConfirm";
import Api from "@axios/api";
import AdminRoleInputItem from "@components/admin/AdminRoleInputItem";
import { adminIsUnchanged } from "@utils/comparison/objectComparator";

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

  const handleSubmit = async (data, reset) => {
    const isConfirmed = await confirm(`관리자 정보를 정말로 수정하시겠습니까?`);
    if (!isConfirmed) return;

    try {
      delete data.pwdCheck;

      if (!data.pwd && adminIsUnchanged(adminData, data)) {
        toast.warn("변경된 내용이 없습니다.");
        return;
      }

      const res = await Api.post(
        `/admins/account/update/${adminData.adminId}`,
        data
      );

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      const updatedState = {
        adminData: res.data.data,
        page: page,
        search: search
      };

      setAdminData(updatedState.adminData);
      reset({ ...updatedState.adminData, pwd: "", pwdCheck: "" });
      setPage(updatedState.page);
      setSearch(updatedState.search);
      toast.success("관리자 정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
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
      >
        <AdminRoleInputItem roles={adminData.roles} />
      </AdminEditForm>

      <div className="btn-container">
        <button type="submit" form="adminInfoUpdateForm" className="btn">
          저장
        </button>
      </div>
    </div>
  );
};

export default EditableAdminDetail;
