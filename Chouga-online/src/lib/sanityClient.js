import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID?.trim();
const dataset = import.meta.env.VITE_SANITY_DATASET?.trim();

export const isSanityConfigured = Boolean(projectId && dataset);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2026-09-09",
      perspective: "published",
      useCdn: import.meta.env.PROD,
    })
  : null;
