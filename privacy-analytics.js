/* Aule Engineering public-site GA4 usage analytics.
 * Pages, service exposure, calculator interest, contact-copy actions,
 * calls to action, navigation, and broad scroll depth only.
 * No client project data, email addresses, phone numbers, or form contents.
 * Visitors can switch analytics off on /privacy.html.
 */
(() => {
  "use strict";

  const ID = "G-Y0FHXT02K8";
  const KEY = "aule-analytics-optout-v2";
  const COOKIE = "aule_analytics_preference";
  const HOSTS = ["auleengineering.com", "www.auleengineering.com"];
  const live = HOSTS.includes(location.hostname);

  const serviceNames = new Set([
    "Pool & Spa Engineering",
    "Civil & Site Engineering",
    "Construction Engineering",
    "Project & Owner Representation"
  ]);
  const toolNames = {
    copestone: "Copestone",
    stormroute: "StormRoute"
  };
  const pageName = location.pathname.toLowerCase().endsWith("/privacy.html") ? "privacy" : "home";

  let allowed = false;
  let loaded = false;
  window.auleAnalyticsAllowed = false;

  function cookieChoice() {
    try {
      const entry = document.cookie.split(";").map(v => v.trim())
        .find(v => v.startsWith(COOKIE + "="));
      return entry ? entry.slice(COOKIE.length + 1) : null;
    } catch (_) {
      return null;
    }
  }

  function preference() {
    let stored = null;
    let legacy = null;
    try {
      stored = localStorage.getItem(KEY);
      legacy = localStorage.getItem("aule-analytics-consent-v1");
    } catch (_) { /* Cookie preference still applies. */ }
    const shared = cookieChoice();
    if (stored === "no" || shared === "no") return "no";
    if (stored === "yes" || shared === "yes") return "yes";
    return legacy === "no" ? "no" : null;
  }

  function savePreference(value) {
    try { localStorage.setItem(KEY, value); } catch (_) { /* Storage may be blocked. */ }
    if (live) {
      try {
        document.cookie = COOKIE + "=" + value +
          "; Max-Age=31536000; Path=/; SameSite=Lax; Secure; Domain=auleengineering.com";
      } catch (_) { /* Cookie may be blocked by browser settings. */ }
    }
  }

  function safePageUrl() {
    return location.origin + location.pathname;
  }

  function safeReferrer() {
    try {
      if (!document.referrer) return "";
      const url = new URL(document.referrer);
      return url.protocol === "https:" || url.protocol === "http:" ? url.origin + "/" : "";
    } catch (_) {
      return "";
    }
  }

  function gtag() {
    window.dataLayer.push(arguments);
  }

  function canTrack() {
    return live && loaded && allowed && preference() !== "no";
  }

  function event(name, attributes) {
    if (!canTrack()) return;
    gtag("event", name, Object.assign({
      site_page: pageName,
      page_location: safePageUrl(),
      page_referrer: safeReferrer()
    }, attributes || {}));
  }

  function sendPage() {
    event("page_view", {
      page_title: pageName === "privacy" ?
        "Aule Engineering | Website Privacy Notice" : "Aule Engineering | Home"
    });
  }

  function activate() {
    if (!live || allowed || preference() === "no") return;

    allowed = true;
    window.auleAnalyticsAllowed = true;
    window["ga-disable-" + ID] = false;

    if (loaded) {
      gtag("consent", "update", { analytics_storage: "granted" });
      sendPage();
      return;
    }

    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    gtag("js", new Date());
    gtag("config", ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 2592000,
      page_location: safePageUrl(),
      page_referrer: safeReferrer()
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ID);
    document.head.appendChild(script);
    sendPage();
  }

  function clearGaCookies() {
    document.cookie.split(";").forEach(part => {
      const name = part.trim().split("=")[0];
      if (name !== "_ga" && !/^_ga_[A-Za-z0-9_]+$/.test(name)) return;
      [null, location.hostname, "." + location.hostname, ".auleengineering.com"].forEach(domain => {
        document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax" +
          (domain ? "; domain=" + domain : "");
      });
    });
  }

  function updatePreferenceStatus() {
    const status = document.getElementById("aule-analytics-status");
    if (status) status.textContent = "Website usage analytics: " +
      (preference() === "no" ? "off" : "on");
  }

  function refuse() {
    savePreference("no");
    allowed = false;
    window.auleAnalyticsAllowed = false;
    window["ga-disable-" + ID] = true;
    if (loaded) gtag("consent", "update", { analytics_storage: "denied" });
    clearGaCookies();
    updatePreferenceStatus();
  }

  function decide(value) {
    if (value === "no") {
      refuse();
    } else {
      savePreference("yes");
      activate();
      updatePreferenceStatus();
    }
  }

  function installClickEvents() {
    document.addEventListener("click", e => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;

      const copy = el.closest("button[data-analytics-contact]");
      if (copy) {
        const method = copy.dataset.analyticsContact;
        if (method === "phone" || method === "email") {
          // This is a button-click intent, not proof an inquiry was sent.
          event("contact_copy_click", { contact_method: method });
        }
        return;
      }

      const link = el.closest("a[href]");
      if (!link) return;

      const tool = link.dataset.tool;
      if (Object.prototype.hasOwnProperty.call(toolNames, tool)) {
        let destinationDomain = "";
        try { destinationDomain = new URL(link.href).hostname; } catch (_) { /* Ignore malformed links. */ }
        event("tool_launch_click", {
          tool_name: toolNames[tool],
          placement: "calculator_card",
          destination_domain: destinationDomain
        });
        return;
      }

      const cta = link.dataset.analyticsCta;
      if (cta === "request_services") {
        event("service_request_click", {
          placement: link.dataset.analyticsPlacement || "unknown"
        });
        return;
      }
      if (cta === "view_capabilities") {
        event("cta_click", { cta_name: "view_capabilities", placement: "hero" });
        return;
      }

      if (link.classList.contains("navlink")) {
        const target = link.dataset.analyticsNav;
        if (["services", "about", "tools", "contact"].includes(target)) {
          event("navigation_click", { navigation_target: target });
        }
      }
    }, { capture: true });
  }

  function installVisibilityEvents() {
    if (!("IntersectionObserver" in window)) return;

    const targets = document.querySelectorAll(
      "[data-analytics-section], [data-analytics-service], [data-analytics-tool]"
    );
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || !canTrack()) return;
        const node = entry.target;

        if (node.dataset.analyticsService && serviceNames.has(node.dataset.analyticsService)) {
          event("service_impression", { service_name: node.dataset.analyticsService });
        } else if (Object.prototype.hasOwnProperty.call(toolNames, node.dataset.analyticsTool)) {
          event("tool_impression", { tool_name: toolNames[node.dataset.analyticsTool] });
        } else if (node.dataset.analyticsSection) {
          event("section_view", { section_name: node.dataset.analyticsSection });
        }
        observer.unobserve(node);
      });
    }, { threshold: 0.25 });

    targets.forEach(node => observer.observe(node));
  }

  function installScrollEvents() {
    const seen = new Set();
    const checkpoints = [25, 50, 75, 90];
    function measure() {
      const height = document.documentElement.scrollHeight;
      if (!height || height <= window.innerHeight) return;
      const progress = 100 * (window.scrollY + window.innerHeight) / height;
      checkpoints.forEach(threshold => {
        if (progress >= threshold && !seen.has(threshold) && canTrack()) {
          seen.add(threshold);
          event("scroll_depth", { scroll_milestone: String(threshold) + "%" });
        }
      });
    }
    window.addEventListener("scroll", measure, { passive: true });
  }

  function setup() {
    const accept = document.getElementById("aule-analytics-accept");
    const reject = document.getElementById("aule-analytics-reject");
    if (accept) accept.addEventListener("click", () => decide("yes"));
    if (reject) reject.addEventListener("click", () => decide("no"));
    updatePreferenceStatus();
    installClickEvents();
    installVisibilityEvents();
    installScrollEvents();
  }

  if (preference() === "no") window["ga-disable-" + ID] = true;
  // Default-on matches the site's current notice, subject to applicable regional consent laws.
  if (live && preference() !== "no") activate();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
})();
