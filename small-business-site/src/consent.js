// Cookie consent and tracking tags. The build adds this file only when you set a
// GA4, Google Ads or Meta Pixel ID in src/site.mjs.
// Uses vanilla-cookieconsent 3.1.0 (MIT, src/vendor). Nothing that sets a cookie
// loads until the visitor opts in (UK GDPR and PECR). Google tags use Consent Mode v2
// in "basic" mode: gtag.js loads only after consent.
(() => {
  const IDS = __TRACKING_IDS__;
  const hasAnalytics = Boolean(IDS.ga4);
  const hasMarketing = Boolean(IDS.googleAds || IDS.metaPixel);

  // ---- Google tag (gtag.js) ----
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: 500,
  });
  gtag('set', 'ads_data_redaction', true);

  let googleLoaded = false;
  function loadGoogle() {
    const first = IDS.ga4 || IDS.googleAds;
    if (googleLoaded || !first) return;
    googleLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(first)}`;
    document.head.appendChild(s);
    gtag('js', new Date());
    if (IDS.ga4) gtag('config', IDS.ga4);
    if (IDS.googleAds) gtag('config', IDS.googleAds);
  }

  // ---- Meta Pixel ----
  let metaLoaded = false;
  function loadMeta() {
    if (metaLoaded || !IDS.metaPixel) return;
    metaLoaded = true;
    const fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
    fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
    window.fbq = window._fbq = fbq;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
    fbq('init', IDS.metaPixel);
    fbq('track', 'PageView');
  }

  function apply() {
    const cc = window.CookieConsent;
    const analytics = hasAnalytics && cc.acceptedCategory('analytics');
    const marketing = hasMarketing && cc.acceptedCategory('marketing');
    gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
    });
    if (analytics || (marketing && IDS.googleAds)) loadGoogle();
    if (marketing) loadMeta();
    if (window.fbq && !marketing) window.fbq('consent', 'revoke');
  }

  // Count a sent enquiry as a conversion, only where consent allows.
  document.addEventListener('site:enquiry-sent', (e) => {
    if (googleLoaded) gtag('event', 'generate_lead', { enquiry_type: (e.detail && e.detail.type) || '' });
    if (metaLoaded) window.fbq('track', 'Lead');
  });

  const table = (body) => ({ headers: { name: 'Cookie', domain: 'Set by', desc: 'Purpose', exp: 'Expires' }, body });
  const categories = { necessary: { enabled: true, readOnly: true } };
  const sections = [
    {
      title: 'How we use cookies',
      description: 'Some cookies are needed for the site to work. Others only run if you allow them. You can change your choice at any time with the "Cookie settings" link at the bottom of every page.',
    },
    {
      title: 'Strictly necessary <span class="pm__badge">Always on</span>',
      description: 'These remember your cookie choice.',
      linkedCategory: 'necessary',
      cookieTable: table([{ name: 'cc_cookie', domain: 'This website', desc: 'Stores your cookie choices', exp: '6 months' }]),
    },
  ];
  if (hasAnalytics) {
    categories.analytics = { autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }] } };
    sections.push({
      title: 'Analytics',
      description: 'Google Analytics 4 helps us see which pages people use, so we can improve the site.',
      linkedCategory: 'analytics',
      cookieTable: table([
        { name: '_ga', domain: 'Google Analytics', desc: 'Tells visitors apart', exp: '2 years' },
        { name: '_ga_<ID>', domain: 'Google Analytics', desc: 'Keeps the state of a visit', exp: '2 years' },
      ]),
    });
  }
  if (hasMarketing) {
    categories.marketing = { autoClear: { cookies: [{ name: /^_gcl/ }, { name: '_fbp' }] } };
    sections.push({
      title: 'Marketing',
      description: 'These measure whether our adverts lead to enquiries.',
      linkedCategory: 'marketing',
      cookieTable: table([
        ...(IDS.googleAds ? [{ name: '_gcl_au', domain: 'Google Ads', desc: 'Measures advert conversions', exp: '90 days' }] : []),
        ...(IDS.metaPixel ? [{ name: '_fbp', domain: 'Meta', desc: 'Measures advert conversions', exp: '90 days' }] : []),
      ]),
    });
  }
  sections.push({ title: 'More information', description: 'Read our <a href="/cookies/">cookie notice</a> and <a href="/privacy/">privacy notice</a>.' });

  window.CookieConsent.run({
    revision: 1,
    cookie: { name: 'cc_cookie', expiresAfterDays: 182, sameSite: 'Lax' },
    guiOptions: {
      consentModal: { layout: 'box inline', position: 'bottom left', equalWeightButtons: true, flipButtons: false },
      preferencesModal: { layout: 'box', equalWeightButtons: true, flipButtons: false },
    },
    categories,
    onFirstConsent: apply,
    onConsent: apply,
    onChange: apply,
    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'Cookies on this site',
            description: 'We use necessary cookies to make the site work. With your permission, we would also like to use others. <a href="/cookies/">Cookie notice</a>',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            showPreferencesBtn: 'Choose cookies',
          },
          preferencesModal: {
            title: 'Cookie settings',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Save my choices',
            closeIconLabel: 'Close',
            sections,
          },
        },
      },
    },
  });
})();
