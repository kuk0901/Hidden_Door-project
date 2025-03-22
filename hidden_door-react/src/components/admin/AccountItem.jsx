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
      state: { page, search }
    });
  };

  const handleDelete = async (event) => {
    event.stopPropagation();

    const deleteRequestDto = {
      page: page.page,
      size: page.size,
      sortField: page.sortField,
      sortDirection: page.sortDirection,
      searchField: search.searchField,
      searchTerm: search.searchTerm
    };

    try {
      const res = await Api.delete(
        `/admins/account/delete/${adminData.adminId}`,
        {
          data: deleteRequestDto
        }
      );

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setAdminList(res.data.data);
      setPage({ ...page, ...res.data.pageDto });
      setSearch({
        ...search,
        searchField: res.data.searchField,
        searchTerm: res.data.searchTerm
      });

      toast.success(res.data.msg);
    } catch (error) {
      console.log("Error deleting admin:", error);
      toast.error("계정 삭제에 실패했습니다.");
    }
  };

  return (
    <li className="account--item">
      <button onClick={handleDetail} className="account--item-content">
        <div className="content content--sm">{adminData.userName}</div>
        <div className="content content--md content--email">
          {adminData.email}
        </div>
        <div className="content content--sm content--phone">
          {adminData.phone}
        </div>

        {/* FIXME: 컴포넌트 분리 고려 */}
        <div className="content content--lg roles-container">
          {filteredRoles.slice(0, 3).map((r, i, arr) => (
            <span key={i} className="role">
              {formatRole(r)}
              {i < arr.length - 1 ? ", " : ""}
            </span>
          ))}
          {filteredRoles.length > 3 && <span className="role">...</span>}
        </div>

        {role && (
          <div className="content content--xs">
            <button
              className="btn delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(e);
              }}
            >
              삭제
            </button>
          </div>
        )}
      </button>
    </li>
  );
};

export default AccountItem;
