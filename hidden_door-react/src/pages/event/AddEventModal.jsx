import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Api from '@axios/api';

function AddEventModal({ isOpen, onClose, onEventAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 모달이 열리거나 닫힐 때 입력 필드 초기화
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error('제목과 설명을 모두 입력해주세요.');
      return;
    }

    const newEvent = { title, description };
    Api.post('/api/v1/events', newEvent)
      .then((response) => {
        if (response.data && response.data.data) {
          onEventAdded(response.data.data);
          toast.success(response.data.message || '이벤트가 추가되었습니다.');
          onClose();
          // 입력 필드 초기화
          setTitle('');
          setDescription('');
        } else {
          toast.error('서버 응답 형식이 올바르지 않습니다.');
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || '이벤트 추가에 실패했습니다.'
        );
      });
  };

  if (!isOpen) return null;

  return (
    <div className="em-event-modal-overlay">
      <div className="em-event-modal">
        <h2 className="em-modal-title">새 이벤트 추가</h2>
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
            <button
              type="submit"
              className="em-modal-btn em-modal-btn--confirm"
            >
              추가
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                setTitle('');
                setDescription('');
              }}
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

export default AddEventModal;
