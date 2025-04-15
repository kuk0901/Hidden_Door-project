import { atom } from 'recoil';

export const noticesState = atom({
  key: 'noticesState', // 고유 키
  default: [], // 공지사항 목록 초기값
});

export const pageState = atom({
  key: 'pageState', // 고유 키
  default: {
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    sortField: 'createdAt',
    sortDirection: 'DESC',
  },
});
