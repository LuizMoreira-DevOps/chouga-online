import { createClient } from "@sanity/client";
import { defineQuery } from "groq";
import { loadEnv } from "vite";

const PUBLISHED_EVENTS_QUERY = defineQuery(/* groq */ `
  *[
    _type == "event" &&
    eventStatus in ["scheduled", "postponed"] &&
    defined(title) &&
    defined(slug.current) &&
    defined(startDate) &&
    defined(endDate)
  ] | order(startDate asc) {
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    summary,
    startDate,
    endDate
  }
`);

function createSanityBuildClient(projectDirectory) {
  const mode =
    process.env.NODE_ENV === "development" ? "development" : "production";

  const env = loadEnv(mode, projectDirectory, "VITE_");

  const projectId =
    process.env.VITE_SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID;

  const dataset = process.env.VITE_SANITY_DATASET || env.VITE_SANITY_DATASET;

  if (!projectId || !dataset) {
    throw new Error(
      "VITE_SANITY_PROJECT_ID e VITE_SANITY_DATASET são obrigatórias para gerar as páginas dos eventos.",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-09-09",
    perspective: "published",
    useCdn: false,
  });
}

export async function fetchPublishedEvents(projectDirectory) {
  const sanity = createSanityBuildClient(projectDirectory);

  return sanity.fetch(PUBLISHED_EVENTS_QUERY);
}
