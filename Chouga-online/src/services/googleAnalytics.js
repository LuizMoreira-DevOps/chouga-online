const COOKIE_PREFERENCES_KEY = "chouga-cookie-preferences";
const LEGACY_CONSENT_KEY = "chouga-analytics-consent";

let isInitialized = false;

const DEFAULT_PREFERENCES = {
  necessary: true,
  analytics: false,
};

function getMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID;
}

function configureDataLayer() {
  window.dataLayer = window.dataLayer || [];

  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
}

function normalizePreferences(preferences) {
  return {
    necessary: true,
    analytics: Boolean(preferences?.analytics),
  };
}

function migrateLegacyConsent() {
  const legacyConsent = localStorage.getItem(LEGACY_CONSENT_KEY);

  if (!legacyConsent) {
    return null;
  }

  const preferences = {
    ...DEFAULT_PREFERENCES,
    analytics: legacyConsent === "granted",
  };

  localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));

  localStorage.removeItem(LEGACY_CONSENT_KEY);

  return preferences;
}

export function getCookiePreferences() {
  const storedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

  if (!storedPreferences) {
    return migrateLegacyConsent();
  }

  try {
    return normalizePreferences(JSON.parse(storedPreferences));
  } catch {
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    return null;
  }
}

export function saveCookiePreferences(preferences) {
  const normalizedPreferences = normalizePreferences(preferences);

  localStorage.setItem(
    COOKIE_PREFERENCES_KEY,
    JSON.stringify(normalizedPreferences),
  );

  return normalizedPreferences;
}

export function hasAnalyticsConsent() {
  return getCookiePreferences()?.analytics === true;
}

export function initializeGoogleAnalytics() {
  const measurementId = getMeasurementId();

  if (
    !import.meta.env.PROD ||
    !measurementId ||
    isInitialized ||
    !hasAnalyticsConsent()
  ) {
    return false;
  }

  configureDataLayer();

  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  window.gtag("js", new Date());

  window.gtag("config", measurementId, {
    send_page_view: false,
  });

  const script = document.createElement("script");

  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.googleAnalytics = "true";

  document.head.appendChild(script);

  isInitialized = true;

  return true;
}

export function grantGoogleAnalytics() {
  saveCookiePreferences({
    necessary: true,
    analytics: true,
  });

  return initializeGoogleAnalytics();
}

export function denyGoogleAnalytics() {
  saveCookiePreferences({
    necessary: true,
    analytics: false,
  });

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
}

export function trackPageView(path) {
  const measurementId = getMeasurementId();

  if (
    !import.meta.env.PROD ||
    !measurementId ||
    !isInitialized ||
    !hasAnalyticsConsent() ||
    typeof window.gtag !== "function"
  ) {
    return false;
  }

  window.gtag("event", "page_view", {
    send_to: measurementId,
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });

  return true;
}
