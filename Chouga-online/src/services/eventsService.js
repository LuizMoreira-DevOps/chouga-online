import { defineQuery } from "groq";

import { isSanityConfigured, sanityClient } from "../lib/sanityClient";

const UPCOMING_EVENTS_QUERY = defineQuery(/* groq */ `
  *[
    _type == "event" &&
    eventStatus in ["scheduled", "postponed"] &&
    defined(startDate) &&
    defined(endDate) &&
    endDate >= now()
  ] | order(startDate asc) {
    _id,
    title,
    summary,
    startDate,
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

function normalizeEvent(event) {
  if (!event?._id || !event.title || !event.startDate) {
    return null;
  }

  return {
    id: event._id,
    title: event.title,
    date: event.startDate,
    displayDate: formatEventDate(event.startDate, event.timezone),
    location: formatEventLocation(event.location),
    description: event.summary || "",
    url: event.externalUrl || undefined,
    status: event.eventStatus,
    prominence: event.prominence,
  };
}

export async function getUpcomingEvents() {
  if (!isSanityConfigured || !sanityClient) {
    return [];
  }

  const documents = await sanityClient.fetch(UPCOMING_EVENTS_QUERY);

  return (documents ?? []).map(normalizeEvent).filter(Boolean);
}
