import Header from "@components/common/layout/Header";
import service from "@data/termsOfService";
import PolicySection from "@components/policy/PolicySection";
import PortfolioDisclaimer from "@components/common/PortfolioDisclaimer";

const TermsOfService = () => {
  return (
    <>
      <Header title="개인정보처리방침" />

      <PortfolioDisclaimer />

      <section className="policy-section">
        <ol className="policy-section__container">
          {service.map((section) => (
            <PolicySection
              key={section.id}
              title={section.title}
              content={section.content}
            />
          ))}
        </ol>
      </section>
    </>
  );
};

export default TermsOfService;
