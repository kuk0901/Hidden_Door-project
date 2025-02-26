const AdminDetailItem = ({ label, value }) => (
  <div className="admin--detail--item">
    <label className="admin--detail--label">{label}</label>
    <input className="admin--detail--value" defaultValue={value} />
  </div>
);

export default AdminDetailItem;
