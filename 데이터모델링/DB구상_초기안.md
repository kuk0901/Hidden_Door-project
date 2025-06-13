## Database 구상 초기안

- `예약(Reservation)`

| ko-field                            | en-field             |
| ----------------------------------- | -------------------- |
| 예약 ID                             | RESERVATION_ID       |
| 성함                                | NAME                 |
| 전화번호                            | PHONE                |
| 이메일                              | EMAIL                |
| 테마 ID(선택한 테마)                | THEME_ID             |
| 예약 시간(고객이 선택한 이용 시간)  | RESERVATION_DATE     |
| 생성 시간(예약 정보가 생성된 시간)  | RESERVATION_CRE_DATE |
| 이용 여부(이용이 완료되었는지 여부) | AVAILABILITY         |
| 결제 금액                           | PAYMENT_AMOUNT       |
| 결제 상태                           | PAYMENT_STATE        |
| 결제 시간                           | PAYMENT_DATE         |
| 결제 방법                           | PAYMENT_METHOD       |
| 환불 여부                           | REFUND_STATE         |

- `방탈출 카페 정보(EscapeRoom)`

| ko-field         | en-field           |
| ---------------- | ------------------ |
| 카페 ID          | ROOM_ID            |
| 카페 이름        | ROOM_NAME          |
| 위치             | LOCATION           |
| 제목             | TITLE              |
| 설명             | EXPLANATION        |
| 연락처 정보      | CONTACT_INFO       |
| 이미지 실제 경로 | STORED_FILE_NAME   |
| 이미지 이름      | ORIGINAL_FILE_NAME |

- `테마 정보(Theme)`

| ko-field    | en-field          |
| ----------- | ----------------- |
| 테마 ID     | THEME_ID          |
| 테마 이름   | THEME_NAME        |
| 설명        | DESCRIPTION       |
| 이미지 URL  | IMG_URL           |
| 예약 수     | RESERVATION_COUNT |
| 가격        | PRICE             |
| 누적 이용금 | TOTLE_AMOUNT_USED |

- `공지사항(Notice)`

| ko-field    | en-field  |
| ----------- | --------- |
| 게시글 ID   | NOTICE_ID |
| 제목        | TITLE     |
| 내용        | CONTENT   |
| 작성자 정보 | ADMIN_ID  |
| 작성 날짜   | CRE_DATE  |

- `이벤트(Event)`

| ko-field           | en-field     |
| ------------------ | ------------ |
| 이벤트 ID          | EVENT_ID     |
| 제목               | TITLE        |
| 내용               | CONTENT      |
| 작성자 정보        | ADMIN_ID     |
| 작성일             | CRE_DATE     |
| 당첨자 성함        | WINNER_NAME  |
| 당첨자 휴대폰 번호 | WINNER_PHONE |
| 당첨자 이메일      | WINNER_EMAIL |

- `고객센터(CustomerService)`

| ko-field       | en-field         |
| -------------- | ---------------- |
| 문의 ID        | CUSTOMER_ID      |
| 고객 성함      | CUSTOMER_NAME    |
| 이메일         | CUSTOMER_EMAIL   |
| 문의 내용      | CUSTOMER_CONTENT |
| 답변 내용      | CUSTOMER_ANSWER  |
| 답변 여부      | CUSTOMER_CHECK   |
| 답변자(관리자) | ADMIN_NAME       |
| 문의 작성일    | QUE_CRE_DATE     |
| 답변 작성일    | ANS_CRE_DATE     |

- `자주 찾는 질문(FAQ)`

| ko-field  | en-field |
| --------- | -------- |
| 질문 ID   | FAQ_ID   |
| 카테고리  | CATEGORY |
| 질문      | QUESTION |
| 답변 내용 | ANSWER   |
| 작성일    | CRE_DATE |
| 수정일    | MOD_DATE |
| 작성자    | WRITER   |

- `관리자(Admin)`

| ko-field      | en-field  |
| ------------- | --------- |
| 관리자 ID     | ADMIN_ID  |
| 관리자 이름   | USER_NAME |
| 관리자 휴대폰 | PHONE     |
| 아이디        | EMAIL     |
| 비밀번호      | PWD       |
| 권한          | AUTHORITY |

- `주의사항(caution)`

| ko-field    | en-field   |
| ----------- | ---------- |
| 주의사항 ID | CAUTION_ID |
| 아이콘      | ICON       |
| 제목        | TITLE      |
| 설명        | CONTENT    |
