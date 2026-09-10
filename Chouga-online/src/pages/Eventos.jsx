import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

import Layout from "../components/Layout";
import PageShell from "../components/PageShell";

import { events as fallbackEvents, eventsPageContent } from "../data/events";

import "../css/eventos.css";

function Eventos() {
  const [events, setEvents] = useState(fallbackEvents);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const periodLabels = {
    past: "Último evento realizado",
    current: "Acontecendo agora",
    future: "Evento futuro",
  };

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        const { getEventsTimeline } = await import("../services/eventsService");
        const cmsEvents = await getEventsTimeline();

        if (isMounted) {
          setEvents(cmsEvents.length > 0 ? cmsEvents : fallbackEvents);
        }
      } catch (error) {
        console.error("Erro ao carregar eventos do Sanity:", error);

        if (isMounted) {
          setEvents(fallbackEvents);
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
  }, []);

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

              <div className="events-hero-mark" aria-hidden="true">
                <FaCalendarAlt />
                <span>Agenda Chouga</span>
              </div>
            </header>

            <section
              className="events-agenda"
              aria-labelledby="events-agenda-title"
              aria-busy={loading}
            >
              <div className="events-section-heading">
                <h2 id="events-agenda-title">
                  {eventsPageContent.sectionTitle}
                </h2>
              </div>

              {loading ? (
                <div className="events-empty" role="status">
                  <FaCalendarAlt aria-hidden="true" />

                  <div>
                    <h3>Carregando agenda</h3>
                    <p>Buscando a agenda de eventos da Chouga.</p>
                  </div>
                </div>
              ) : events.length > 0 ? (
                <div className="events-grid">
                  {events.map((event) => (
                    <article
                      className={`event-card event-card--${event.period}`}
                      key={event.id}
                    >
                      <Link
                        className="event-card-link"
                        to={`/eventos/${encodeURIComponent(event.slug)}`}
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

                          <time className="event-date" dateTime={event.date}>
                            {event.displayDate}
                          </time>

                          <h3>{event.title}</h3>

                          <p className="event-location">
                            <FaMapMarkerAlt aria-hidden="true" />
                            {event.location}
                          </p>

                          {event.summary && (
                            <p className="event-description">{event.summary}</p>
                          )}

                          <span className="event-card-action">
                            Ver detalhes <span aria-hidden="true">→</span>
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="events-empty">
                  <FaCalendarAlt aria-hidden="true" />

                  <div>
                    <h3>
                      {loadFailed
                        ? "Agenda temporariamente indisponível"
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
