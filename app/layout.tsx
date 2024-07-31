import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import clsx from 'clsx';

import { fontSans } from '@/config/fonts';
import Footer from '@/components/Footer';
import YandexMetrica from '@/components/YandexMetrica';
import AdBanner from '@/components/AdBanner';

import { Providers } from './providers';
import { getCategories, getWebsiteInfo } from '@/config/api';
import { Navbar } from '@/components/Nav/Navbar';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const websiteData = await getWebsiteInfo();
  const seo = websiteData.data.attributes.seo || {};

  const metaSocial =
    seo.metaSocial?.map((social: any) => ({
      socialNetwork: social.socialNetwork,
      title: social.title,
      description: social.description,
    })) || [];


  return {
    title: {
      template: seo.templateTitle,
      default: seo.metaTitle || '女仆阁 - 您的优质女仆服务平台',
    },
    description: seo.metaDescription,
    metadataBase: new URL(seo.canonicalURL),
    keywords: seo.keywords,
    openGraph: {
      type: 'website',
      url: seo.canonicalURL,
      title: seo.metaTitle || '女仆阁 - 专业女仆服务',
      description:
        seo.metaDescription || '探索女仆阁的优质服务,体验专业细致的生活照料。',
      siteName: '女仆阁',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.metaSocial[0].title,
      description: seo.metaSocial[0].description,
    },
    alternates: {
      canonical: seo.canonicalURL,
    },
    generator: seo.BasicFields?.generator || '',
    applicationName: seo.BasicFields?.applicationName || '女仆阁',
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
  const [categoryData, websiteData] = await Promise.all([
    getCategories(),
    getWebsiteInfo(),
  ]);

  const categories = categoryData.data;
  const websiteAttributes = websiteData.data.attributes;
  const { 
    googleAnalyticsId, 
    email, 
    PPURL, 
    MetrikaID, 
    Links,
    advertisement_banners: adBanners 
  } = websiteAttributes;

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
              <Footer email={email} links={Links} />
            </div>
          </Providers>
        </YandexMetrica>
        <Script
          src="/script.js"
          strategy="lazyOnload"
        />
        <Script
          data-website-id="5ece0d0c-d2f2-4b9a-afda-466a00363459"
          src="https://tj.matomo.vip/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}