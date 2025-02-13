import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Api from '@axios/api';

function EditNoticePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Api.get(`/api/v1/notices/${id}`)
      .then((response) => {
        const notice = response.data;
        setTitle(notice.title);
        setContent(notice.content);
      })
      .catch((error) => {
        console.error('Error fetching notice:', error);
        toast.error('공지사항을 불러오는 데 실패했습니다.');
        navigate('/hidden_door/notice');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const updatedNotice = { title, content };
    Api.put(`/api/v1/notices/${id}`, updatedNotice)
      .then(() => {
        toast.success('공지사항이 수정되었습니다.');
        navigate('/hidden_door/notice');
      })
      .catch((error) => {
        console.error('Error updating notice:', error);
        toast.error('공지사항 수정에 실패했습니다.');
      });
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="edit-notice-page">
      <h2 className="edit-notice-title">공지사항 수정</h2>
      <form onSubmit={handleSubmit} className="edit-notice-form">
        <div className="edit-notice-form-group">
          <label htmlFor="title" className="edit-notice-form-label">
            제목
          </label>
          <input
            type="text"
            id="title"
            className="edit-notice-form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="edit-notice-form-group">
          <label htmlFor="content" className="edit-notice-form-label">
            내용
          </label>
          <textarea
            id="content"
            className="edit-notice-form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="edit-notice-form-buttons">
          <button
            type="submit"
            className="edit-notice-btn edit-notice-btn-submit"
          >
            수정
          </button>
          <button
            type="button"
            className="edit-notice-btn edit-notice-btn-cancel"
            onClick={() => navigate('/hidden_door/notice')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditNoticePage;
