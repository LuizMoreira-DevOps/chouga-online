import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import EventsMobileReel from "../components/events/EventsMobileReel";
import EventsCarousel from "../components/events/EventsCarousel";

import { events as fallbackEvents, eventsPageContent } from "../data/events";

import "../css/eventos.css";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    function handleChange() {
      setMatches(mediaQuery.matches);
    }

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

function Eventos() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const isReelViewport = useMediaQuery("(max-width: 349px)");

  const [events, setEvents] = useState(fallbackEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [previewEvent, setPreviewEvent] = useState(null);
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

  const displayEvents = useMemo(() => {
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

  const selectedIndex = displayEvents.findIndex(
    (event) => event.id === selectedEvent?.id,
  );

  function handleSlideChange(swiper) {
    const event = displayEvents[swiper.activeIndex];

    if (!event || event.id === selectedEvent?.id) {
      return;
    }

    setSelectedEvent(event);

    navigate(`/eventos/${encodeURIComponent(event.slug)}`, {
      replace: true,
    });
  }

  function handleSelectEvent(event) {
    setSelectedEvent(event);
    setPreviewEvent(event);

    navigate(`/eventos/${encodeURIComponent(event.slug)}`);
  }

  if (loading) {
    return (
      <Layout>
        <PageShell className="events-page">
          <div className="events-empty" role="status">
            <FaCalendarAlt aria-hidden="true" />

            <div>
              <h3>Carregando eventos</h3>
              <p>Buscando os eventos da Chouga.</p>
            </div>
          </div>
        </PageShell>
      </Layout>
    );
  }

  if (displayEvents.length === 0) {
    return (
      <Layout>
        <PageShell className="events-page">
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
        </PageShell>
      </Layout>
    );
  }

  if (isReelViewport) {
    return (
      <Layout hideFooter>
        <EventsMobileReel
          events={displayEvents}
          selectedIndex={selectedIndex}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageShell className="events-page events-page--carousel">
        <section className="events-section page-section">
          <div className="events-container page-container">
            <EventsCarousel
              events={displayEvents}
              selectedEvent={selectedEvent}
              selectedIndex={selectedIndex}
              periodLabels={periodLabels}
              onSlideChange={handleSlideChange}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        </section>
      </PageShell>

      {previewEvent?.image && (
        <div
          className="event-preview"
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização de ${previewEvent.title}`}
        >
          <button
            type="button"
            className="event-preview-close"
            onClick={() => setPreviewEvent(null)}
            aria-label="Fechar visualização"
          >
            ×
          </button>

          <img
            src={previewEvent.image.detailUrl}
            alt={previewEvent.image.alt}
          />
        </div>
      )}
    </Layout>
  );
}

export default Eventos;
