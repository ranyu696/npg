// app/categories/chuan-mei/[slug]/page.tsx
import { fetchContents, fetchContentCounts } from '@/config/api';
import VideoCard from "@/components/VideoCard";
import { Pagination } from "@/components/Pagination";
import { Metadata } from 'next';

async function MediaCategoryPage({ params }: { params: { slug: string[] } }) {
  const slug = decodeURIComponent(params.slug[0]);
  const pageSize = 20;
  const currentPage = params.slug[1] ? parseInt(params.slug[1], 10) : 1;

  const [countsResult, posts] = await Promise.all([
    fetchContentCounts('category', slug),
    fetchContents('category', slug, 'movie,tv', currentPage, pageSize, 'createDesc'),
  ]);

  const counts = countsResult.counts;
  const totalPages = Math.ceil(counts / pageSize);

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
          basePath={`/chuan-mei/${params.slug[0]}`}
        />
      )}
    </>
  );
}

export default MediaCategoryPage;

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug[0]);
  const currentPage = params.slug[1] ? parseInt(params.slug[1], 10) : 1;

  const title = currentPage > 1 ? `${slug} - 传媒视频 - 第${currentPage}页` : `${slug} - 传媒视频`;
  const description = currentPage > 1 ? `观看最新的 ${slug} 传媒视频 - 当前第${currentPage}页` : `观看最新的 ${slug} 传媒视频`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/chuan-mei/${encodeURIComponent(slug)}${currentPage > 1 ? `/${currentPage}` : ''}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}