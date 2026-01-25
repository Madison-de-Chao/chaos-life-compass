import { useEffect, useRef } from "react";
import { useCookieConsent } from "@/components/CookieConsentBanner";

// Replace with your Google Analytics Measurement ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics integration that respects cookie consent preferences.
 * Only loads and tracks when user has accepted analytics cookies.
 */
export const GoogleAnalytics = () => {
  const { hasConsented, allowsAnalytics } = useCookieConsent();
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Don't do anything if no GA ID configured
    if (!GA_MEASUREMENT_ID) {
      console.info("[GA] No Measurement ID configured");
      return;
    }

    // Only proceed if user has consented and allows analytics
    if (!hasConsented) {
      return;
    }

    if (allowsAnalytics) {
      // User allows analytics - load GA
      if (!scriptLoadedRef.current) {
        loadGoogleAnalytics();
        scriptLoadedRef.current = true;
      }
      // Enable tracking
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
      });
    } else {
      // User rejected analytics - disable tracking
      window.gtag?.("consent", "update", {
        analytics_storage: "denied",
      });
      
      // Remove GA cookies if they exist
      removeGACookies();
    }
  }, [hasConsented, allowsAnalytics]);

  return null;
};

/**
 * Load Google Analytics script dynamically
 */
function loadGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Set default consent state (denied until user accepts)
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
  });

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true, // GDPR compliance
    send_page_view: true,
  });

  // Load the GA script
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  console.info("[GA] Google Analytics loaded");
}

/**
 * Remove Google Analytics cookies when user revokes consent
 */
function removeGACookies() {
  const cookies = document.cookie.split(";");
  const gaCookies = cookies.filter(
    (cookie) =>
      cookie.trim().startsWith("_ga") ||
      cookie.trim().startsWith("_gid") ||
      cookie.trim().startsWith("_gat")
  );

  gaCookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();
    // Remove cookie by setting expiry in the past
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  });

  if (gaCookies.length > 0) {
    console.info("[GA] Removed GA cookies");
  }
}

/**
 * Hook to track page views manually
 */
export const usePageView = (path?: string) => {
  const { allowsAnalytics } = useCookieConsent();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !allowsAnalytics) return;

    const pagePath = path || window.location.pathname + window.location.search;
    window.gtag?.("event", "page_view", {
      page_path: pagePath,
    });
  }, [path, allowsAnalytics]);
};

/**
 * Track custom events (only if analytics consent given)
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (!GA_MEASUREMENT_ID) return;
  
  // Check consent from localStorage directly for non-hook usage
  const stored = localStorage.getItem("cookie-consent-preferences");
  if (!stored) return;
  
  try {
    const prefs = JSON.parse(stored);
    if (!prefs.analytics) return;
  } catch {
    return;
  }

  window.gtag?.("event", eventName, eventParams);
};

export default GoogleAnalytics;
