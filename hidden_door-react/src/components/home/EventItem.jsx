import { Link } from "react-router-dom";

const EventItem = ({ event }) => {
  const description =
    event.description.length > 30
      ? `${event.description.slice(0, 30)}...`
      : event.description;

  return (
    <Link to="/hidden_door/event" className="container event--item">
      <div className="event--item--title">{event.title}: </div>
      <div className="event--item--description">{description}</div>
    </Link>
  );
};

export default EventItem;
