import { useEffect, useState } from "react";
import { useLocationData } from "@hooks/useLocationData";

// kakao 객체 사용
const MapComponent = ({ address }) => {
  const { data, isLoading, error } = useLocationData(address);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    kakao.maps.load(() => {
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded && data) {
      const container = document.getElementById("map");
      const options = {
        // eslint-disable-next-line no-undef
        center: new kakao.maps.LatLng(data.y, data.x),
        level: 3
      };
      // eslint-disable-next-line no-undef
      const map = new kakao.maps.Map(container, options);
      // eslint-disable-next-line no-undef
      const zoomControl = new kakao.maps.ZoomControl();
      // eslint-disable-next-line no-undef
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      // 마커 추가 코드
      // eslint-disable-next-line no-undef
      const marker = new kakao.maps.Marker({
        // eslint-disable-next-line no-undef
        position: new kakao.maps.LatLng(data.y, data.x),
        map: map
      });

      // 커스텀 오버레이 생성
      // eslint-disable-next-line no-undef
      const overlay = new kakao.maps.CustomOverlay({
        // eslint-disable-next-line no-undef
        position: new kakao.maps.LatLng(data.y, data.x),
        content: `<div style="color: #000; font-size: 12px; font-weight: bold; padding: 5px; border-radius: 5px; background-color: #fff; border: 1px solid #ddd;">${address}</div>`,
        map: map,
        clickable: true // 클릭 가능하게 설정
      });
      overlay.setMap(null); // 기본적으로 오버레이 숨기기

      // 마커 클릭 이벤트 설정
      // eslint-disable-next-line no-undef
      kakao.maps.event.addListener(marker, "click", function () {
        if (overlay.getMap()) {
          overlay.setMap(null); // 이미 표시된 경우 숨기기
        } else {
          overlay.setMap(map); // 표시
        }
      });
    }
  }, [isLoaded, data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <section className="map--info">
      <div
        id="map"
        style={{
          width: "90%",
          margin: "auto",
          maxWidth: "1200px" // 최대 너비 설정
        }}
      />
    </section>
  );
};

export default MapComponent;
