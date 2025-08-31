## Hidden_Door-app

Hidden_Door는 단순하고 편리한 예약 및 관리 기능 구현과 더불어 반응형 웹을 목표로 하는 방탈출 예약 애플리케이션 프로젝트입니다.

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [특징](#특징)
3. [기술 스택](#기술-스택)
4. [팀 정보](#팀-정보)
5. [수행 기간 및 절차](#수행-기간-및-절차)
6. [프로젝트 목표](#프로젝트-목표)
7. [Hosting](#Hosting)
8. [설치 및 실행 방법](#설치-및-실행-방법)
9. [상세 문서](#상세-문서)

## 프로젝트 개요

Hidden_Door는 NoSQL, JWT, RESTful API, React 학습을 통한 실제 애플리케이션 개발 경험 획득을 목적으로 합니다. 주요 기능으로는 반응형 웹 디자인, 방탈출 예약 시스템, 예약 및 이벤트 참여 데이터 분석, 그리고 관리자 대시보드를 포함합니다.

## 특징

- JWT와 Spring Security를 활용한 강화된 인증 및 보안 시스템
- 사용자 중심의 반응형 웹 UI/UX 설계 및 구현
- Spring Boot와 Vite(React)를 이용한 서버/클라이언트 분리 아키텍처

## 기술 스택

- UI 디자인: Google Slides
- FrontEnd: Vite, React, Recoil, SCSS
- API: Kakao Map
- BackEnd: Java, SpringBoot, Gradle
- Database: MongoDB
- 개발 도구: Visual Studio Code, MongoDB-Compass

## 팀 정보

- 팀명: BSTC

- 팀원:

  - 국하현(kukhahyeon@gmail.com / kuk0901):

    - 깃허브/프론트엔드 관리자
    - 인증 시스템, 방탈출 및 테마 정보, 지도, 대시보드 기능 담당

  - 김보근(jjangbogun):

    - 문서 관리자
    - 고객센터(Q&A/FAQ) 기능 담당

  - 김진우(dlqkfspro2@gmail.com / kimjinwoo97):

    - DBA
    - 예약 기능 담당

  - 조병철(qudcjf854@gamil.com / JJJbc):
    - 백엔드 관리자
    - 이벤트, 공지사항 기능 담당

## 수행 기간 및 절차

- 기획(총 5일)

  - 2024.12.12 / 2024.12.17 / 2024.12.21 / 2025.01.02

- DB구상 및 구축(총 4일)

  - 2025.01.02 / 2025.01.07 / 2025.01.02 / 2025.01.10

- 소스 코드 작성 및 구현

  - 2025.01.16 ~ 2025.07.12
 
- 테스트

  - 2025.07.13 ~ 2025.08.31

## 프로젝트 목표

본 프로젝트는 React/Recoil 기반의 클라이언트와 Spring Boot 기반의 서버 코드를 분리하여 개발하였습니다. 세부 목표는 다음과 같습니다:

1. 실제 방탈출 사이트 사용 경험을 바탕으로 한 UX 개선
2. MongoDB를 통한 NoSQL 데이터베이스 학습
3. 백엔드와 프론트엔드 로직 분리를 통한 효율적인 시스템 구조 설계
4. 최신 웹 개발 기술, 라이브러리, API 활용 능력 강화
5. 팀 협업 능력 향상 및 실무와 유사한 프로젝트 관리 경험 축적

이 프로젝트를 통해 팀원들은 브랜치 전략, GitHub Pull Request 등을 활용한 실무 수준의 프로젝트 관리 능력을 강화하고, React, Recoil, MongoDB, Spring Boot 등 현대적인 웹 개발 기술에 대한 역량을 향상시켰습니다.

## Hosting

- 프론트/백엔드: 로컬 호스팅

- 데이터베이스: 로컬 MongoDB || docker(MongoDB)

## 설치 및 실행 방법

> 본 프로젝트는 VSCode 환경에서 개발되었습니다.

**실행 순서:**

1. 저장소 클론 또는 ZIP 파일 다운로드
2. 데이터베이스(MongoDB) 실행
3. 서버(Spring Boot) 실행
4. 클라이언트(vite-react) 실행

### 1. 저장소 클론

```shell
git clone https://github.com/kuk0901/Hidden_Door-project.git
```

### 2. ZIP 파일 다운로드

- [히든도어 깃허브](https://github.com/kuk0901/Hidden_Door-project.git)에서 "<> Code" 버튼을 클릭 후 "Download ZIP"을 선택해주세요.

### 환경변수 설정

> 아래 환경변수 내용을 확인 후 참고해 설정해주세요.

- 전체:

  ```
  # database & docker
  MONGODB_URI
  MONGO_DB_NAME
  MONGO_INITDB_ROOT_USERNAME
  MONGO_INITDB_ROOT_PASSWORD
  ADMIN_EMAIL
  ADMIN_PASSWORD
  GMAIL_USERNAME
  GMAIL_PASSWORD

  # jwt
  JWT_SECRET_KEY

  # ADMIN_LOGIN_PATH는 일정 주기로 변경 주의
  VITE_APP_ADMIN_LOGIN_PATH
  VITE_APP_API_URL
  ```

- client(hidden_door-react)

  ```
  # ADMIN_LOGIN_PATH는 일정 주기로 변경 주의
  VITE_APP_ADMIN_LOGIN_PATH
  VITE_APP_API_URL
  VITE_APP_IMG_URL
  VITE_APP_UNCACHED_URLS

  # kakao map api
  VITE_APP_KAKAO_API
  VITE_APP_KAKAO_JS_KEY
  ```

### Database

- **로컬:** MongoDB 설치 필요

- **Docker:**

  > docker-compose.yml 파일 사용시 환경변수 설정에 주의해주세요.

  - 백그라운드 모드 실행

    ```shell
    docker compose up -d mongodb
    ```

  - 포그라운드 모드 실행

    ```shell
    docker compose up mongodb
    ```

  - **데이터베이스 공통:**

  - [documents 브랜치](https://github.com/kuk0901/Hidden_Door-project/tree/documents)의 `database` 폴더 안에 있는 json 파일들을 MongoDB에 import 해주세요.
  - GUI로 데이터를 관리하고 싶다면 [MongoDB Compass](https://www.mongodb.com/try/download/compass)를 설치해 사용하실 수 있습니다.

    - Compass 설치 및 사용법:
      1. Compass를 다운로드 및 설치합니다.
      2. 실행 후, `localhost:27019`(도커 사용 시) 또는 `localhost:27017`(로컬 설치 시)로 접속합니다.
      3. "Add Data" → "Import File" 기능을 이용해 json 파일을 데이터베이스에 추가할 수 있습니다.

### Server(Hidden_door-app)

1. 환경변수 파일 준비(.env)

   - 설정 파일에 필요한 값을 입력하세요.

2. 의존성 설치 및 빌드

   - macOS/Linux:

   ```shell
   ./gradlew build
   ```

   - Windows:

   ```shell
   gradlew.bat build
   ```

3. 실행 파일(jar)로 서버 실행

   - 빌드가 완료되면 build/libs/(Gradle) 또는 target/(Maven) 폴더에 jar 파일이 생성됩니다.

   - 아래 명령어로 실행:

   ```shell
   java -jar build/libs/프로젝트명-버전.jar

   # 예시
   java -jar build/libs/hidden-door-app-0.0.1-SNAPSHOT.jar
   ```

4. 서버 실행 후 접속

   > application.yml 파일의 port는 8888로 작성되어 있습니다.

   - 접속 URL: http://localhost:8888

### Client(hidden_door-react)

1. 환경변수(.env) 파일 준비

2. 의존성 설치

   ```shell
   npm install
   # 또는
   yarn install
   ```

3. 클라이언트 실행

   ```shell
   npm run start
   # 또는
   yarn start
   ```

4. 접속 URL

   - http://localhost:5173

## 상세 문서

- 기획 및 설계 문서, 예시 이미지는 [documents 브랜치](https://github.com/kuk0901/Hidden_Door-project/tree/documents)에서 확인할 수 있습니다.
