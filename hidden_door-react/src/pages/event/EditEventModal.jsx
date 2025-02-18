import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Api from '@axios/api';

function EditEventModal({ isOpen, onClose, onEventEdited, event }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 이벤트 데이터가 변경될 때마다 폼에 값을 채워줌
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error('제목과 설명을 모두 입력해주세요.');
      return;
    }

    const updatedEvent = { id: event.id, title, description };
    Api.put(`/api/v1/events/${event.id}`, updatedEvent)
      .then((response) => {
        if (response.data && response.data.data) {
          onEventEdited(response.data.data);
          toast.success(response.data.message || '이벤트가 수정되었습니다.');
          onClose();
        } else {
          toast.error('서버 응답 형식이 올바르지 않습니다.');
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || '이벤트 수정에 실패했습니다.'
        );
      });
  };

  if (!isOpen) return null;

  return (
    <div className="em-event-modal-overlay">
      <div className="em-event-modal">
        <h2 className="em-modal-title">이벤트 수정</h2>
        <form onSubmit={handleSubmit} className="em-modal-form">
          <div className="em-form-group">
            <label htmlFor="title" className="em-form-label">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="em-form-input"
            />
          </div>
          <div className="em-form-group">
            <label htmlFor="description" className="em-form-label">
              설명
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="em-form-textarea"
            />
          </div>
          <div className="em-modal-btn-container">
            <button type="submit" className="em-modal-btn em-modal-btn--edit">
              수정
            </button>
            <button
              type="button"
              onClick={onClose}
              className="em-modal-btn em-modal-btn--cancel"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEventModal;
