import { defineQuery } from "groq";

import { isSanityConfigured, sanityClient } from "../lib/sanityClient";

const EVENTS_TIMELINE_QUERY = defineQuery(/* groq */ `
  {
    "lastCompleted": *[
      _type == "event" &&
      eventStatus in ["scheduled", "postponed"] &&
      defined(startDate) &&
      defined(endDate) &&
      endDate < now()
    ] | order(endDate desc)[0] {
      _id,
      title,
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
      externalUrl
    },

    "current": *[
      _type == "event" &&
      eventStatus in ["scheduled", "postponed"] &&
      defined(startDate) &&
      defined(endDate) &&
      startDate <= now() &&
      endDate >= now()
    ] | order(startDate asc) {
      _id,
      title,
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
      externalUrl
    },

    "future": *[
      _type == "event" &&
      eventStatus in ["scheduled", "postponed"] &&
      defined(startDate) &&
      defined(endDate) &&
      startDate > now()
    ] | order(startDate asc) {
      _id,
      title,
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
      externalUrl
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

function normalizeEvent(event, period) {
  if (!event?._id || !event.title || !event.startDate || !event.endDate) {
    return null;
  }

  return {
    id: event._id,
    title: event.title,
    date: event.startDate,
    endDate: event.endDate,
    displayDate: formatEventDate(event.startDate, event.timezone),
    location: formatEventLocation(event.location),
    description: event.summary || "",
    url: event.externalUrl || undefined,
    status: event.eventStatus,
    prominence: event.prominence,
    period,
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
