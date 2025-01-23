import { useState, useRef, useEffect } from "react";
import { useAdmin } from "@hooks/useAdmin";
import { IoIosMenu } from "react-icons/io";
import LinkContainer from "@components/common/navigation/LinkContainer";
import { navLinkList } from "@routes/linkList";
import { Link } from "react-router-dom";

const MobileNavMenu = () => {
  const { admin } = useAdmin();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef}>
      <IoIosMenu onClick={() => setOpen(!open)} size={30} />

      {open && (
        <div className="link-items">
          <LinkContainer
            linkList={navLinkList}
            onClick={() => setOpen(false)}
          />
          {admin && (
            <li className="link-item--last">
              <Link to="#" className="link-item" onClick={() => setOpen(false)}>
                관리자
              </Link>
            </li>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileNavMenu;
