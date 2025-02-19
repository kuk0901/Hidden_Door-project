import Header from "@components/common/layout/Header";
import { useEscapeRoom } from "@hooks/useEscapeRoom";
import LocationInfo from "@components/location/LocationInfo";
import MapComponent from "@components/location/MapComponent";
import { useMemo } from "react";

const LocationPage = () => {
  const { escapeRoom } = useEscapeRoom();
  const address = useMemo(() => escapeRoom.location, [escapeRoom.location]);

  return (
    <>
      {/* subtitle만 수정하게끔 처리 */}
      <Header
        title="구로디지털단지점 Location"
        subtitle=""
        reservation={true}
      />

      {/* map */}
      <MapComponent address={address} />

      {/* 지점, 주소, 연락처 */}
      <LocationInfo
        location={escapeRoom.location}
        contactInfo={escapeRoom.contactInfo}
        branchName="구로디지털단지점"
      />
    </>
  );
};

export default LocationPage;
