import AccountItem from "@components/admin/AccountItem";

const AccountList = ({ page, search, adminList, role }) => {
  return (
    <ul className="account--list">
      <li className="account--item account--header">
        <div className="content content--sm">이름</div>
        <div className="content content--md">이메일</div>
        <div className="content content--sm">연락처</div>
        {role && <div className="content content--lg">권한</div>}
      </li>

      {adminList.map((adminData) => (
        <AccountItem
          page={page}
          search={search}
          key={adminData.adminId}
          adminData={adminData}
          role={role}
        />
      ))}
    </ul>
  );
};

export default AccountList;
