import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { PortableText } from "@portabletext/react";

import Layout from "../components/Layout";
import PageShell from "../components/PageShell";

import { events as fallbackEvents, eventsPageContent } from "../data/events";

import "../css/eventos.css";

function Eventos() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState(fallbackEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const periodLabels = {
    past: "Evento encerrado",
    current: "Acontecendo agora",
    future: "Próximo evento",
  };

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        const { getEventsTimeline, getEventBySlug } =
          await import("../services/eventsService");

        const cmsEvents = await getEventsTimeline();

        if (!isMounted) {
          return;
        }

        const loadedEvents = cmsEvents.length > 0 ? cmsEvents : fallbackEvents;

        setEvents(loadedEvents);

        if (slug) {
          const eventFromTimeline = loadedEvents.find(
            (event) => event.slug === slug,
          );

          if (eventFromTimeline) {
            setSelectedEvent(eventFromTimeline);
            return;
          }

          const eventBySlug = await getEventBySlug(slug);

          if (isMounted && eventBySlug) {
            setSelectedEvent(eventBySlug);
            return;
          }
        }

        const currentEvent = loadedEvents.find(
          (event) => event.period === "current",
        );

        const nextFutureEvent = loadedEvents.find(
          (event) => event.period === "future",
        );

        const lastPastEvent = loadedEvents.find(
          (event) => event.period === "past",
        );

        setSelectedEvent(
          currentEvent ||
            nextFutureEvent ||
            lastPastEvent ||
            loadedEvents[0] ||
            null,
        );
      } catch (error) {
        console.error("Erro ao carregar eventos do Sanity:", error);

        if (isMounted) {
          setEvents(fallbackEvents);
          setSelectedEvent(fallbackEvents[0] ?? null);
          setLoadFailed(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const carouselEvents = useMemo(() => {
    const pastEvent = events.find((event) => event.period === "past");

    const currentEvents = events.filter((event) => event.period === "current");

    const futureEvents = events.filter((event) => event.period === "future");

    const result = [];

    if (pastEvent) {
      result.push(pastEvent);
    }

    if (currentEvents.length > 0) {
      result.push(currentEvents[0]);

      if (futureEvents.length > 0) {
        result.push(futureEvents[0]);
      }
    } else {
      result.push(...futureEvents.slice(0, 2));
    }

    return result.slice(0, 3);
  }, [events]);

  function handleSelectEvent(event) {
    setSelectedEvent(event);
    navigate(`/eventos/${encodeURIComponent(event.slug)}`);
  }

  return (
    <Layout>
      <PageShell className="events-page">
        <section className="events-section page-section">
          <div className="events-container page-container">
            <header className="events-hero">
              <div className="events-copy">
                <span className="events-tag">{eventsPageContent.eyebrow}</span>

                <h1 className="events-title">{eventsPageContent.title}</h1>

                <p className="events-lead">{eventsPageContent.lead}</p>
              </div>
            </header>

            <section className="events-showcase" aria-busy={loading}>
              {loading ? (
                <div className="events-empty" role="status">
                  <FaCalendarAlt aria-hidden="true" />

                  <div>
                    <h3>Carregando eventos</h3>
                    <p>Buscando os eventos da Chouga.</p>
                  </div>
                </div>
              ) : carouselEvents.length > 0 ? (
                <>
                  <div className="events-carousel">
                    {carouselEvents.map((event) => (
                      <button
                        type="button"
                        key={event.id}
                        className={`event-card event-card--${event.period} ${
                          selectedEvent?.id === event.id
                            ? "event-card--selected"
                            : ""
                        }`}
                        onClick={() => handleSelectEvent(event)}
                      >
                        <div
                          className={`event-card-media ${
                            event.image ? "" : "event-card-media--fallback"
                          }`}
                        >
                          {event.image ? (
                            <img
                              src={event.image.cardUrl}
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
                    ))}
                  </div>

                  {selectedEvent && (
                    <article className="event-selected">
                      <header className="event-selected-header">
                        <span className="event-period">
                          {periodLabels[selectedEvent.period] ?? "Evento"}
                        </span>

                        <h2>{selectedEvent.title}</h2>

                        <time
                          className="event-date"
                          dateTime={selectedEvent.date}
                        >
                          {selectedEvent.displayDate}
                        </time>

                        <p className="event-location">
                          <FaMapMarkerAlt aria-hidden="true" />
                          {selectedEvent.location}
                        </p>

                        {selectedEvent.summary && (
                          <p className="event-description">
                            {selectedEvent.summary}
                          </p>
                        )}
                      </header>

                      {selectedEvent.description?.length > 0 && (
                        <div className="event-selected-description">
                          <PortableText value={selectedEvent.description} />
                        </div>
                      )}
                    </article>
                  )}
                </>
              ) : (
                <div className="events-empty">
                  <div>
                    <h3>
                      {loadFailed
                        ? "Eventos temporariamente indisponíveis"
                        : eventsPageContent.emptyTitle}
                    </h3>

                    <p>
                      {loadFailed
                        ? "Não foi possível atualizar os eventos agora. Tente novamente mais tarde."
                        : eventsPageContent.emptyText}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>
      </PageShell>
    </Layout>
  );
}

export default Eventos;
