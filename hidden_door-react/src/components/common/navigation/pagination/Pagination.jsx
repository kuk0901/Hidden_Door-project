const Pagination = ({ page, onPageChange }) => {
  // if (!page || page.totalPages <= 1) return null;

  const currentPage = page.page;
  const totalPages = page.totalPages;
  const pageNumbers = [];
  const pageWindow = 5; // 표시할 페이지 번호의 개수

  let startPage = Math.max(currentPage - Math.floor(pageWindow / 2), 1);
  let endPage = startPage + pageWindow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - pageWindow + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="page-nav first bold"
      >
        처음
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-nav prev bold"
      >
        이전
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`bold page-number ${
            currentPage === number ? "active" : ""
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-nav next bold"
      >
        다음
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="page-nav last bold"
      >
        마지막
      </button>
    </div>
  );
};

export default Pagination;
