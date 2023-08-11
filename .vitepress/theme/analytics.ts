declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

function mountGoogleAnalytics(id: string) {
  // avoid duplicated import
  if (window.dataLayer && window.gtag) {
    return;
  }

  // insert gtag `<script>` tag
  const gtagScript = document.createElement('script');
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  gtagScript.async = true;
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer?.push(arguments);
  }

  window.gtag('js', new Date());
  window.gtag('config', id);
}

export function vitepressGoogleAnalytics(id: string) {
  if (id && typeof window !== 'undefined') {
    mountGoogleAnalytics(id);
  }
}