import { useNavigate } from "react-router-dom";
import { formatRole } from "@utils/format/role";
import Api from "@axios/api";
import { toast } from "react-toastify";

const AccountItem = ({
  page,
  search,
  adminData,
  setAdminList,
  setPage,
  setSearch,
  role
}) => {
  const navigate = useNavigate();

  const filteredRoles = adminData.roles.filter((r) => r !== "ROLE_USER");

  const handleDetail = () => {
    navigate(`/hidden_door/admin/account/${adminData.adminId}`, {
      state: { adminData, page, search }
    });
  };

  const handleDelete = async (event) => {
    event.stopPropagation();

    const deleteRequestDto = {
      id: adminData.adminId,
      page: page.page,
      size: page.size,
      sortField: page.sortField,
      sortDirection: page.sortDirection,
      searchField: search.searchField,
      searchTerm: search.searchTerm
    };

    try {
      const res = await Api.delete("/admins/account/delete/one", {
        data: deleteRequestDto
      });
      setAdminList(res.data.data);
      setPage({ ...page, ...res.data.pageDto });
      setSearch({
        ...search,
        searchField: res.data.searchField,
        searchTerm: res.data.searchTerm
      });
    } catch (error) {
      console.log("Error deleting admin:", error);
      toast.error("계정 삭제에 실패했습니다.");
    }
  };

  return (
    <li className="account--item" onClick={handleDetail}>
      <div className="content content--sm">{adminData.userName}</div>
      <div className="content content--md">{adminData.email}</div>
      <div className="content content--sm">{adminData.phone}</div>
      <div className="content content--md roles-container">
        {filteredRoles.map((r, i, arr) => (
          <span key={i} className="role">
            {formatRole(r)}
            {i < arr.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
      {role && (
        <div className="content content--sm">
          <button className="btn delete" onClick={handleDelete}>
            삭제
          </button>
        </div>
      )}
    </li>
  );
};

export default AccountItem;
