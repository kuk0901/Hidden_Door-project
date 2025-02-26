import { useState, useEffect } from 'react';
import { useAdmin } from '@hooks/useAdmin';
import Api from '@axios/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function NoticePage() {
  const { admin } = useAdmin();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // 0부터 시작
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage]);

  const fetchNotices = (page) => {
    setLoading(true);
    Api.get(`/notices?page=${page}&size=${itemsPerPage}`)
      .then((response) => {
        if (response.data && response.data.data) {
          const { content, totalPages } = response.data.data;
          if (content.length === 0) {
            toast.info('등록된 공지사항이 없습니다.');
          }
          setNotices(content);
          setTotalPages(totalPages);
        } else {
          setNotices([]);
          setTotalPages(0);
          toast.info('등록된 공지사항이 없습니다.');
        }
      })
      .catch((error) => {
        console.error('Error fetching notices:', error);
        toast.error('공지사항을 불러오는 데 실패했습니다.');
        setNotices([]);
        setTotalPages(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNoticeClick = (id) => {
    navigate(`/hidden_door/notice/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5;
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + maxPageNumbers - 1);

    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(0, endPage - maxPageNumbers + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          이전
        </button>
        {pageNumbers}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          다음
        </button>
      </div>
    );
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="notice-page">
      <h1 className="notice-page-title">공지사항</h1>
      {admin && (
        <button
          onClick={() => navigate('/hidden_door/notice/add')}
          className="add-notice-btn"
        >
          공지사항 추가
        </button>
      )}
      <div className="notice-list">
        <ul>
          {notices.map((notice) => (
            <li
              key={notice.id}
              className="notice-item"
              onClick={() => handleNoticeClick(notice.id)}
            >
              <div className="notice-title">{notice.title}</div>
              <div className="notice-date">
                {new Date(notice.createdAt).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {renderPagination()}
    </div>
  );
}

export default NoticePage;
