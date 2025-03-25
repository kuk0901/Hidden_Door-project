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
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error('제목과 설명을 모두 입력해주세요.');
      return;
    }

    if (startDate > endDate) {
      toast.error('종료일은 시작일 이후로 설정해주세요.');
      return;
    }

    const updatedEvent = {
      id: event.id,
      title,
      description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    Api.put(`/events/${event.id}`, updatedEvent)
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
          <div className="em-form-group">
            <label className="em-form-label">이벤트 기간</label>
            <div className="date-picker-container">
              <div className="event-calendar-wrapper">
                <p className="event-calendar-label">시작일</p>
                <Calendar
                  onChange={setStartDate}
                  value={startDate}
                  minDate={new Date()}
                  className="em-form-calendar react-calendar"
                />
              </div>
              <div className="event-calendar-wrapper">
                <p className="event-calendar-label">종료일</p>
                <Calendar
                  onChange={setEndDate}
                  value={endDate}
                  minDate={startDate}
                  className="em-form-calendar react-calendar"
                />
              </div>
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
