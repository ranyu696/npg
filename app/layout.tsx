import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import clsx from 'clsx';

import { Navbar } from '@/components/navbar';
import { fontSans } from '@/config/fonts';
import Footer from '@/components/Footer';
import YandexMetrica from '@/components/YandexMetrica';
import AdBanner from '@/components/AdBanner';

import { Providers } from './providers';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const response = await fetch(
    'http://127.0.0.1:1337/api/websites/2?fields[0]=name&populate[seo][populate][0]=metaSocial&populate[seo][populate][1]=BasicFields&populate[seo][populate][2]=formatDetection&populate[seo][populate][3]=metaRobots'
  );
  const data = await response.json();
  const seo = data?.data?.attributes?.seo || {};

  const metaSocial =
    seo.metaSocial?.map((social: any) => ({
      socialNetwork: social.socialNetwork,
      title: social.title,
      description: social.description,
    })) || [];

  const metaRobots = seo.metaRobots
    ? [
        seo.metaRobots.index ? 'index' : 'noindex',
        seo.metaRobots.follow ? 'follow' : 'nofollow',
        seo.metaRobots.nocache ? 'noarchive' : '',
      ]
        .filter(Boolean)
        .join(', ')
    : 'index, follow';

  return {
    title: {
      template: seo.templateTitle,
      default: seo.metaTitle || '女仆阁 - 您的优质女仆服务平台',
    },
    description: seo.metaDescription,
    metadataBase: new URL(seo.canonicalURL),
    robots: metaRobots,
    keywords: seo.keywords,
    openGraph: {
      type: 'website',
      url: seo.canonicalURL,
      title: seo.metaTitle || '女仆阁 - 专业女仆服务',
      description:
        seo.metaDescription || '探索女仆阁的优质服务,体验专业细致的生活照料。',
      siteName: '女仆阁',
    },
    twitter: metaSocial.map((social: any) => ({
      handle: '@nupugarden',
      site: '@nupugarden',
      cardType: 'summary_large_image',
      title: social.title,
      description: social.description,
    })),
    alternates: {
      canonical: seo.canonicalURL,
    },
    generator: seo.BasicFields?.generator || '',
    applicationName: seo.BasicFields?.applicationName || '女仆阁',
    referrer: seo.BasicFields?.referrer || 'origin-when-cross-origin',
    authors: seo.BasicFields?.authors
      ?.split(',')
      .map((author: string) => ({ name: author.trim() })) || [
      { name: '女仆阁团队', url: 'https://acme.com/team' },
    ],
    creator: seo.BasicFields?.creator,
    publisher: seo.BasicFields?.publisher,
    formatDetection: {
      email: seo.formatDetection?.email || false,
      address: seo.formatDetection?.address || false,
      telephone: seo.formatDetection?.telephone || false,
    },
    icons: {
      icon: [
        { url: '/icon.png' },
        { url: '/icon-dark.png', media: '(prefers-color-scheme: dark)' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-icon.png' },
        { url: '/apple-icon-x3.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [resCategory, resWebsite] = await Promise.all([
    fetch(
      'http://127.0.0.1:1337/api/categories?populate=subcategories.*&filters[isCategory][$eq]=true&filters[website][$in][0]=2'
    ),
    fetch(
      'http://127.0.0.1:1337/api/websites/2?fields[0]=googleAnalyticsId&fields[1]=email&fields[2]=PPURL&fields[3]=MetrikaID&fields[4]=advertisementCode&fields[5]=announcement&populate[links][fields]=*&populate[advertisement_banners][fields][1]=name&populate[advertisement_banners][fields][2]=url&populate[advertisement_banners][fields][3]=order&populate[advertisement_banners][populate][image][fields][0]=url&populate[advertisement_banners][populate][image][fields][1]=width&populate[advertisement_banners][populate][image][fields][2]=height'
    ),
  ]);

  const [dataCategory, dataWebsite] = await Promise.all([
    resCategory.json(),
    resWebsite.json(),
  ]);

  const categories = dataCategory.data;
  const { googleAnalyticsId, email, PPURL, MetrikaID, links } =
    dataWebsite.data.attributes;
  const advertisementCode =
    dataWebsite.data.attributes.advertisementCode[0].children[0].text;
  const adBanners = dataWebsite.data.attributes.advertisement_banners;
  const baseUrl = 'https://strapi.xiaoxinlook.cc';

  return (
    <html suppressHydrationWarning lang="zh-hk">
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <YandexMetrica tagID={MetrikaID}>
          <GoogleAnalytics gaId={googleAnalyticsId} />
          <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
            <div className="relative flex flex-col h-screen">
              <Navbar categories={categories} />
              <div className="bg-indigo-600 px-4 py-3 text-white">
                <p className="text-center text-sm font-medium">
                  永久域名：{PPURL}
                </p>
              </div>
              <main className="container mx-auto max-w-7xl pt-8 px-2 flex-grow">
                {adBanners && adBanners.data && adBanners.data.length > 0 && (
                  <AdBanner banners={adBanners} baseUrl={baseUrl} />
                )}
                {children}
              </main>
              <Footer email={email} links={links} />
            </div>
          </Providers>

          {advertisementCode && (
            <Script id="advertisementCode" strategy="lazyOnload">
              {`${advertisementCode}`}
            </Script>
          )}
        </YandexMetrica>
      </body>
    </html>
  );
}
