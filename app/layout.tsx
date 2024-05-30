import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { GoogleAnalytics } from '@next/third-parties/google'
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import Script from 'next/script'
import clsx from "clsx";
import Metrika from 'next-metrika';

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: siteConfig.keywords,
	manifest: '/manifest.json',
	generator: 'Next.js',
	openGraph: {
		type: 'website',
		siteName: siteConfig.name,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		creator: "@myvideosite",
		images: '/twitter-image',
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
			>
				<Metrika id={95279192} />
				<GoogleAnalytics gaId="G-98GKDQVGE5" />
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-col h-screen">
						<Navbar />
						<main className="container mx-auto max-w-8xl pt-16 flex-grow">

							{children}
						</main>
						<footer className="w-full flex flex-col items-center justify-center py-3">
							<div className="flex flex-wrap justify-center gap-2 mb-4">
								{siteConfig.friendLinks.map((link, index) => (
									<Link
										key={index}
										isExternal
										className="flex items-center gap-1 text-current"
										href={link.href}
										title={link.label}
									>
										<Button
											color="primary"
											variant="shadow"
											className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3"
										>
											{link.label}
										</Button>
									</Link>
								))}
							</div>
							<div className="flex items-center gap-1 mt-6 mb-32 md:mb-8">
								<span className="text-default-600">Powered by</span>
								<p className="text-primary">女仆阁</p>
							</div>
							<Script src="/script.js" strategy="lazyOnload" />
						</footer>
					</div>
				</Providers>
				
		</body>
		</html >
	);
}
