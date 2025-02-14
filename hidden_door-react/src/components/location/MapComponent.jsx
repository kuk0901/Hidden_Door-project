// import { Map } from "react-kakao-maps-sdk";
import { useLocationData } from "@hooks/useLocationData";

const MapComponent = ({ address }) => {
  const { data, isLoading, error } = useLocationData(address);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <section className="map--info">
      {/* <Map center={{ lat: data.y, lng: data.x }} /> */}
    </section>
  );
};

export default MapComponent;
