import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Api from '@axios/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function AddEventModal({ isOpen, onClose, onEventAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isOngoing, setIsOngoing] = useState(false);
  const [noEndDate, setNoEndDate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(new Date());
    setEndDate(new Date());
    setIsOngoing(false);
    setNoEndDate(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error('제목과 설명을 모두 입력해주세요.');
      return;
    }

    if (!isOngoing && !noEndDate && startDate > endDate) {
      toast.error('종료일은 시작일 이후로 설정해주세요.');
      return;
    }

    const newEvent = {
      title,
      description,
      isOngoing,
      noEndDate,
      eventType: isOngoing ? '상시' : noEndDate ? '종료일 미정' : '기간 지정',
      startDate: isOngoing ? null : startDate.toISOString().split('T')[0],
      endDate:
        isOngoing || noEndDate ? null : endDate.toISOString().split('T')[0],
    };

    try {
      const response = await Api.post('/events', newEvent);

      if (response.status !== 200) {
        toast.error(
          response.data?.message ||
            '이벤트 추가에 실패했습니다. 잠시 후 다시 시도해 주세요.'
        );
        return;
      }

      toast.success(
        response.data.message || '이벤트가 성공적으로 추가되었습니다.'
      );
      onEventAdded(response.data.data);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error(
        error.message || '네트워크 문제로 이벤트 추가에 실패했습니다.'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <section className="em-event-modal-overlay">
      <div className="em-event-modal">
        <h2 className="em-modal-title">새 이벤트 추가</h2>
        <form onSubmit={handleSubmit} className="em-modal-form">
          <div className="em-form-group">
            <label htmlFor="title" id="em-form-label">
              제목
            </label>
            <input
              type="text"
              id="em-form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="제목을 입력해주세요"
            />
          </div>

          <div className="em-form-group">
            <label htmlFor="description" id="em-form-label">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              id="em-form-textarea"
              placeholder="설명을 입력해주세요"
            />
          </div>

          <div className="em-form-group">
            <label className="em-form-label">이벤트 기간</label>
            <div className="date-picker-container">
              <div className="event-calendar-wrapper">
                <p className="event-calendar-label">시작일</p>
                <Calendar
                  onChange={setStartDate}
                  value={startDate}
                  minDate={new Date()}
                  className={`em-form-calendar react-calendar ${
                    isOngoing ? 'disabled' : ''
                  }`}
                  disabled={isOngoing}
                />
              </div>

              <div className="event-calendar-wrapper">
                <p className="event-calendar-label">종료일</p>
                <Calendar
                  onChange={setEndDate}
                  value={endDate}
                  minDate={startDate}
                  className={`em-form-calendar react-calendar ${
                    isOngoing || noEndDate ? 'disabled' : ''
                  }`}
                  disabled={isOngoing || noEndDate}
                />
              </div>
            </div>
          </div>

          <div className="em-form-group">
            <label className="em-form-label">이벤트 유형</label>
            <div>
              <label className="eventDate_checkbox">
                <input
                  type="checkbox"
                  checked={isOngoing}
                  onChange={(e) => {
                    setIsOngoing(e.target.checked);
                    if (e.target.checked) {
                      setNoEndDate(false);
                    }
                  }}
                />
                상시
              </label>
              <label className="eventDate_checkbox">
                <input
                  type="checkbox"
                  checked={noEndDate}
                  onChange={(e) => {
                    setNoEndDate(e.target.checked);
                    if (e.target.checked) {
                      setIsOngoing(false);
                    }
                  }}
                />
                종료 기한 정하지 않음
              </label>
            </div>
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
                resetForm();
              }}
              className="em-modal-btn em-modal-btn--cancel"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddEventModal;
