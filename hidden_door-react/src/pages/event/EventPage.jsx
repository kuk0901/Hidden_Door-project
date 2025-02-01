import { useState, useEffect } from 'react';
import { useAdmin } from '@hooks/useAdmin';
import Api from '@axios/api';
import { toast } from 'react-toastify';
import AddEventModal from './AddEventModal';

function EventPage() {
  const { admin } = useAdmin();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    Api.get('/api/v1/events')
      .then((response) => {
        if (response.data.length === 0) {
          toast.info('등록된 이벤트가 없습니다.');
        }
        setEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
        toast.error('이벤트를 불러오는 데 실패했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const openAddModal = () => {
    if (!admin) return;
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleEventAdded = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const deleteEvent = (id) => {
    if (!admin) return;

    Api.delete(`/api/v1/events/${id}`)
      .then(() => {
        setEvents(events.filter((event) => event.id !== id));
        if (selectedEvent && selectedEvent.id === id) {
          closeModal();
        }
        toast.success('이벤트가 삭제되었습니다.');
      })
      .catch(() => {
        toast.error('이벤트 삭제에 실패했습니다.');
      });
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="event-page">
      <h1>이벤트 페이지</h1>
      {admin && (
        <button onClick={openAddModal} className="add-event-btn">
          이벤트 추가
        </button>
      )}
      <div className="event-container">
        {events.map((event) => (
          <div key={event.id} className="event-item">
            <div
              className="event-circle"
              onClick={() => handleEventClick(event)}
            >
              {event.title}
            </div>
            {admin && (
              <button
                onClick={() => deleteEvent(event.id)}
                className="delete-event-btn"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>
      {selectedEvent && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-modal__msg">
              <h2>{selectedEvent.title}</h2>
              <p>{selectedEvent.description}</p>
            </div>
            <div className="confirm-modal__btn-container">
              <button
                className="confirm-modal__btn confirm-modal__btn--cancel"
                onClick={closeModal}
              >
                닫기
              </button>
              {admin && (
                <button className="confirm-modal__btn confirm-modal__btn--confirm">
                  수정
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onEventAdded={handleEventAdded}
      />
    </div>
  );
}

export default EventPage;
