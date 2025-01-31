import { useState } from 'react';
import { toast } from 'react-toastify';
import Api from '@axios/api';

function AddNoticeModal({ isOpen, onClose, onNoticeAdded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const newNotice = { title, content };
    Api.post('/api/v1/notices', newNotice)
      .then((response) => {
        onNoticeAdded(response.data);
        toast.success('공지사항이 추가되었습니다.');
        onClose();
      })
      .catch(() => {
        toast.error('공지사항 추가에 실패했습니다.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>새 공지사항 추가</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit">추가</button>
            <button type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNoticeModal;
