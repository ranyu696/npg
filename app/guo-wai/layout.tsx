
export const metadata = {
	title: '国外传媒视频库',
	  description: '女仆阁提供各类国外传媒视频的网站,包括MarcDorcelLuxure等',
	openGraph: {
	  type: 'website',
	  title: '-国外传媒视频库-女仆阁',
	  description: '女仆阁提供各类国外传媒视频的网站,包括MarcDorcelLuxure等',
	  siteName: '国外传媒视频库-女仆阁',
	},
	twitter: {
	  card: 'summary_large_image',
	  title: '国外传媒视频库-女仆阁',
	  description: '女仆阁提供各类国外传媒视频的网站,包括MarcDorcelLuxure等',
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
