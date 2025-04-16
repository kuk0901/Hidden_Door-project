import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Api from '@axios/api';

function AddNoticePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleResponseError = (status, message) => {
    const errorMessages = {
      400: message || '잘못된 요청입니다.',
      401: message || '유효하지 않은 인증정보입니다. 다시 로그인해주세요.',
      403: message || '접근 권한이 없습니다. 관리자에게 문의하세요.',
      404: message || '요청하신 리소스를 찾을 수 없습니다.',
      default:
        message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    };

    return errorMessages[status] || errorMessages.default;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const newNotice = { title, content };

    try {
      const response = await Api.post('/notices', newNotice);

      // 성공 상태 코드 확인
      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data.message || '공지사항이 성공적으로 등록되었습니다.'
        );

        // 제목과 내용 초기화
        setTitle('');
        setContent('');

        navigate('/hidden_door/notice', {
          state: { shouldRefresh: true },
        });
      } else {
        // 성공 상태 코드가 아닌 경우 에러 처리
        toast.error(
          handleResponseError(response.status, response.data.message)
        );
      }
    } catch (error) {
      console.error('Error adding notice:', error);
      toast.error(
        error.response?.data?.message ||
          '네트워크 문제로 공지사항 추가 실패하였습니다.'
      );
    }
  };

  return (
    <div className="add-notice-page">
      <h2 className="add-notice-title">새 공지사항 추가</h2>
      <form onSubmit={handleSubmit} className="add-notice-form">
        <div className="add-notice-form-group">
          <label htmlFor="title" className="add-notice-form-label">
            제목
          </label>
          <input
            type="text"
            id="title"
            className="add-notice-form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="제목을 입력해주세요"
          />
        </div>
        <div className="add-notice-form-group">
          <label htmlFor="content" className="add-notice-form-label">
            내용
          </label>
          <textarea
            id="content"
            className="add-notice-form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="내용을 입력해주세요"
          />
        </div>
        <div className="add-notice-form-buttons">
          <button
            type="submit"
            className="add-notice-btn add-notice-btn-submit"
          >
            추가
          </button>
          <button
            type="button"
            className="add-notice-btn add-notice-btn-cancel"
            onClick={() => navigate('/hidden_door/notice')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNoticePage;
