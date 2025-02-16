import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Api from '@axios/api';

function AddNoticePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const newNotice = { title, content };
    Api.post('/api/v1/notices', newNotice)
      .then(() => {
        toast.success('공지사항이 추가되었습니다.');
        navigate('/hidden_door/notice');
      })
      .catch((error) => {
        console.error('Error adding notice:', error);
        toast.error('공지사항 추가에 실패했습니다.');
      });
  };

  return (
    <div className="add-notice-page">
      <h2 className="add-notice-title">새 공지사항 추가</h2>
      <form onSubmit={handleSubmit} className="add-notice-form">
        <div className="add-notice-form-group">
          <label htmlFor="title" className="add-notice-form-label">
            제목
          </label>
          <input
            type="text"
            id="title"
            className="add-notice-form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="add-notice-form-group">
          <label htmlFor="content" className="add-notice-form-label">
            내용
          </label>
          <textarea
            id="content"
            className="add-notice-form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="add-notice-form-buttons">
          <button
            type="submit"
            className="add-notice-btn add-notice-btn-submit"
          >
            추가
          </button>
          <button
            type="button"
            className="add-notice-btn add-notice-btn-cancel"
            onClick={() => navigate('/hidden_door/notice')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNoticePage;
