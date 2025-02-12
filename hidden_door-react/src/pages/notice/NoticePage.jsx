import { useState, useEffect } from 'react';
import { useAdmin } from '@hooks/useAdmin';
import Api from '@axios/api';
import { toast } from 'react-toastify';
import AddNoticeModal from './AddNoticeModal';
import EditNoticeModal from './EditNoticeModal'; // 새로 추가할 컴포넌트

function NoticePage() {
  const { admin } = useAdmin();
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
  const [editingNotice, setEditingNotice] = useState(null); // 수정 중인 공지사항

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = () => {
    setLoading(true);
    Api.get('/api/v1/notices')
      .then((response) => {
        if (response.data.length === 0) {
          toast.info('등록된 공지사항이 없습니다.');
        }
        setNotices(response.data);
      })
      .catch((error) => {
        console.error('Error fetching notices:', error);
        toast.error('공지사항을 불러오는 데 실패했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
  };

  const closeModal = () => {
    setSelectedNotice(null);
  };

  const openAddModal = () => {
    if (!admin) return;
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleNoticeAdded = (newNotice) => {
    setNotices([...notices, newNotice]);
  };

  const deleteNotice = (id) => {
    if (!admin) return;

    Api.delete(`/api/v1/notices/${id}`)
      .then(() => {
        setNotices(notices.filter((notice) => notice.id !== id));
        if (selectedNotice && selectedNotice.id === id) {
          closeModal();
        }
        toast.success('공지사항이 삭제되었습니다.');
      })
      .catch(() => {
        toast.error('공지사항 삭제에 실패했습니다.');
      });
  };

  // 수정 모달 열기
  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setIsEditModalOpen(true);
  };

  // 수정 모달 닫기
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingNotice(null);
  };

  // 공지사항 수정 완료 처리
  const handleNoticeEdited = (editedNotice) => {
    setNotices(
      notices.map((notice) =>
        notice.id === editedNotice.id ? editedNotice : notice
      )
    );
    if (selectedNotice && selectedNotice.id === editedNotice.id) {
      setSelectedNotice(editedNotice);
    }
    closeEditModal();
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="notice-page">
      <h1>공지사항 페이지</h1>
      {admin && (
        <button onClick={openAddModal} className="add-notice-btn">
          공지사항 추가
        </button>
      )}
      <div className="notice-container">
        {notices.map((notice) => (
          <div key={notice.id} className="notice-item">
            <div
              className="notice-title"
              onClick={() => handleNoticeClick(notice)}
            >
              {notice.title}
            </div>
            {admin && (
              <button
                onClick={() => deleteNotice(notice.id)}
                className="delete-notice-btn"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>
      {selectedNotice && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-modal__msg">
              <h2>{selectedNotice.title}</h2>
              <p>{selectedNotice.content}</p>
            </div>
            <div className="confirm-modal__btn-container">
              <button
                className="confirm-modal__btn confirm-modal__btn--cancel"
                onClick={closeModal}
              >
                닫기
              </button>
              {admin && (
                <button
                  className="confirm-modal__btn confirm-modal__btn--confirm"
                  onClick={() => openEditModal(selectedNotice)}
                >
                  수정
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <AddNoticeModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onNoticeAdded={handleNoticeAdded}
      />
      <EditNoticeModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onNoticeEdited={handleNoticeEdited}
        notice={editingNotice}
      />
    </div>
  );
}

export default NoticePage;
