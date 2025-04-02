import { useState, useEffect } from "react";
import { useAdmin } from "@hooks/useAdmin";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { formatKoreanDate } from "../../utils/format/date";
import Pagination from "@components/common/navigation/pagination/Pagination";

function NoticePage() {
  const { admin } = useAdmin();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 페이지 정보 객체로 관리
  const [page, setPage] = useState({
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 1, // 최소 1페이지로 설정
    isFirst: true,
    isLast: true
  });

  useEffect(() => {
    fetchNotices(page.page);
  }, [page.page]);

  // XXX: 메서드 체이닝 형식 말고 async-await 문법으로 변경해 주세요.
  const fetchNotices = (currentPage) => {
    setLoading(true);
    Api.get(`/notices?page=${currentPage - 1}&size=${page.size}`) // 여기서 currentPage - 1을 사용
      .then((response) => {
        if (response.data.data) {
          const { content, page: pageInfo } = response.data.data;

          if (content.length === 0 && currentPage > 1) {
            // 데이터가 없는 페이지로 이동했을 때 이전 페이지로 돌아갑니다.
            fetchNotices(currentPage - 1);
            return;
          }

          setNotices(content);

          // 페이지 정보 업데이트
          setPage((prev) => ({
            ...prev,
            ...pageInfo,
            page: currentPage, // 요청한 페이지 번호를 사용
            isFirst: currentPage === 1,
            isLast: currentPage === pageInfo.totalPages
          }));
        } else {
          setNotices([]);
          toast.info("등록된 공지사항이 없습니다.");
        }
      })
      .catch((error) => {
        console.error("Error fetching notices:", error);
        toast.error("공지사항을 불러오는 데 실패했습니다.");
        setNotices([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNoticeClick = (id) => {
    navigate(`/hidden_door/notice/${id}`);
  };

  const handlePageChange = (newPage) => {
    setPage((prev) => ({ ...prev, page: newPage }));
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="notice-page">
      <h1 className="notice-page-title">공지사항</h1>
      {admin && (
        <button
          onClick={() => navigate("/hidden_door/notice/add")}
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
                {formatKoreanDate(notice.createdAt)}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination 컴포넌트 사용 */}
      <Pagination page={page} onPageChange={handlePageChange} />
    </div>
  );
}

export default NoticePage;
