import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Api from '@axios/api';

//
function AddNoticePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const newNotice = { title, content };

    try {
      const response = await Api.post('/notices', newNotice);

      if (response.status !== 200 && response.status !== 201) {
        toast.error(
          response.data?.message ||
            '공지사항 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.'
        );
        return;
      }

      toast.success(
        response.data.message || '공지사항이 성공적으로 등록되었습니다.'
      );

      setTitle('');
      setContent('');

      navigate('/hidden_door/notice', {
        state: { shouldRefresh: true },
      });
    } catch (error) {
      console.error('Error adding notice:', error);
      toast.error(
        error.message || '네트워크 문제로 공지사항 추가에 실패하였습니다.'
      );
    }
  };

  return (
    <section className="add-notice-page">
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
    </section>
  );
}

export default AddNoticePage;
