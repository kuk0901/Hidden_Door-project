import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { noticesState, pageState } from '@atoms/noticeAtom';
import { useAdmin } from '@hooks/useAdmin';
import Api from '@axios/api';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatKoreanDate } from '../../utils/format/date';
import Pagination from '@components/common/navigation/pagination/Pagination';

function NoticePage() {
  const location = useLocation();
  const { admin } = useAdmin();
  const [notices, setNotices] = useRecoilState(noticesState);
  const [page, setPage] = useRecoilState(pageState);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (notices.length === 0 || location.state?.shouldRefresh) {
      fetchNotices(page.page);
    }
  }, [page.page, location.state]);

  const fetchNotices = async (currentPage) => {
    setLoading(true);

    try {
      const response = await Api.get(
        `/notices?page=${currentPage - 1}&size=${page.size}`
      );

      if (response.status === 200) {
        const { content, page: pageInfo } = response.data?.data || {};

        setNotices(content || []);
        setPage((prev) => ({
          ...prev,
          ...pageInfo,
          page: currentPage,
          isFirst: currentPage === 1,
          isLast: currentPage === pageInfo?.totalPages,
        }));

        if (!content || content.length === 0) {
          toast.info('등록된 공지사항이 없습니다.');
        }
      } else {
        toast.error(
          response.data.message || '공지사항을 불러오는 데 실패했습니다.'
        );
      }
    } catch (error) {
      toast.error(error.message || '공지사항을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleNoticeClick = (noticeId) => {
    navigate(`/hidden_door/notice/${noticeId}`);
  };

  const handlePageChange = (newPage) => {
    setPage((prev) => ({ ...prev, page: newPage }));
  };

  if (loading) return <div>로딩 중...</div>;

  if (notices.length === 0) {
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
        <div className="no-notice-message">등록된 공지사항이 없습니다.</div>
      </div>
    );
  }

  return (
    <section className="notice-page">
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
              key={notice.noticeId}
              className="notice-item"
              onClick={() => handleNoticeClick(notice.noticeId)}
            >
              <div className="notice-title">{notice.title}</div>
              <div className="notice-date">
                {formatKoreanDate(notice.createdAt)}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Pagination page={page} onPageChange={handlePageChange} />
    </section>
  );
}

export default NoticePage;
