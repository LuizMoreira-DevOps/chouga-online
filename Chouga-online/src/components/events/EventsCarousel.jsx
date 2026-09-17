import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

import "swiper/css";
import "swiper/css/effect-coverflow";

function EventsCarousel({
  events,
  selectedEvent,
  selectedIndex,
  periodLabels,
  onSlideChange,
  onSelectEvent,
}) {
  return (
    <section className="events-showcase">
      <Swiper
        className="events-carousel"
        modules={[EffectCoverflow]}
        effect="coverflow"
        centeredSlides
        grabCursor
        slideToClickedSlide
        slidesPerView="auto"
        initialSlide={selectedIndex >= 0 ? selectedIndex : 0}
        onSlideChange={onSlideChange}
        coverflowEffect={{
          rotate: 0,
          stretch: 70,
          depth: 140,
          modifier: 1.1,
          slideShadows: false,
        }}
      >
        {events.map((event) => (
          <SwiperSlide className="event-slide" key={event.id}>
            <button
              type="button"
              className={`event-card event-card--${event.period} ${
                selectedEvent?.id === event.id ? "event-card--selected" : ""
              }`}
              onClick={() => onSelectEvent(event)}
            >
              <div
                className={`event-card-media ${
                  event.image ? "" : "event-card-media--fallback"
                }`}
              >
                {event.image ? (
                  <img
                    src={event.image.detailUrl}
                    alt={event.image.alt}
                    loading="lazy"
                    width="720"
                    height="480"
                  />
                ) : (
                  <FaCalendarAlt aria-hidden="true" />
                )}
              </div>

              <div className="event-card-content">
                <span className="event-period">
                  {periodLabels[event.period] ?? "Evento"}
                </span>

                <h3>{event.title}</h3>

                <time className="event-date" dateTime={event.date}>
                  {event.displayDate}
                </time>

                <p className="event-location">
                  <FaMapMarkerAlt aria-hidden="true" />
                  {event.location}
                </p>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default EventsCarousel;
