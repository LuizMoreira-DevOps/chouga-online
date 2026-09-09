export const eventsPageContent = Object.freeze({
  eyebrow: "Chouga na rua",
  title: "Eventos",
  lead: "Sessões, campeonatos e encontros que fortalecem a cena do skate.",
  sectionTitle: "Agenda de eventos",
  emptyTitle: "Novas datas em breve",
  emptyText:
    "A agenda está sendo preparada. Acompanhe a Chouga para não perder o próximo rolê.",
});

/*
 * Conteúdo local usado como fallback quando o CMS estiver indisponível.
 *
 * Contrato consumido pela página:
 * {
 *   id: string,
 *   title: string,
 *   date: string,
 *   endDate: string,
 *   period: "past" | "current" | "future",
 *   displayDate: string,
 *   location: string,
 *   description: string,
 *   url?: string
 * }
 */
export const events = Object.freeze([]);
