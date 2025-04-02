import { useState, useEffect } from "react";
import { useAdmin } from "@hooks/useAdmin";
import Api from "@axios/api";
import { toast } from "react-toastify";
import AddEventModal from "./AddEventModal";
import EditEventModal from "./EditEventModal";
import { formatKoreanDate } from "../../utils/format/date";

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
    Api.get("/events")
      .then((response) => {
        if (response.data && response.data.data) {
          if (response.data.data.length === 0) {
            toast.info("등록된 이벤트가 없습니다.");
          }
          setEvents(response.data.data);
        } else {
          setEvents([]);
          toast.info("등록된 이벤트가 없습니다.");
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        toast.error("이벤트를 불러오는 데 실패했습니다.");
        setEvents([]);
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

  // XXX: 메서드 체이닝 형식 말고 async-await 문법으로 변경해 주세요.
  const deleteEvent = (eventId) => {
    if (!admin) return;

    Api.delete(`/events/${eventId}`)
      .then((response) => {
        if (
          response.data &&
          (response.data.message || response.data.data !== undefined)
        ) {
          setEvents(events.filter((event) => event.id !== eventId));
          if (selectedEvent && selectedEvent.id === eventId) {
            closeModal();
          }
          toast.success(
            response.data.message || "이벤트가 성공적으로 삭제되었습니다."
          );
          closeModal();
          fetchEvents();
        } else {
          toast.error("삭제 응답이 올바르지 않습니다.");
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "이벤트 삭제에 실패했습니다."
        );
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
    Api.put(`/events/${editedEvent.eventId}`, editedEvent)
      .then((response) => {
        if (response.data && response.data.data) {
          setEvents(
            events.map((event) =>
              event.id === editedEvent.eventId ? response.data.data : event
            )
          );
          closeEditModal();
          if (selectedEvent && selectedEvent.eventId === editedEvent.eventId) {
            setSelectedEvent(response.data.data);
          }
          toast.success(response.data.message || "이벤트가 수정되었습니다.");
        } else {
          toast.error("수정 응답이 올바르지 않습니다.");
        }
      })
      .catch((error) => {
        console.error("Error editing event:", error);
        toast.error(
          error.response?.data?.message || "이벤트 수정에 실패했습니다."
        );
      });
  };

  const formatEventDate = (date) => {
    if (!date) return "";
    return formatKoreanDate(date);
  };

  const renderEventPeriod = (event) => {
    if (event.isOngoing === "true") {
      return "상시";
    } else if (event.noEndDate === "true") {
      return `${formatEventDate(event.startDate)} ~`;
    } else {
      return `${formatEventDate(event.startDate)} ~ ${formatEventDate(
        event.endDate
      )}`;
    }
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
          <div key={event.eventId} className="event-item">
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
        <div className="em-event-modal-overlay">
          <div className="em-event-modal">
            <h2 className="em-modal-title">{selectedEvent.title}</h2>
            <p className="em-modal-description">{selectedEvent.description}</p>
            <p className="em-modal-dates">
              기간 : {renderEventPeriod(selectedEvent)}
            </p>
            <div className="em-modal-btn-container">
              <button
                className="em-modal-btn em-modal-btn--cancel"
                onClick={closeModal}
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
