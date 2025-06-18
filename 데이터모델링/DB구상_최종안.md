## Database 구상 최종안

#### `예약(Reservation)`

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
| 예약 번호                           | Reservation_NUMBER   |
| 인원수                              | PARTY_SIZE           |

<br />

#### `방탈출 카페 정보(EscapeRoom)`

| ko-field         | en-field                     |
| ---------------- | ---------------------------- |
| 카페 ID          | ROOM_ID                      |
| 카페 이름        | ROOM_NAME                    |
| 위치             | LOCATION                     |
| 연락처 정보      | CONTACT_INFO                 |
| 상세 제목        | TITLE                        |
| 상세 설명        | EXPLANATION                  |
| 이미지 실제 경로 | STORED_FILE_NAME             |
| 이미지 이름      | ORIGINAL_FILE_NAME           |
| 테마 대표 제목   | THEME_HEADER_TITLE           |
| 테마 대표 부제목 | THEME_HEADER_SUBTITLE        |
| 테마 제목        | THEME_TITLE                  |
| 테마 설명        | THEME_EXPLANATION            |
| 테마 상세 제목   | THEME_DETAIL_HEADER_TITLE    |
| 테마 상세 부제목 | THEME_DETAIL_HEADER_SUBTITLE |
| 오픈 시간        | OPEN_TIME                    |
| 마감 시간        | CLOSE_TIME                   |

<br />

#### `테마 정보(Theme)`

| ko-field         | en-field           |
| ---------------- | ------------------ |
| 테마 ID          | THEME_ID           |
| 테마 이름        | THEME_NAME         |
| 장르             | GENRE              |
| 최소 인원        | MIN_PARTICIPANTS   |
| 최대 인원        | MAX_PARTICIPANTS   |
| 난이도           | LEVEL              |
| 이용 시간        | TIME               |
| 설명             | DESCRIPTION        |
| 이미지 실제 경로 | STORED_FILE_NAME   |
| 이미지 이름      | ORIGINAL_FILE_NAME |
| 가격             | PRICE              |
| 청소 시간        | CLEANING_TIME      |
| 이용 가능 요일   | AVALIABLE_DAYS     |

<br />

#### `공지사항(Notice)`

| ko-field  | en-field  |
| --------- | --------- |
| 게시글 ID | NOTICE_ID |
| 제목      | TITLE     |
| 내용      | CONTENT   |
| 작성일    | CRE_DATE  |

<br />

#### `이벤트(Event)`

| ko-field         | en-field    |
| ---------------- | ----------- |
| 이벤트 ID        | EVENT_ID    |
| 이벤트 제목      | TITLE       |
| 이벤트 내용      | DESCRIPTION |
| 이벤트 시작일    | START_DATE  |
| 이벤트 종료일    | END_DATE    |
| 상시 이벤트      | IS_ON_GOING |
| 이벤트 종료 미정 | NO_END_DATE |
| 이벤트 기간 타입 | EVENT_TYPE  |

<br />

#### `고객센터(CustomerService)`

| ko-field          | en-field         |
| ----------------- | ---------------- |
| 고객센터 ID       | CUSTOMER_ID      |
| 고객센터 제목     | CUSTOMER_TITLE   |
| 고객센터 내용     | CUSTOMER_CONTENT |
| 고객센터 답변유무 | CUSTOMER_CHECK   |
| 고객센터 답변     | CUSTOMER_ANSWER  |
| 관리자 이름       | ADMIN_NAME       |
| 질문 비밀번호     | CUSTOMER_PWD     |
| 질문날짜          | QUE_CRE_DATE     |
| 답변날짜          | ANS_CRE_DATE     |

<br />

#### `자주 찾는 질문(FAQ)`

| ko-field     | en-field |
| ------------ | -------- |
| FAQ ID       | FAQ_ID   |
| FAQ 작성자   | WRITER   |
| FAQ 카테고리 | CATEGORY |
| FAQ 제목     | TITLE    |
| FAQ 내용     | QUESTION |
| 작성날짜     | CRE_DATE |
| 수정날짜     | MOD_DATE |

<br />

#### `관리자(Admin)`

| ko-field  | en-field   |
| --------- | ---------- |
| 관리자 ID | ADMIN_ID   |
| 이름      | USER_NAME  |
| 전화번호  | PHONE      |
| 이메일    | EMAIL      |
| 비밀번호  | PWD        |
| 토큰      | TOKEN      |
| 권한      | AUTHORITY  |
| 권한 개수 | ROLE_COUNT |

<br />

#### `주의사항(caution)`

| ko-field    | en-field   |
| ----------- | ---------- |
| 주의사항 ID | CAUTION_ID |
| 아이콘      | ICON       |
| 제목        | TITLE      |
| 설명        | CONTENT    |
