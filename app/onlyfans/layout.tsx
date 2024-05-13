export const metadata = {
	title: 'onlyfans视频库',
	  description: '女仆阁提供各类onlyfans视频的网站,包括越南博主", "台湾博主", "内地博主", "香港博主", "欧美博主"等',
	openGraph: {
	  type: 'website',
	  title: 'onlyfans视频库-女仆阁',
	  description: '女仆阁提供各类onlyfans视频的网站,包括越南博主", "台湾博主", "内地博主", "香港博主", "欧美博主"等',
	  siteName: '女仆阁-onlyfans视频库',
	},
	twitter: {
	  card: 'summary_large_image',
	  title: 'onlyfans视频库-女仆阁',
	  description: '女仆阁提供各类onlyfans视频的网站,包括越南博主", "台湾博主", "内地博主", "香港博主", "欧美博主"等',
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
