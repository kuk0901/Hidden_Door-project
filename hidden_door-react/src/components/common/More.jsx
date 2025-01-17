import { useAdmin } from "@hooks/useAdmin";
import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import LinkContainer from "@components/common/LinkContainer";
import { headerLinkList } from "@routes/linkList";
import { Link } from "react-router-dom";

const More = () => {
  const { admin } = useAdmin();
  const [open, setOpen] = useState(false);
  return (
    <>
      <IoIosMenu onClick={() => setOpen(!open)} size={30} />

      {open ? (
        <div className="link-items">
          <LinkContainer linkList={headerLinkList} />
          {admin && (
            <Link to="#" className="link-item">
              관리자
            </Link>
          )}
        </div>
      ) : null}
    </>
  );
};

export default More;
