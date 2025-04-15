import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  const fetchNotice = async () => {
    setLoading(true);

    try {
      const response = await Api.get(`/notices/${id}`);

      if (response.status === 200) {
        if (response.data?.data) {
          setNotice(response.data.data);
          // 수정 모드 활성화 시 기존 데이터 설정
          setEditTitle(response.data.data.title);
          setEditContent(response.data.data.content);
        } else {
          toast.info('해당 공지사항을 찾을 수 없습니다.');
          navigate('/hidden_door/notice');
        }
      } else {
        toast.error(response.data.message || '공지사항 조회에 실패했습니다.');
        navigate('/hidden_door/notice');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          '네트워크 문제로 공지사항 조회에 실패하였습니다.'
      );
      navigate('/hidden_door/notice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const updatedNotice = { title: editTitle, content: editContent };

    try {
      const response = await Api.put(`/notices/${id}`, updatedNotice);

      if (response.status === 200) {
        toast.success(response.data.message || '공지사항이 수정되었습니다.');
        setNotice(response.data.data);
        setIsEditing(false); // 수정 모드 비활성화
      } else {
        toast.error(response.data.message || '공지사항 수정에 실패하였습니다.');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || '공지사항 수정에 실패하였습니다.'
      );
    }
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
        <button
          onClick={() => navigate('/hidden_door/notice')}
          className="notice-btn btn-back"
        >
          목록으로
        </button>
        {admin && (
          <>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)} // 수정 모드 활성화
                className="notice-btn btn-edit"
              >
                수정
              </button>
            )}
            <button
              onClick={() => deleteNotice(id)}
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
    </div>
  );
}

export default NoticeDetailPage;
