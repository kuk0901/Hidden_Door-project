import LinkContainer from "@components/common/navigation/LinkContainer";
import { csLinkList } from "@routes/linkList";
import { securityLinkList } from "../../../routes/linkList";

const Footer = () => {
  return (
    <footer className="footer">
      <section className="company-info">
        <ul className="list-container-col">
          <li>상호</li>
          <li>대표자</li>
          <li>이메일</li>
          <li>주소</li>
        </ul>
      </section>
      <section className="customer-service">
        <ul className="link-container-col">
          <LinkContainer linkList={csLinkList} />
        </ul>
      </section>
      <section className="security">
        <ul className="link-container-col">
          <LinkContainer linkList={securityLinkList} />
        </ul>
      </section>
    </footer>
  );
};

export default Footer;
