const CustoemrDetail = ({ customerDetail }) => {
  if (!customerDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="faq-detail">
      <div className="faq-title-div">
        <p className="faq-title p">제목: {customerDetail.customerTitle}</p>
        <p className="faq-credate-p">
          질문날짜: {customerDetail.kstQueCreDate}
        </p>
      </div>

      <p className="faq-que-p">질문: {customerDetail.customerContent}</p>

      {customerDetail.customerCheck === "O" ? (
        <>
          <p className="faq-ans-p">답변: {customerDetail.customerAnswer}</p>
          <p className="faq-credate-p">
            답변날짜: {customerDetail.kstAnsCreDate}
          </p>
        </>
      ) : (
        <p className="faq-ans-p">답변이 준비중입니다</p>
      )}
    </div>
  );
};

export default CustoemrDetail;
