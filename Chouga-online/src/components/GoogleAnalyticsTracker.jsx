import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { trackPageView } from "../services/googleAnalytics.js";

export default function GoogleAnalyticsTracker() {
  const location = useLocation();
  const lastTrackedPath = useRef("");

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;

    if (lastTrackedPath.current === path) {
      return;
    }

    lastTrackedPath.current = path;
    trackPageView(path);
  }, [location]);

  return null;
}
