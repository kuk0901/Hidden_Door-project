import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Api from '@axios/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function EditEventModal({ isOpen, onClose, onEventEdited, event }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isOngoing, setIsOngoing] = useState('false');
  const [noEndDate, setNoEndDate] = useState('false');

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setStartDate(
        event.startDate && !isNaN(new Date(event.startDate))
          ? new Date(event.startDate)
          : new Date()
      );
      setEndDate(
        event.endDate && !isNaN(new Date(event.endDate))
          ? new Date(event.endDate)
          : new Date()
      );
      setIsOngoing(event.isOngoing || 'false');
      setNoEndDate(event.noEndDate || 'false');
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error('제목과 설명을 모두 입력해주세요.');
      return;
    }

    if (isOngoing !== 'true' && noEndDate !== 'true' && startDate > endDate) {
      toast.error('종료일은 시작일 이후로 설정해주세요.');
      return;
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!title.trim() || !description.trim()) {
        toast.error('제목과 설명을 모두 입력해주세요.');
        return;
      }

      if (isOngoing !== 'true' && noEndDate !== 'true' && startDate > endDate) {
        toast.error('종료일은 시작일 이후로 설정해주세요.');
        return;
      }

      const updatedEvent = {
        id: event.eventId,
        title,
        description,
        startDate:
          isOngoing === 'true' ? null : startDate.toISOString().split('T')[0],
        endDate:
          isOngoing === 'true' || noEndDate === 'true'
            ? null
            : endDate.toISOString().split('T')[0],
        isOngoing,
        noEndDate,
      };

      try {
        const response = await Api.put(
          `/events/${event.eventId}`,
          updatedEvent
        );

        if (response.data && response.data.data) {
          onEventEdited(response.data.data);
          toast.success(response.data.message || '이벤트가 수정되었습니다.');
          onClose();
        } else {
          toast.error('서버 응답 형식이 올바르지 않습니다.');
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || '이벤트 수정에 실패했습니다.'
        );
      }
    };
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
              placeholder="제목을 입력해주세요"
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
                    isOngoing === 'true' ? 'disabled' : ''
                  }`}
                  disabled={isOngoing === 'true'}
                />
              </div>

              <div className="event-calendar-wrapper">
                <p className="event-calendar-label">종료일</p>
                <Calendar
                  onChange={setEndDate}
                  value={endDate}
                  minDate={startDate}
                  className={`em-form-calendar react-calendar ${
                    isOngoing === 'true' || noEndDate === 'true'
                      ? 'disabled'
                      : ''
                  }`}
                  disabled={isOngoing === 'true' || noEndDate === 'true'}
                />
              </div>
            </div>
          </div>

          <div className="em-form-group">
            <label className="em-form-label">이벤트 유형</label>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={isOngoing === 'true'}
                  onChange={(e) => {
                    setIsOngoing(e.target.checked ? 'true' : 'false');
                    if (e.target.checked) {
                      setNoEndDate('false');
                    }
                  }}
                />
                상시
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={noEndDate === 'true'}
                  onChange={(e) => {
                    setNoEndDate(e.target.checked ? 'true' : 'false');
                    if (e.target.checked) {
                      setIsOngoing('false');
                    }
                  }}
                />
                종료 기한 정하지 않음
              </label>
            </div>
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
