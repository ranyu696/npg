// app/categories/onlyfans/[slug]/page.tsx
import { fetchContents, fetchContentCounts } from '@/app/lib/api';
import VideoCard from "@/app/ui/VideoCard";
import { Pagination } from "@/app/ui/Pagination";
import { Metadata } from 'next';


export async function generateStaticParams() {
  const medias = ["越南博主", "台湾博主", "内地博主", "香港博主", "欧美博主"];
	  const params = [];

  for (const media of medias) {
    params.push({ slug: [encodeURIComponent(media)] });
    params.push({ slug: [encodeURIComponent(media), '1'] });
  }

  return params;
}

async function MediaCategoryPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const slug = decodeURIComponent(params.slug[0]);
  const pageSize = 20;
  const currentPage = params.slug[1] ? parseInt(params.slug[1], 10) : 1;

  const [countsResult, posts] = await Promise.all([
    fetchContentCounts('category', slug),
    fetchContents('category', slug, 'movie,tv', currentPage, pageSize, 'createDesc'),
  ]);
  const counts = countsResult.counts;
  console.log('视频数量:', counts);
  const totalPages = Math.ceil(counts / pageSize);
  console.log('视频分页:', totalPages);
  
	return (
	  <>
		<h1 className="text-xl font-bold subpixel-antialiased pb-4">
		  类别: {slug}
		</h1>
		<div className="grid grid-cols-2 gap-1 m:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 s:gap-1.5 m:gap-2.5 sm:gap-3.5 md:gap-4">
		  {posts.map((video: any) => (
			<VideoCard key={video._id} video={video} />
		  ))}
		</div>
		{totalPages > 1 && (
		  <Pagination
			totalPages={totalPages}
			currentPage={currentPage}
			basePath={`/onlyfans/${params.slug[0]}`}
		  />
		)}
	  </>
	);
  }
  
  export default MediaCategoryPage;
  export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
    const slug = decodeURIComponent(params.slug[0]);
    return {
      title: `${slug} - OnlyFans 视频`,
      description: `观看最新的 ${slug} OnlyFans 视频`,
      openGraph: {
        title: `${slug} - OnlyFans 视频`,
        description: `观看最新的 ${slug} OnlyFans 视频`,
        type: 'website',
        url: `/onlyfans/${encodeURIComponent(slug)}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${slug} - OnlyFans 视频`,
        description: `观看最新的 ${slug} OnlyFans 视频`,
         images: ['/onlyfans-logo.png'],
      },
    };
  }