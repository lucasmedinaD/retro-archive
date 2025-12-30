import Script from 'next/script';

/**
 * Analytics Scripts Component
 * Includes: Google Analytics, Meta Pixel, TikTok Pixel, Hotjar
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_GA_ID: Google Analytics 4 Measurement ID (e.g., G-XXXXXXXXXX)
 * - NEXT_PUBLIC_META_PIXEL_ID: Meta/Facebook Pixel ID
 * - NEXT_PUBLIC_TIKTOK_PIXEL_ID: TikTok Pixel ID
 * - NEXT_PUBLIC_HOTJAR_ID: Hotjar Site ID
 */

export default function AnalyticsScripts() {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
    const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
    const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;

    return (
        <>
            {/* Google Analytics 4 */}
            {GA_ID && (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GA_ID}', {
                                    page_path: window.location.pathname,
                                });
                            `,
                        }}
                    />
                </>
            )}

            {/* Meta/Facebook Pixel */}
            {META_PIXEL_ID && (
                <Script
                    id="meta-pixel"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '${META_PIXEL_ID}');
                            fbq('track', 'PageView');
                        `,
                    }}
                />
            )}

            {/* TikTok Pixel */}
            {TIKTOK_PIXEL_ID && (
                <Script
                    id="tiktok-pixel"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function (w, d, t) {
                                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
                                ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],
                                ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                                for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
                                ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
                                ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
                                ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,
                                ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");
                                o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
                                var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                                ttq.load('${TIKTOK_PIXEL_ID}');
                                ttq.page();
                            }(window, document, 'ttq');
                        `,
                    }}
                />
            )}

            {/* Hotjar */}
            {HOTJAR_ID && (
                <Script
                    id="hotjar"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(h,o,t,j,a,r){
                                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                                h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
                                a=o.getElementsByTagName('head')[0];
                                r=o.createElement('script');r.async=1;
                                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                                a.appendChild(r);
                            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                        `,
                    }}
                />
            )}
        </>
    );
}

/**
 * Helper functions to track events across all pixels
 */

// Track affiliate click (Redbubble)
export function trackAffiliateClickPixels(productId: string, productName: string) {
    // Meta Pixel - AddToCart is the closest event for affiliate click
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', {
            content_ids: [productId],
            content_name: productName,
            content_type: 'product',
        });
    }

    // TikTok Pixel
    if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('AddToCart', {
            content_id: productId,
            content_name: productName,
            content_type: 'product',
        });
    }
}

// Track view content (product/design page)
export function trackViewContentPixels(productId: string, productName: string, category: string) {
    // Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'ViewContent', {
            content_ids: [productId],
            content_name: productName,
            content_category: category,
            content_type: 'product',
        });
    }

    // TikTok Pixel
    if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('ViewContent', {
            content_id: productId,
            content_name: productName,
            content_category: category,
            content_type: 'product',
        });
    }
}

// Track lead (email capture, form submission)
export function trackLeadPixels(formType: string) {
    // Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
            content_name: formType,
        });
    }

    // TikTok Pixel
    if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('SubmitForm', {
            content_name: formType,
        });
    }
}

// Track custom form submission
export function trackCustomFormPixels(projectType: string, budgetRange: string) {
    // Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Contact', {
            content_name: 'custom_design_request',
            content_category: projectType,
            value: budgetRange,
        });
    }

    // TikTok Pixel
    if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('Contact', {
            content_name: 'custom_design_request',
            content_category: projectType,
        });
    }
}
