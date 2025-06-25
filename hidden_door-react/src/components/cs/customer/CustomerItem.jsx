import { useNavigate } from 'react-router-dom';
import Api from '@axios/api';
import { toast } from 'react-toastify';
import { inputConfirmState } from '../../../atoms/inputConfirmAtom';
import { useSetRecoilState } from 'recoil';
import { useAdmin } from '@hooks/useAdmin';

const CustomerItem = ({ customer, page, search }) => {
  const setConfirmState = useSetRecoilState(inputConfirmState);
  const navigate = useNavigate();
  const { admin } = useAdmin();

  const handleDetail = () => {
    if (admin) {
      // 관리자는 비밀번호 입력 없이 바로 상세로 이동
      navigate(`/hidden_door/cs/customer/${customer.customerId}`, {
        state: { page, search },
      });
      return;
    }

    setConfirmState({
      isOpen: true,
      message: '비밀번호를 입력하세요 (숫자 4개)',
      onConfirm: async (password) => {
        const input = parseInt(password, 10);
        if (isNaN(input)) {
          toast.error('숫자만 입력하세요.');
          return;
        }

        try {
          const res = await Api.post('/customers/customer/verify-password', {
            customerId: customer.customerId,
            password: input,
          });

          if (res.status === 200 && res.data.data) {
            navigate(`/hidden_door/cs/customer/${customer.customerId}`, {
              state: { page, search },
            });
          } else {
            toast.error('비밀번호가 틀렸습니다.');
          }
        } catch (error) {
          toast.error('비밀번호 확인 중 오류가 발생했습니다.');
        }
      },
      onCancel: () => {
        setConfirmState((prev) => ({
          ...prev,
          isOpen: false,
          message: '',
          password: '',
          onConfirm: null,
          onCancel: null,
        }));
      },
    });
  };

  return (
    <li className="faq-tr-content">
      <button onClick={handleDetail} className="title-div" type="button">
        {customer.customerTitle}
      </button>
      <div className="cs-check">{customer.customerCheck}</div>
      <div className="cs-date">{customer.kstQueCreDate}</div>
    </li>
  );
};

export default CustomerItem;
