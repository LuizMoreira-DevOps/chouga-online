import { useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";

function EventsMobileReel({ events, selectedIndex }) {
  const reelRef = useRef(null);

  useEffect(() => {
    if (selectedIndex < 0 || !reelRef.current) {
      return;
    }

    const reel = reelRef.current;

    reel.scrollTo({
      top: selectedIndex * reel.clientHeight,
      behavior: "instant",
    });
  }, [selectedIndex]);

  return (
    <main className="events-mobile">
      <div className="events-reel" ref={reelRef}>
        {events.map((event) => (
          <article className="event-reel-item" key={event.id}>
            {event.image ? (
              <img
                src={event.image.detailUrl}
                alt={event.image.alt}
                loading="lazy"
              />
            ) : (
              <div className="event-reel-fallback">
                <FaCalendarAlt aria-hidden="true" />
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}

export default EventsMobileReel;
