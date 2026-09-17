const validSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function describeEvent(event) {
  const title = String(event?.title ?? "").trim();
  const id = String(event?._id ?? "").trim();

  if (title && id) {
    return `${title} (${id})`;
  }

  return title || id || "evento sem identificação";
}

export function validateEventSlugs(events) {
  if (!Array.isArray(events)) {
    throw new TypeError(
      "A lista de eventos utilizada pelo SSG deve ser um array.",
    );
  }

  const validatedEvents = [];
  const usedSlugs = new Set();

  for (const event of events) {
    const slug = String(event?.slug ?? "").trim();
    const eventLabel = describeEvent(event);

    if (!slug) {
      throw new Error(`Evento publicado sem slug válido: ${eventLabel}.`);
    }

    if (!validSlugPattern.test(slug)) {
      throw new Error(`Slug inválido no evento ${eventLabel}: "${slug}".`);
    }

    if (usedSlugs.has(slug)) {
      throw new Error(
        `Slug duplicado encontrado nos eventos publicados: "${slug}".`,
      );
    }

    usedSlugs.add(slug);
    validatedEvents.push({ ...event, slug });
  }

  return validatedEvents;
}
