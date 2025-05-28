import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EventItem from "@components/home/EventItem";

const EventList = ({ data }) => {
  if (data === null) {
    return (
      <div className="event--list">
        <div className="event--item">이벤트가 없습니다.</div>
      </div>
    );
  }

  const settings = {
    rows: 1,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    vertical: true,
    verticalSwiping: true,
    contentMode: true,
    centerPadding: "30px",
    adaptiveHeight: true,
    accessibility: false
  };

  return (
    <div className="event--list">
      <Slider {...settings}>
        {data?.map((event) => (
          <EventItem key={event.eventId} event={event} />
        ))}
      </Slider>
    </div>
  );
};

export default EventList;
