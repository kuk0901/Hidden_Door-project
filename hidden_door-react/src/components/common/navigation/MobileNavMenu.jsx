import { useState, useRef, useEffect } from "react";
import { useAdmin } from "@hooks/useAdmin";
import { IoIosMenu } from "react-icons/io";
import LinkContainer from "@components/common/navigation/LinkContainer";
import { navLinkList, adminLinkList } from "@routes/linkList";

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

  const handleClose = () => setOpen(false);

  const combinedLinkList = admin
    ? [...navLinkList, ...adminLinkList]
    : navLinkList;

  return (
    <div ref={menuRef}>
      <IoIosMenu onClick={() => setOpen(!open)} size={30} />

      {open && (
        <div className="link-items">
          <LinkContainer linkList={combinedLinkList} onClick={handleClose} />
        </div>
      )}
    </div>
  );
};

export default MobileNavMenu;
