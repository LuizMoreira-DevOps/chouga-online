import { defineQuery } from "groq";

import { isSanityConfigured, sanityClient } from "../lib/sanityClient";
import { buildSanityImageUrl } from "../lib/sanityImage";

const EVENT_LIST_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  summary,
  startDate,
  endDate,
  timezone,
  eventStatus,
  prominence,
  location {
    venue,
    city,
    state
  },
  externalUrl,
  image {
    asset,
    alt,
    hotspot,
    crop,
    "lqip": asset->metadata.lqip
  }
`;

const EVENTS_TIMELINE_QUERY = defineQuery(/* groq */ `
  {
    "lastCompleted": *[
      _type == "event" &&
      eventStatus in ["scheduled", "postponed"] &&
      defined(slug.current) &&
      defined(startDate) &&
      defined(endDate) &&
      endDate < now()
    ] | order(endDate desc)[0] {
      ${EVENT_LIST_FIELDS}
    },

    "current": *[
      _type == "event" &&
      eventStatus in ["scheduled", "postponed"] &&
      defined(slug.current) &&
      defined(startDate) &&
      defined(endDate) &&
      startDate <= now() &&
      endDate >= now()
    ] | order(startDate asc) {
      ${EVENT_LIST_FIELDS}
    },

    "future": *[
      _type == "event" &&
      eventStatus in ["scheduled", "postponed"] &&
      defined(slug.current) &&
      defined(startDate) &&
      defined(endDate) &&
      startDate > now()
    ] | order(startDate asc) {
      ${EVENT_LIST_FIELDS}
    }
  }
`);

const EVENT_DETAIL_QUERY = defineQuery(/* groq */ `
  *[
    _type == "event" &&
    slug.current == $slug &&
    eventStatus in ["scheduled", "postponed"]
  ][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    description,
    startDate,
    endDate,
    timezone,
    eventStatus,
    prominence,
    location {
      venue,
      address,
      city,
      state,
      mapsUrl
    },
    externalUrl,
    image {
      asset,
      alt,
      hotspot,
      crop,
      "lqip": asset->metadata.lqip
    }
  }
`);

function formatEventDate(date, timezone) {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone || "America/Sao_Paulo",
  };

  try {
    return new Intl.DateTimeFormat("pt-BR", options).format(new Date(date));
  } catch {
    return new Intl.DateTimeFormat("pt-BR", {
      ...options,
      timeZone: "America/Sao_Paulo",
    }).format(new Date(date));
  }
}

function formatEventLocation(location) {
  if (!location) {
    return "Local a definir";
  }

  const cityAndState = [location.city, location.state]
    .filter(Boolean)
    .join("/");

  return [location.venue, cityAndState].filter(Boolean).join(" · ");
}

function getEventPeriod(event) {
  const now = Date.now();
  const startDate = Date.parse(event.startDate);
  const endDate = Date.parse(event.endDate);

  if (endDate < now) {
    return "past";
  }

  if (startDate <= now && endDate >= now) {
    return "current";
  }

  return "future";
}

function normalizeEventImage(image, title) {
  if (!image?.asset) {
    return null;
  }

  const cardUrl = buildSanityImageUrl(image, {
    width: 720,
    height: 480,
  });

  const detailUrl = buildSanityImageUrl(image, {
    width: 1440,
  });

  if (!cardUrl || !detailUrl) {
    return null;
  }

  return {
    alt: image.alt?.trim() || `Imagem de divulgação de ${title}`,
    cardUrl,
    detailUrl,
    lqip: image.lqip || undefined,
  };
}

function normalizeEvent(event, period) {
  if (
    !event?._id ||
    !event.title ||
    !event.slug ||
    !event.startDate ||
    !event.endDate
  ) {
    return null;
  }

  return {
    id: event._id,
    slug: event.slug,
    title: event.title,
    date: event.startDate,
    endDate: event.endDate,
    displayDate: formatEventDate(event.startDate, event.timezone),
    displayEndDate: formatEventDate(event.endDate, event.timezone),
    timezone: event.timezone || "America/Sao_Paulo",
    location: formatEventLocation(event.location),
    locationDetails: event.location || null,
    summary: event.summary || "",
    description: Array.isArray(event.description) ? event.description : [],
    image: normalizeEventImage(event.image, event.title),
    url: event.externalUrl || undefined,
    status: event.eventStatus,
    prominence: event.prominence,
    period: period || getEventPeriod(event),
  };
}

function normalizeEvents(events, period) {
  if (!Array.isArray(events)) {
    return [];
  }

  return events.map((event) => normalizeEvent(event, period)).filter(Boolean);
}

export async function getEventsTimeline() {
  if (!isSanityConfigured || !sanityClient) {
    return [];
  }

  const documents = await sanityClient.fetch(EVENTS_TIMELINE_QUERY);

  const lastCompleted = documents?.lastCompleted
    ? normalizeEvent(documents.lastCompleted, "past")
    : null;

  return [
    ...(lastCompleted ? [lastCompleted] : []),
    ...normalizeEvents(documents?.current, "current"),
    ...normalizeEvents(documents?.future, "future"),
  ];
}

export async function getEventBySlug(slug) {
  if (
    !isSanityConfigured ||
    !sanityClient ||
    typeof slug !== "string" ||
    !slug.trim()
  ) {
    return null;
  }

  const document = await sanityClient.fetch(EVENT_DETAIL_QUERY, {
    slug: slug.trim(),
  });

  return document ? normalizeEvent(document) : null;
}
