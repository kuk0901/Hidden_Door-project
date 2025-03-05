const CustoemrDetail = ({ customerDetail }) => {
  if (!customerDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="faq-detail">
      <p>제목: {customerDetail.customerTitle}</p>
      <p>질문: {customerDetail.customerContent}</p>
      <p>질문날짜: {customerDetail.kstQueCreDate}</p>
      {customerDetail.customerCheck === "o" ? (
        <>
          <p>답변: {customerDetail.customerAnswer}</p>
          <p>답변날짜: {customerDetail.kstAnsCreDate}</p>
        </>
      ) : (
        <p>답변이 준비중입니다</p>
      )}
    </div>
  );
};

export default CustoemrDetail;
