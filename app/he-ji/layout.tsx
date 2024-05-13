export const metadata = {
	title: '精品合集视频库',
	  description: '女仆阁提供各类精品合集视频的网站,包括寸止合集等',
	openGraph: {
	  type: 'website',
	  title: '精品合集视频库-女仆阁',
	  description: '女仆阁提供各类精品合集视频的网站,包括寸止合集等',
	  siteName: '女仆阁-精品合集视频库',
	},
	twitter: {
	  card: 'summary_large_image',
	  title: '精品合集视频库-女仆阁',
	  description: '女仆阁提供各类精品合集视频的网站,包括寸止合集等',
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
