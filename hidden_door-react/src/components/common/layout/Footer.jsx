import LinkContainer from "@components/common/navigation/LinkContainer";
import { csLinkList, securityLinkList } from "@routes/linkList";
import { useEscapeRoom } from "@hooks/useEscapeRoom";

const Footer = () => {
  const { escapeRoom } = useEscapeRoom();

  return (
    <footer className="footer">
      <section className="company-info">
        <ul className="list-container-col">
          <li>상호: {escapeRoom.roomName}</li>
          <li>대표자</li>
          <li>연락처: {escapeRoom.contactInfo}</li>
          <li>주소: {escapeRoom.location}</li>
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
