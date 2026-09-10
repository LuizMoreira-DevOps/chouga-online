import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import { Link, useParams } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

import Breadcrumb from "../components/Breadcrumb";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import "../css/eventoDetalhes.css";

const periodLabels = {
  past: "Evento encerrado",
  current: "Acontecendo agora",
  future: "Próximo evento",
};

/* Função para renderizar links dentro do PortableText, garantindo que links externos abram em nova aba */
const portableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

/* Página de detalhes de um evento específico */
function EventoDetalhes() {
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [slug]);

  useEffect(() => {
    let isMounted = true;

    /* Função para carregar os detalhes do evento a partir do slug */
    async function loadEvent() {
      try {
        setLoading(true);
        setLoadFailed(false);

        const { getEventBySlug } = await import("../services/eventsService");

        const eventData = await getEventBySlug(slug);

        if (isMounted) {
          setEvent(eventData);
        }
      } catch (error) {
        console.error("Erro ao carregar evento do Sanity:", error);

        if (isMounted) {
          setEvent(null);
          setLoadFailed(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  /* Atualiza o título da página com o nome do evento */
  useEffect(() => {
    if (!event) {
      return undefined;
    }

    const previousTitle = document.title;
    document.title = `${event.title} | Chouga Skateboard`;

    return () => {
      document.title = previousTitle;
    };
  }, [event]);

  /* Renderizações condicionais para diferentes estados da página */
  if (loading) {
    return (
      <Layout>
        <PageShell className="event-detail-page">
          <section className="event-detail-status page-section">
            <p>Carregando evento...</p>
          </section>
        </PageShell>
      </Layout>
    );
  }

  /* Renderiza uma mensagem de erro caso o carregamento do evento falhe */
  if (loadFailed) {
    return (
      <Layout>
        <PageShell className="event-detail-page">
          <section className="event-detail-status page-section">
            <h1>Não foi possível carregar o evento</h1>
            <p>Tente novamente em alguns instantes.</p>
            <Link className="action" to="/eventos">
              Voltar para eventos
            </Link>
          </section>
        </PageShell>
      </Layout>
    );
  }

  /* Renderiza uma mensagem caso o evento não seja encontrado */
  if (!event) {
    return (
      <Layout>
        <PageShell className="event-detail-page">
          <section className="event-detail-status page-section">
            <h1>Evento não encontrado</h1>
            <p>O evento pode não existir ou ainda não estar publicado.</p>
            <Link className="action" to="/eventos">
              Voltar para eventos
            </Link>
          </section>
        </PageShell>
      </Layout>
    );
  }

  /* Renderiza os detalhes do evento quando os dados são carregados com sucesso */
  return (
    <Layout>
      <PageShell className="event-detail-page">
        <Breadcrumb
          items={[
            { label: "Eventos", path: "/eventos" },
            { label: event.title },
          ]}
        />

        <section className="event-detail page-container">
          <div className="event-detail-media">
            {event.image ? (
              <img
                src={event.image.detailUrl}
                alt={event.image.alt}
                width="1440"
              />
            ) : (
              <div className="event-detail-image-fallback">
                <FaCalendarAlt aria-hidden="true" />
                <span>Imagem de divulgação indisponível</span>
              </div>
            )}
          </div>

          <article className="event-detail-content">
            <span className={`event-detail-period is-${event.period}`}>
              {periodLabels[event.period] ?? "Evento"}
            </span>

            <h1>{event.title}</h1>

            <div className="event-detail-date">
              <FaCalendarAlt aria-hidden="true" />

              <p>
                <time dateTime={event.date}>{event.displayDate}</time>
                <span> até </span>
                <time dateTime={event.endDate}>{event.displayEndDate}</time>
              </p>
            </div>

            <div className="event-detail-location">
              <FaMapMarkerAlt aria-hidden="true" />
              <p>{event.location}</p>
            </div>

            {event.summary && (
              <p className="event-detail-summary">{event.summary}</p>
            )}

            {event.description.length > 0 && (
              <section className="event-detail-description">
                <PortableText
                  value={event.description}
                  components={portableTextComponents}
                />
              </section>
            )}

            <div className="event-detail-actions">
              {event.locationDetails?.mapsUrl && (
                <a
                  className="action action-secondary"
                  href={event.locationDetails.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver localização
                </a>
              )}

              {event.url && (
                <a
                  className="action"
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mais informações
                </a>
              )}
            </div>
          </article>
        </section>
      </PageShell>
    </Layout>
  );
}

export default EventoDetalhes;
