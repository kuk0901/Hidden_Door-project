import Header from "@components/common/layout/Header";
import privacy from "@data/privacyPolicy";

import PolicySection from "@components/policy/PolicySection";
import PortfolioDisclaimer from "@components/common/disclaimers/PortfolioDisclaimer";

const PrivacyPolicy = () => {
  return (
    <>
      <Header title="개인정보처리방침" />

      <PortfolioDisclaimer />

      <section className="policy-section">
        <ol className="policy-section__container">
          {privacy.map((section) => (
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

export default PrivacyPolicy;
