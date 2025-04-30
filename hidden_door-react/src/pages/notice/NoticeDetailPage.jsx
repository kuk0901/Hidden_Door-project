import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '@hooks/useAdmin';
import Api from '@axios/api';
import { toast } from 'react-toastify';
import { formatKoreanDate } from '../../utils/format/date';

function NoticeDetailPage() {
  const { noticeId } = useParams();
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleResponseError = (status, message) => {
    const errorMessages = {
      400: message || '잘못된 요청입니다.',
      401: message || '유효하지 않은 인증정보입니다. 다시 로그인해주세요.',
      403: message || '접근 권한이 없습니다. 관리자에게 문의하세요.',
      404: message || '요청하신 리소스를 찾을 수 없습니다.',
      default:
        message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    };

    return errorMessages[status] || errorMessages.default;
  };

  const fetchNotice = async () => {
    setLoading(true);

    try {
      const response = await Api.get(`/notices/${noticeId}`);

      if (response.status === 200) {
        if (response.data?.data) {
          setNotice(response.data.data);
        } else {
          toast.info('해당 공지사항을 찾을 수 없습니다.');
          navigate('/hidden_door/notice');
        }
      } else {
        toast.error(
          handleResponseError(response.status, response.data.message)
        );
        navigate('/hidden_door/notice');
      }
    } catch (error) {
      toast.error(
        error.message || '네트워크 문제로 공지사항 조회에 실패하였습니다.'
      );
      navigate('/hidden_door/notice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotice();
  }, [noticeId]);

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const updatedNotice = { title: editTitle, content: editContent };

    try {
      const response = await Api.put(`/notices/${noticeId}`, updatedNotice);

      if (response.status === 200) {
        if (response.data?.data) {
          toast.success(response.data.message || '공지사항이 수정되었습니다.');
          setNotice(response.data.data);
          setIsEditing(false);
        } else {
          toast.error('서버 응답 형식이 올바르지 않습니다.');
        }
      } else {
        toast.error(
          handleResponseError(response.status, response.data.message)
        );
      }
    } catch (error) {
      toast.error(error.message || '공지사항 수정에 실패하였습니다.');
    }
  };

  const deleteNotice = async (noticeId) => {
    try {
      const response = await Api.delete(`/notices/${noticeId}`);

      if (response.status === 200) {
        toast.success(
          response.data.message || '공지사항이 성공적으로 삭제되었습니다.'
        );
        navigate('/hidden_door/notice', { state: { shouldRefresh: true } });
      } else {
        toast.error(
          handleResponseError(response.status, response.data.message)
        );
      }
    } catch (error) {
      toast.error(error.message || '공지사항 삭제에 실패하였습니다.');
    }
  };

  const handleBackToList = () => {
    navigate('/hidden_door/notice', {
      state: { page: { page: 1, size: 10 }, shouldRefresh: true },
    });
  };

  if (loading) return <div>로딩 중...</div>;
  if (!notice) return <div>공지사항을 찾을 수 없습니다.</div>;

  return (
    <section className="notice-detail-page">
      <h1 className="notice-title">{notice.title}</h1>
      <div className="notice-info">
        <span>작성일: {formatKoreanDate(notice.createdAt)}</span>
      </div>
      <div
        className="notice-content"
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />
      <div className="notice-actions">
        <button onClick={handleBackToList} className="notice-btn btn-back">
          목록으로
        </button>
        {admin && (
          <>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="notice-btn btn-edit"
              >
                수정
              </button>
            )}
            <button
              onClick={() => deleteNotice(noticeId)}
              className="notice-btn btn-delete"
            >
              삭제
            </button>
          </>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmitEdit} className="edit-notice-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="제목"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="내용"
          />
          <button type="submit">저장</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            취소
          </button>
        </form>
      )}
    </section>
  );
}

export default NoticeDetailPage;
