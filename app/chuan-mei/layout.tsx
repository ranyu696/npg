

export const metadata = {
  title: '国产传媒视频库',
	description: '女仆阁提供各类国产传媒的网站,包括麻豆视频、皇家华人、糖心vlog、兔子先生等',
  openGraph: {
    type: 'website',
    title: '国产传媒视频库-女仆阁',
    description: '女仆阁提供各类国产传媒的网站,包括麻豆视频、皇家华人、糖心vlog、兔子先生等',
    siteName: '国产传媒视频库-女仆阁',
  },
  twitter: {
    card: 'summary_large_image',
    title: '国产传媒视频库-女仆阁',
    description: '女仆阁提供各类国产传媒的网站,包括麻豆视频、皇家华人、糖心vlog、兔子先生等',
  },
};




export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col w-full py-8 md:py-10">
				{children}
		</section>
	);
}
