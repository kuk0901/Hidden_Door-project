import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Api from '@axios/api';

function EditNoticeModal({ isOpen, onClose, onNoticeEdited, notice }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (notice) {
      setTitle(notice.title || '');
      setContent(notice.content || '');
    }
  }, [notice]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const updatedNotice = { ...notice, title, content };
    Api.put(`/api/v1/notices/${notice.id}`, updatedNotice)
      .then((response) => {
        onNoticeEdited(response.data);
        toast.success('공지사항이 수정되었습니다.');
        onClose();
      })
      .catch(() => {
        toast.error('공지사항 수정에 실패했습니다.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>공지사항 수정</h2>
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
            <button type="submit">수정</button>
            <button type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditNoticeModal;
