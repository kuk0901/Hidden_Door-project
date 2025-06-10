const FaqDetail = ({ faqDetail }) => {
  if (!faqDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="faq-detail">
      <div className="faq-title-div">
        <p className="faq-title p">제목: {faqDetail.title}</p>
        <p className="faq-credate-p">작성날짜: {faqDetail.kstModDate}</p>
      </div>

      <p className="faq-que-p">질문: {faqDetail.question}</p>
      <p className="faq-ans-p">답변: {faqDetail.answer}</p>
    </div>
  );
};

export default FaqDetail;
