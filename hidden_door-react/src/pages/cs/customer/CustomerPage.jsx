import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Api from '@axios/api';
import { toast } from 'react-toastify';
import { useAdmin } from '@hooks/useAdmin';
import SearchForm from '@components/common/form/SearchForm';
import Pagination from '@components/common/navigation/pagination/Pagination';
import CustomerList from '../../../components/cs/customer/CustomerList';

const CustomerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { admin } = useAdmin();
  const [customerList, setCustomerList] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(
    location.state?.page || {
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      isFirst: true,
      isLast: true,
      sortField: 'queCreDate',
      sortDirection: 'ASC',
    }
  );

  const [search, setSearch] = useState(
    location.state?.search || {
      searchField: '',
      searchTerm: '',
    }
  );

  const getAllCustomer = async (
    newPage = 1,
    searchField = '',
    searchTerm = ''
  ) => {
    try {
      const { size, sortField, sortDirection } = page;
      const res = await Api.get('/customers/list', {
        params: {
          page: newPage,
          size,
          sortField,
          sortDirection,
          searchField,
          searchTerm,
        },
      });

      if (res.status !== 200) {
        toast.error('질문을 불러오는데 실패했습니다.');
      }

      setCustomerList(res.data.data);
      setPage(res.data.pageDto);
      setSearch({
        searchField: res.data.searchField,
        searchTerm: res.data.searchTerm,
      });
    } catch (error) {
      toast.error(error.message || '질문을 불러오는데 실패했습니다.');
    }
  };

  const handleSearch = (searchField, searchTerm) => {
    getAllCustomer(1, searchField, searchTerm);
  };

  const handlePageChange = (newPage) => {
    getAllCustomer(newPage, search.searchField, search.searchTerm);
  };

  useEffect(() => {
    if (searchParams.get('delete') === 'true') {
      toast.success('질문이 삭제되었습니다.');
    }

    setSearchParams({});
  }, []);

  useEffect(() => {
    if (location.state?.page || location.state?.search) {
      setPage(location.state.page);
      setSearch(location.state.search);
      getAllCustomer(
        location.state.page.page,
        location.state.search.searchField,
        location.state.search.searchTerm
      );
    } else {
      getAllCustomer();
    }
  }, [location.state]);

  const handleReset = () => {
    setSearch({ searchField: '', searchTerm: '' });
    getAllCustomer();
  };

  const searchFields = [
    { value: '', label: '검색 필드 선택' },
    { value: 'customerTitle', label: '제목' },
    { value: 'customerContent', label: '질문내용' },
  ];

  const handleAddCustomer = () => {
    navigate('/hidden_door/cs/customer/add');
  };

  return (
    <>
      <section className="section section-cs">
        <div className="cs-body">
          <div className="cs-header">히든도어 고객센터</div>

          <div className="cs-move">
            <a
              href={`/hidden_door/cs/faq`}
              className={
                location.pathname === '/hidden_door/cs/faq'
                  ? 'link_active'
                  : 'link'
              }
            >
              FAQ
            </a>
            <a
              href={`/hidden_door/cs/customer`}
              className={
                location.pathname === '/hidden_door/cs/customer'
                  ? 'link_active'
                  : 'link'
              }
            >
              1:1 문의
            </a>
          </div>

          <div className="cs-search-section">
            <SearchForm
              onSearch={handleSearch}
              fields={searchFields}
              initialValues={search}
              onReset={handleReset}
            />
          </div>

          <div className="btn-container">
            <button className="btn" onClick={handleAddCustomer}>
              질문하기
            </button>
          </div>

          <div className="cs-main-container">
            {customerList && customerList.length > 0 ? (
              <CustomerList
                customerList={customerList}
                page={{ ...page }}
                search={{ ...search }}
              />
            ) : (
              <div className="empty-message">등록된 질문이 없습니다.</div>
            )}
          </div>

          <Pagination page={page} onPageChange={handlePageChange} />
        </div>
      </section>

      <div></div>
    </>
  );
};

export default CustomerPage;
