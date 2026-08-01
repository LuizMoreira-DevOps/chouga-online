import Clarity from "@microsoft/clarity";

import { hasAnalyticsConsent } from "./googleAnalytics.js";

let isInitialized = false;

export function initializeClarity() {
  const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

  if (
    !import.meta.env.PROD ||
    !projectId ||
    isInitialized ||
    !hasAnalyticsConsent()
  ) {
    return false;
  }

  Clarity.init(projectId);

  Clarity.consentV2({
    ad_Storage: "denied",
    analytics_Storage: "granted",
  });

  isInitialized = true;

  return true;
}

export function grantClarityConsent() {
  if (!isInitialized) {
    return initializeClarity();
  }

  Clarity.consentV2({
    ad_Storage: "denied",
    analytics_Storage: "granted",
  });

  return true;
}

export function denyClarityConsent() {
  if (!isInitialized) {
    return false;
  }

  Clarity.consentV2({
    ad_Storage: "denied",
    analytics_Storage: "denied",
  });

  return true;
}
