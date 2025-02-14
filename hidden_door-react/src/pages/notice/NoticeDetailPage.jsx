import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '@hooks/useAdmin';
import Api from '@axios/api';
import { toast } from 'react-toastify';

function NoticeDetailPage() {
  const { id } = useParams();
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = () => {
    setLoading(true);
    Api.get(`/api/v1/notices/${id}`)
      .then((response) => {
        if (response.data) {
          setNotice(response.data);
        } else {
          toast.info('해당 공지사항을 찾을 수 없습니다.');
          navigate('/hidden_door/notice');
        }
      })
      .catch((error) => {
        console.error('Error fetching notice:', error);
        toast.error('공지사항을 불러오는 데 실패했습니다.');
        navigate('/hidden_door/notice');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteNotice = () => {
    if (!admin) return;

    Api.delete(`/api/v1/notices/${id}`)
      .then(() => {
        toast.success('공지사항이 삭제되었습니다.');
        navigate('/hidden_door/notice');
      })
      .catch(() => {
        toast.error('공지사항 삭제에 실패했습니다.');
      });
  };

  if (loading) return <div>로딩 중...</div>;
  if (!notice) return <div>공지사항을 찾을 수 없습니다.</div>;

  return (
    <div className="notice-detail-page">
      <h1>{notice.title}</h1>
      <div className="notice-info">
        <span>작성일: {new Date(notice.createdAt).toLocaleDateString()}</span>
      </div>
      <div
        className="notice-content"
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />
      <div className="notice-actions">
        <Link to="/hidden_door/notice" className="btn btn-back">
          목록으로
        </Link>
        {admin && (
          <>
            <Link
              to={`/hidden_door/notice/edit/${id}`}
              className="btn btn-edit"
            >
              수정
            </Link>
            <button onClick={deleteNotice} className="btn btn-delete">
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default NoticeDetailPage;
