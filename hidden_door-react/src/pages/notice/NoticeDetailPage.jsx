import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '@hooks/useAdmin';
import Api from '@axios/api';
import { toast } from 'react-toastify';
import { formatKoreanDate } from '../../utils/format/date';

function NoticeDetailPage() {
  const { id } = useParams();
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    setLoading(true);

    try {
      const response = await Api.get(`/notices/${id}`);

      if (response.status !== 200) {
        toast.error('서버 요청에 실패했습니다.');
        navigate('/hidden_door/notice');
        return;
      }

      if (response.data?.data) {
        setNotice(response.data.data);
      } else {
        toast.info('해당 공지사항을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching notice:', error);
      toast.error(
        error.response?.data?.message || '공지사항을 불러오는 데 실패했습니다.'
      );
      navigate('/hidden_door/notice');
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = () => {
    if (!admin) return;

    Api.delete(`/notices/${id}`)
      .then((response) => {
        toast.success(response.data?.message || '공지사항이 삭제되었습니다.');
        navigate('/hidden_door/notice');
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || '공지사항 삭제에 실패했습니다.'
        );
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(notice.title);
    setEditContent(notice.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const updatedNotice = { title: editTitle, content: editContent };
    Api.put(`/notices/${id}`, updatedNotice)
      .then((response) => {
        if (response.data && response.data.data) {
          toast.success(response.data.message || '공지사항이 수정되었습니다.');
          setNotice(response.data.data);
          setIsEditing(false);
        } else {
          toast.error('서버 응답 형식이 올바르지 않습니다.');
        }
      })
      .catch((error) => {
        console.error('Error updating notice:', error);
        toast.error(
          error.response?.data?.message || '공지사항 수정에 실패했습니다.'
        );
      });
  };

  if (loading) return <div>로딩 중...</div>;
  if (!notice) return <div>공지사항을 찾을 수 없습니다.</div>;

  return (
    <div className="notice-detail-page">
      <h1 className="notice-title">{notice.title}</h1>
      <div className="notice-info">
        <span>작성일: {formatKoreanDate(notice.createdAt)}</span>
      </div>
      <div
        className="notice-content"
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />
      <div className="notice-actions">
        <Link to="/hidden_door/notice" className="notice-btn btn-back">
          목록으로
        </Link>
        {admin && (
          <>
            {!isEditing && (
              <button onClick={handleEdit} className="notice-btn btn-edit">
                수정
              </button>
            )}
            <button onClick={deleteNotice} className="notice-btn btn-delete">
              삭제
            </button>
          </>
        )}
      </div>

      {isEditing && (
        <div className="edit-notice-page">
          <h2 className="edit-notice-title">공지사항 수정</h2>
          <form onSubmit={handleSubmitEdit} className="edit-notice-form">
            <div className="edit-notice-form-group">
              <label htmlFor="editTitle" className="edit-notice-form-label">
                제목
              </label>
              <input
                type="text"
                id="editTitle"
                className="edit-notice-form-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div className="edit-notice-form-group">
              <label htmlFor="editContent" className="edit-notice-form-label">
                내용
              </label>
              <textarea
                id="editContent"
                className="edit-notice-form-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
              />
            </div>
            <div className="edit-notice-form-buttons">
              <button
                type="submit"
                className="edit-notice-btn edit-notice-btn-submit"
              >
                수정 완료
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="edit-notice-btn edit-notice-btn-cancel"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default NoticeDetailPage;
