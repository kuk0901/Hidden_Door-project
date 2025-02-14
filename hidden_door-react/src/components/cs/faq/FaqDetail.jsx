const FaqDetail = ({ faqDetail }) => {
  if (!faqDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="faq-detail">
      <h1>FAQ 정보</h1>
      <p>작성자: {faqDetail.writer}</p>
      <p>카테고리: {faqDetail.category}</p>
      <p>제목: {faqDetail.title}</p>
      <p>질문: {faqDetail.question}</p>
      <p>답변: {faqDetail.answer}</p>
      <p>작성날짜: {faqDetail.kstModDate}</p>
    </div>
  );
};

export default FaqDetail;
