import { useState } from 'react';
import { toast } from 'react-toastify';
import Api from '@axios/api';

function AddEventModal({ isOpen, onClose, onEventAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error('제목과 설명을 모두 입력해주세요.');
      return;
    }

    const newEvent = { title, description };
    Api.post('/api/v1/events', newEvent)
      .then((response) => {
        onEventAdded(response.data);
        toast.success('이벤트가 추가되었습니다.');
        onClose();
      })
      .catch(() => {
        toast.error('이벤트 추가에 실패했습니다.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>새 이벤트 추가</h2>
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
            <label htmlFor="description">설명</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

export default AddEventModal;
