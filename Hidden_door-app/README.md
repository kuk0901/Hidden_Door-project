## DB 설계

### 클러스터 연동

1. 클러스터 생성

2. 사용자 추가: "Database Access" -> "Add New Database User" -> 사용자 이름과 비밀번호를 설정 후 역할 지정

3. 네트워크 접근 설정: "Network Access" -> "Add IP Address" -> 팀원이 사용하는 IP 주소를 추가하거나 "Allow Access from Anywhere" 옵션을 선택하여 모든 IP에서 접근할 수 있도록 설정

<br />

## 프로젝트 설계

- 프로젝트 구조

  - dev

  ```
  Hidden_Door-project
  |
  |__Hidden_Door-react
  |
  |__Hidden_Door-app
  ```

  - build

  ```
  Hidden_Door-app
  |
  |__src
      |
      |__main
            |
            |__java
            |
            |__resource
                      |
                      |__static
                              |
                              |__img
                              |__build
  ```

- 배포 추가 코드

  ```gradle
  // .env 파일 로드
  def envProps = new Properties()
  file(".env").withInputStream { envProps.load(it) }

  ext {
      env = envProps
  }

  // React 프로젝트 경로 설정
  def reactDir = "${projectDir}/../Hidden_Door-react"

  // React 빌드 태스크
  task buildReact(type: Exec) {
      workingDir reactDir
      commandLine 'npm', 'run', 'build'
  }

  // React 빌드 파일 복사 태스크
  task copyReactBuild(type: Copy) {
      dependsOn buildReact
      from "${reactDir}/dist"
      into "${projectDir}/src/main/resources/static"
  }

  // Spring Boot 빌드 전에 React 빌드 실행
  processResources.dependsOn copyReactBuild

  // 환경 변수 사용 예시
  bootRun {
      environment "MONGODB_URI", env.MONGODB_URI
      environment "REACT_APP_API_URL", env.REACT_APP_API_URL
  }
  ```

  ```env
  REACT_PROJECT_PATH=../Hidden_Door-react
  ```

- JAR 파일 생성

  ```shell
  $ ./gradlew bootJar
  ```

  - build.gradle 파일에 Spring Boot Gradle 플러그인 존재해야 함

- 모든 환경 변수를 Heroku 대시보드나 CLI를 통해 설정

<br />

## 계정 생성

- super admin이 생성해 줌

## 이미지 파일 저장

- 정적 리소스 static 파일에 저장: 서버 재시작 필요

- 정적 리소스 외부 파일에 저장

#### Imgur + 로컬 디렉토리 사용

> 이미지 파일을 사용하는 컬렉션 확인 및 필드 고려

- 배포: Imgur

- 개발, 포트폴리오 코드 테스트: 로컬 디렉토리

```
- upload

  1. client -> 서버 이미지 전송

  2. 로컬 디렉토리에 저장 후 Imgur 저장 -> img 사용하는 db에 각 url 추가

- delete

  1. collection에 저장된 id 전송

  2. find -> 로컬에서 삭제 -> Imgur 삭제
```

> Imgur 회원가입, upload URL / client Id 필요 -> env 파일에 저장

## Render 배포

- Render의 무료 인스턴스에 배포된 백엔드 코드를 MongoDB Atlas의 무료 티어 데이터베이스와 연결하는 과정

```
1. MongoDB Atlas에서 무료 티어 데이터베이스를 생성
2. MongoDB Atlas에서 데이터베이스 연결 문자열(URI)을 얻음
3. Render의 무료 인스턴스에 환경 변수로 MongoDB 연결 정보(사용자 이름, 비밀번호 등)를 설정
4. 백엔드 코드에서 MongoDB 드라이버를 사용하여 Atlas에 연결
5. Render의 네트워크 액세스 설정에서 MongoDB Atlas의 IP 허용 목록에 Render의 고정 아웃바운드 IP 주소를 추가

=> Render의 무료 인스턴스에서 실행되는 백엔드 코드가 MongoDB Atlas의 무료 티어 데이터베이스에 접근하여 데이터를 읽고 사용 가능
=> Render의 무료 인스턴스는 사용량 제한이 있고, MongoDB Atlas의 무료 티어는 512MB의 스토리지 제한
```

## Paging

```
- RESTful API에서는 현재 페이지에서 해당 코드가 진행됨으로 page refresh할 경우 현재 url 유지(화면)
- 서버측의 코드는 비동기로 진행

-> 에러코드에 pageable 객체 추가 후 에러 객체에 추가된 Pageable을 사용해 화면 재구성 또는 컴포넌트의 state set
```
