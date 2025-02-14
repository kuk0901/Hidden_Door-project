## 정적 파일

- assets

## 스타일

- styles

- abstracts/\_variables에 색상 변수 추가

  - styles/base

  - styles/components 하위 파일 수정 필요

  - styles/layout/\_containers 수정 필요

- 개별 css -> scss 파일 모듈화

- 공통 css -> styles 파일에 정의

## 라우팅 예시

- 특정 주기로 관리자 로그인 경로 변경 필요

  ```shell
  $ openssl rand -hex 16
  ```

- AdminProtectedRoute.jsx

  ```js
  const AdminProtectedRoute = () => {
    const { user } = useRecoilValue(userState);

    return user && user.isAdmin ? <Outlet /> : <ForbiddenPage />;
  };
  ```

- // App.jsx

  ```js
  function App() {
    const adminLoginPath = import.meta.env.VITE_APP_ADMIN_LOGIN_PATH;

    return (
      <Routes>
        {/* 일반 사용자 페이지 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/themes" element={<ThemesPage />} />
        <Route path="/booking" element={<BookingPage />} />

        {/* 관리자 로그인 페이지 */}
        <Route path={${adminLoginPath}} element={<AdminLoginPage />} />

        {/* 관리자 전용 페이지 */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/themes/add" element={<AddThemePage />} />
        </Route>
      </Routes>
    );
  }
  ```

- 조건부 렌더링 예시 (일반 페이지 내 관리자 전용 기능)

  ```js
  function ThemesPage() {
    const { user } = useRecoilValue(userState);

    return (
      <div>
        <h1>테마 목록</h1>
        {/* 테마 목록 표시 */}
        {user && user.isAdmin && (
          <button onClick={() => navigate("/admin/themes/add")}>
            새 테마 추가
          </button>
        )}
      </div>
    );
  }
  ```

## Paging

```js
// list page 예시 코드
// -> detail
// -> list 돌아가기 버튼 고려(params로 함수 전달 또는 파라미터로 사용할 데이터 전달)
import { useLocation } from 'react-router-dom';

function ListPage() {
  const [listData, setListData] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '10';
  // 추가로 필요한 파라미터 설정

  const fetchData = async (page, size) => {
    try {
      const response = await fetch(`/api/list?page=${page}&size=${size}`);
      const data = await response.json();
      setListData(data);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchData(page, size);
  }, [page, size]);

  return (
    // ....
  )
}
```

# 지도 API(카카오)

> env 파일에 작성할 API 키 변수 명 작성 주의(VITE)

- 필요 라이브러리 설치

  ```shell
  npm install react-query react-kakao-maps-sdk
  ```

- Kakao 개발자 플랫폼에서 발급받은 JavaScript 키 필요

  ```html
  <script
    type="text/javascript"
    src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_JAVASCRIPT_KEY&libraries=services,clusterer"
  ></script>
  ```

- Kakao 개발자 플랫폼에서 발급받은 REST API 키 필요

  ```js
  import { useQuery } from "react-query";

  export const fetchLocationData = async (address) => {
    const encodedAddress = encodeURIComponent(address);

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodedAddress}`,
      {
        headers: {
          Authorization: `KakaoAK ${API_KEY}`
        }
      }
    );
    const data = await response.json();

    // 응답 데이터에서 위도와 경도를 추출
    const { documents } = data;
    if (documents.length > 0) {
      const { x, y } = documents[0].address;
      return { x, y };
    } else {
      throw new Error("Address not found");
    }
  };

  export const useLocationData = (address) => {
    return useQuery(
      ["locationData", address], // 캐시 키
      () => fetchLocationData(address)
    );
  };
  ```

  ```js
  // component
  const MapPage = () => {
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error occurred</div>;

    return (
      <>
        {/* <Header /> */}
        <MapComponent />)
      </>
    ;
  };
  ```

  ```js
  // MapComponent
  import { useLocationData } from "./useLocationData";
  import { useEscapeRoom } from "@hooks/useEscapeRoom";

  import { Map } from "react-kakao-maps-sdk";

  const MapComponent = () => {
    const { escapeRoom } = useEscapeRoom();
    const { data, isLoading, error } = useLocationData(escapeRoom.address);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error occurred</div>;

    return <Map center={{ lat: data.y, lng: data.x }} />;
  };

  export default MapComponent;
  ```
