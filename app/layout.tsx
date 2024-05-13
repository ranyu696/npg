import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import {Button, ButtonGroup} from "@nextui-org/button";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import Script from 'next/script'
import { YandexMetrica } from '@/components/YandexMetrica'
import clsx from "clsx";
import { WebVitals } from '@/components/web-vitals'

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: siteConfig.keywords,
	manifest: '/manifest.json',
	generator: 'Next.js',
	referrer: 'origin-when-cross-origin',
	icons: {
		icon: '/favicon.ico',
		apple: '/apple-icon.jpg',
	  },
	  openGraph: {
		type: 'website',
		siteName: siteConfig.name,
		images: [
		  {
			url: '/twitter-image',
			width: 800,
			height: 600,
		  },
		],
	  },
	  twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		creator: "@myvideosite",
		images: '/twitter-image',
	  },
	  robots: {
		index: true,
		follow: true,
		nocache: true,
		googleBot: {
		  index: true,
		  follow: true,
		  noimageindex: true,
		  'max-video-preview': 60,
		  'max-image-preview': 'large',
		  'max-snippet': 320,
		},
	  },
}

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="zh-hk" suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			> <YandexMetrica>
				<WebVitals />
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-col h-screen">
						<Navbar />
						<main className="container mx-auto max-w-8xl pt-16 flex-grow">
						
							{children}
						</main>
						<footer className="w-full flex flex-col items-center justify-center py-3">
  <div className="flex items-center justify-center gap-4 mb-4">
  {siteConfig.friendLinks.map((link, index) => (
    <Link
      key={index}
      isExternal
      className="flex items-center gap-1 text-current"
      href={link.href}
      title={link.label}
    >
      <Button color="primary" variant="shadow">{link.label}</Button>  
    </Link>
  ))}
  </div>
  <div className="flex items-center gap-1">
    <span className="text-default-600">Powered by</span>
    <p className="text-primary">女仆阁</p>
  </div>
  <Script src="https://example.com/script.js" strategy="lazyOnload" />
</footer>
					</div>
				</Providers>
				</YandexMetrica>
			</body>
		</html>
	);
}
