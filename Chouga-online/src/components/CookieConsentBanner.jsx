import { useState } from "react";
import { useLocation } from "react-router-dom";

import {
  denyClarityConsent,
  grantClarityConsent,
} from "../services/clarity.js";
import {
  denyGoogleAnalytics,
  getCookiePreferences,
  grantGoogleAnalytics,
  saveCookiePreferences,
  trackPageView,
} from "../services/googleAnalytics.js";

import "../css/CookieConsentBanner.css";

export default function CookieConsentBanner() {
  const location = useLocation();
  const storedPreferences = getCookiePreferences();

  const [isVisible, setIsVisible] = useState(() => storedPreferences === null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    () => storedPreferences?.analytics ?? false,
  );

  function trackCurrentPage() {
    const path = `${location.pathname}${location.search}${location.hash}`;

    trackPageView(path);
  }

  function handleAcceptAll() {
    grantGoogleAnalytics();
    grantClarityConsent();
    trackCurrentPage();

    setAnalyticsEnabled(true);
    setIsVisible(false);
  }

  function handleRejectNonEssential() {
    denyGoogleAnalytics();
    denyClarityConsent();

    setAnalyticsEnabled(false);
    setIsVisible(false);
  }

  function handleSavePreferences() {
    saveCookiePreferences({
      necessary: true,
      analytics: analyticsEnabled,
    });

    if (analyticsEnabled) {
      grantGoogleAnalytics();
      grantClarityConsent();
      trackCurrentPage();
    } else {
      denyGoogleAnalytics();
      denyClarityConsent();
    }

    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className="cookie-consent"
      aria-label="Preferências de privacidade"
      role="dialog"
      aria-modal="false"
      aria-live="polite"
    >
      <div className="cookie-consent__content">
        {!isCustomizing ? (
          <>
            <div className="cookie-consent__text">
              <h2>Privacidade e cookies</h2>

              <p>
                Usamos cookies necessários para o funcionamento do site e, com
                sua autorização, cookies analíticos para entender a navegação e
                melhorar sua experiência.
              </p>
            </div>

            <div className="cookie-consent__actions">
              <button
                className="cookie-consent__button cookie-consent__button--reject"
                type="button"
                onClick={handleRejectNonEssential}
              >
                Rejeitar não necessários
              </button>

              <button
                className="cookie-consent__button cookie-consent__button--customize"
                type="button"
                onClick={() => setIsCustomizing(true)}
              >
                Personalizar
              </button>

              <button
                className="cookie-consent__button cookie-consent__button--accept"
                type="button"
                onClick={handleAcceptAll}
              >
                Aceitar todos
              </button>
            </div>
          </>
        ) : (
          <div className="cookie-consent__preferences">
            <div className="cookie-consent__preferences-header">
              <div>
                <h2>Preferências de cookies</h2>

                <p>Escolha quais categorias opcionais podem ser utilizadas.</p>
              </div>

              <button
                className="cookie-consent__back"
                type="button"
                onClick={() => setIsCustomizing(false)}
              >
                Voltar
              </button>
            </div>

            <div className="cookie-consent__category">
              <div>
                <h3>Necessários</h3>

                <p>
                  Essenciais para o funcionamento do site e para armazenar suas
                  escolhas de privacidade.
                </p>
              </div>

              <span className="cookie-consent__required">Sempre ativos</span>
            </div>

            <div className="cookie-consent__category">
              <div>
                <h3>Analíticos</h3>

                <p>
                  Permitem compreender o uso do site por meio do Google
                  Analytics e do Microsoft Clarity.
                </p>
              </div>

              <label className="cookie-consent__switch">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(event) =>
                    setAnalyticsEnabled(event.target.checked)
                  }
                />

                <span className="cookie-consent__slider" aria-hidden="true" />
                <span className="sr-only">Ativar cookies analíticos</span>
              </label>
            </div>

            <div className="cookie-consent__actions">
              <button
                className="cookie-consent__button cookie-consent__button--reject"
                type="button"
                onClick={handleRejectNonEssential}
              >
                Rejeitar não necessários
              </button>

              <button
                className="cookie-consent__button cookie-consent__button--accept"
                type="button"
                onClick={handleSavePreferences}
              >
                Salvar preferências
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
