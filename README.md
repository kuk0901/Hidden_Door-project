## Hidden_Door-app

SpringBoot + React webapp project

## UI

## Database

- MongoDB

## 해야 할 일 정리

#### Check

- common

  1. proxy

  2. 데이터 전송

  3. 이미지 파일 용량

- client

  1. docker-compose 파일

  2. 불변 img hidden_door-react/public 위치

  3. API 인터셉터(req, res)

  4. hooks

  5. .scss 파일(변수, 공통 클래스)

  6. 관리자 로그인 후 User 데이터 set, main 페이지로 이동

  7. icon 선택 버튼

- server

  1. 파일 업로드

#### Database init

- admin

- EscapeRoom

- Theme

- FAQ

#### page

- 관리자 전용 페이지

  1. 대시보드

  2. 관리자 현황(CRUD): ROLES_SUPER_ADMIN이 CRUD 전체, 일반 ROLES_ADMIN은 R/U

     > 일반 권한의 관리자는 본인 계정만 Update 가능

  3. 에약 정보(RUD): delete는 삭제 기한 설정

## Hosting Service

- client: vercel

- server: local

- database: local mongodb

  ```
  1. backend는 로컬에서 구동

  2. frontend는 vercel 사용

  3. img 폴더는 로컬에 존재(이미지 깨짐 등 이슈 발생시 Imgur 사이트 이용 가능성 고려)
  ```

#### 주의사항

- 배포 후 호스팅 서비스 URL을 설정 파일에서 추가해줘야 함
