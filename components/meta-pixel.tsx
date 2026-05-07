'use client'

import Script from 'next/script'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export function MetaPixel() {
  if (!PIXEL_ID) return null

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Track custom events
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

// Standard events
export const fbEvents = {
  viewContent: (params: { content_name: string; content_category: string; value: number; currency: string }) => {
    trackEvent('ViewContent', params)
  },
  addToCart: (params: { content_name: string; value: number; currency: string }) => {
    trackEvent('AddToCart', params)
  },
  initiateCheckout: (params: { value: number; currency: string }) => {
    trackEvent('InitiateCheckout', params)
  },
  purchase: (params: { value: number; currency: string; content_name: string }) => {
    trackEvent('Purchase', params)
  },
  completeRegistration: () => {
    trackEvent('CompleteRegistration')
  },
  lead: () => {
    trackEvent('Lead')
  },
}

// Extend Window interface
declare global {
  interface Window {
    fbq: (action: string, eventName: string, params?: Record<string, unknown>) => void
  }
}
