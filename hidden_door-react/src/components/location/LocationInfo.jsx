import { FaLocationDot } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { CgPhone } from "react-icons/cg";

const LocationInfo = ({ location, contactInfo, branchName }) => {
  return (
    <section className="simple--info">
      <ul className="info--list">
        <li className="info--item">
          <IoHome className="icon" />
          <span className="title">지점명</span>
          <span className="content">{branchName}</span>
        </li>
        <li className="info--item">
          <FaLocationDot className="icon" />
          <span className="title">주소</span>
          <span>{location}</span>
        </li>
        <li className="info--item">
          <CgPhone className="icon" />
          <span className="title">연락처</span>
          <span className="content">{contactInfo}</span>
        </li>
      </ul>
    </section>
  );
};

export default LocationInfo;
