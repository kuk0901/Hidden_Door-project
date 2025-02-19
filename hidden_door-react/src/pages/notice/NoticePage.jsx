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

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = () => {
    setLoading(true);
    Api.get('/notices')
      .then((response) => {
        if (response.data && response.data.data) {
          if (response.data.data.length === 0) {
            toast.info('등록된 공지사항이 없습니다.');
          }
          setNotices(response.data.data);
        } else {
          setNotices([]);
          toast.info('등록된 공지사항이 없습니다.');
        }
      })
      .catch((error) => {
        console.error('Error fetching notices:', error);
        toast.error('공지사항을 불러오는 데 실패했습니다.');
        setNotices([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNoticeClick = (id) => {
    navigate(`/hidden_door/notice/${id}`);
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
    </div>
  );
}

export default NoticePage;
