import { useState, useEffect } from 'react';
import { useAdmin } from '@hooks/useAdmin';
import Api from '@axios/api';
import { toast } from 'react-toastify';
import AddEventModal from './AddEventModal';
import EditEventModal from './EditEventModal';

function EventPage() {
  const { admin } = useAdmin();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

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
      .catch(() => {
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

  const openEditModal = (event) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEvent(null);
  };

  const handleEventEdited = (editedEvent) => {
    Api.put(`/api/v1/events/${editedEvent.id}`, editedEvent)
      .then((response) => {
        setEvents(
          events.map((event) =>
            event.id === editedEvent.id ? response.data : event
          )
        );
        closeEditModal();
        if (selectedEvent && selectedEvent.id === editedEvent.id) {
          setSelectedEvent(response.data);
        }
        toast.success('이벤트가 수정되었습니다.');
      })
      .catch((error) => {
        console.error('Error editing event:', error);
        toast.error('이벤트 수정에 실패했습니다.');
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
          </div>
        ))}
      </div>
      {selectedEvent && (
        <div className="event-modal-overlay">
          <div className="event-modal">
            <div className="event-modal__msg">
              <h2>{selectedEvent.title}</h2>
              <p>{selectedEvent.description}</p>
            </div>
            <div className="event-modal__btn-container">
              <button
                className="event-modal__btn event-modal__btn--cancel"
                onClick={closeModal}
              >
                닫기
              </button>
              {admin && (
                <>
                  <button
                    className="event-modal__btn event-modal__btn--edit"
                    onClick={() => openEditModal(selectedEvent)}
                  >
                    수정
                  </button>
                  <button
                    className="event-modal__btn event-modal__btn--delete"
                    onClick={() => deleteEvent(selectedEvent.id)}
                  >
                    삭제
                  </button>
                </>
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
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onEventEdited={handleEventEdited}
        event={editingEvent}
      />
    </div>
  );
}

export default EventPage;
