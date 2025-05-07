import { useState, useEffect } from 'react';
import { useAdmin } from '@hooks/useAdmin';
import Api from '@axios/api';
import { toast } from 'react-toastify';
import AddEventModal from './AddEventModal';
import EditEventModal from './EditEventModal';
import { formatKoreanDate } from '../../utils/format/date';

function EventPage() {
  const { admin } = useAdmin();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await Api.get('/events');

      if (response.status !== 200) {
        toast.error('이벤트 정보를 불러오는데 실패했습니다.');
        setEvents([]);
        return;
      }

      const eventsData = response.data?.data;
      if (eventsData && eventsData.length > 0) {
        setEvents(eventsData);
      } else {
        setEvents([]);
        toast.info('등록된 이벤트가 없습니다.');
      }
    } catch (error) {
      toast.error(
        error.message ||
          '이벤트를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    if (!admin) return;
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEvent(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeDetailModal = () => {
    setSelectedEvent(null);
  };

  const handleEventEdited = (editedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.eventId === editedEvent.eventId ? editedEvent : event
      )
    );
    if (selectedEvent?.eventId === editedEvent.eventId) {
      setSelectedEvent(editedEvent);
    }
  };

  const deleteEvent = async (eventId) => {
    if (!admin) return;

    try {
      const response = await Api.delete(`/events/${eventId}`);

      if (response.status === 200) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.eventId !== eventId)
        );
        toast.success(
          response.data.message || '이벤트가 성공적으로 삭제되었습니다.'
        );
        closeDetailModal();
        fetchEvents();
      } else {
        toast.error(
          handleResponseError(response.status, response.data.message)
        );
      }
    } catch (error) {
      toast.error(error.message || '이벤트 삭제에 실패했습니다.');
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <section className="event-page">
      <h1>이벤트 페이지</h1>
      {admin && (
        <button onClick={openAddModal} className="add-event-btn">
          이벤트 추가
        </button>
      )}
      <div className="event-container">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.eventId} className="event-item">
              <div
                className="event-circle"
                onClick={() => handleEventClick(event)}
              >
                {event.title}
              </div>
            </div>
          ))
        ) : (
          <div className="no-events-message">진행중인 이벤트가 없습니다.</div>
        )}
      </div>

      {/* 상세 보기 모달 */}
      {selectedEvent && (
        <div className="em-event-modal-overlay">
          <div className="em-event-modal">
            <h2 className="em-modal-title">{selectedEvent.title}</h2>
            <p className="em-modal-description">{selectedEvent.description}</p>
            <p className="em-modal-dates">
              {selectedEvent.isOngoing === 'true'
                ? '상시'
                : selectedEvent.noEndDate === 'true'
                ? `기간 : ${formatKoreanDate(
                    selectedEvent.startDate
                  )} ~ 종료일 미정`
                : `기간 : ${formatKoreanDate(
                    selectedEvent.startDate
                  )} ~ ${formatKoreanDate(selectedEvent.endDate)}`}
            </p>
            <div className="em-modal-btn-container">
              <button
                className="em-modal-btn em-modal-btn--cancel"
                onClick={closeDetailModal}
              >
                닫기
              </button>
              {admin && (
                <>
                  <button
                    className="em-modal-btn em-modal-btn--edit"
                    onClick={() => openEditModal(selectedEvent)}
                  >
                    수정
                  </button>
                  <button
                    className="em-modal-btn em-modal-btn--delete"
                    onClick={() => deleteEvent(selectedEvent.eventId)}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 추가 모달 */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onEventAdded={(newEvent) =>
          setEvents((prevEvents) => [...prevEvents, newEvent])
        }
      />

      {/* 수정 모달 */}
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onEventEdited={handleEventEdited}
        event={editingEvent}
      />
    </section>
  );
}

export default EventPage;
