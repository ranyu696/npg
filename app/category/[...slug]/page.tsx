import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Metadata } from 'next';

import { title, subtitle } from '@/components/primitives';
import VideoCard from '@/components/VideoCard';
import Pagination from '@/components/Pagination';
import { getCategories, getCategoryVideos, getWebsiteInfo } from '@/config/api';

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const [encodedSlug, page] = params.slug;
  const slug = decodeURIComponent(encodedSlug);
  const pageNumber = parseInt(page) || 1;

  try {
    const [categoriesData, websiteData] = await Promise.all([
      getCategories({ filters: { name: { $eq: slug } } }),
      getWebsiteInfo(),
    ]);

    const category = categoriesData.data[0];
    const CategoryName = category?.attributes.name || '未知分类';
    const websiteInfo = websiteData.data.attributes;
    const seo = websiteInfo.seo;
    const websiteName = websiteInfo.name;
    const baseUrl = seo.canonicalURL || 'https://nvpuge0.cc';

    const pageUrl = `${baseUrl}/category/${slug}${pageNumber > 1 ? `/${pageNumber}` : ''}`;

    return {
      title: `${CategoryName} 在线观看${pageNumber > 1 ? ` - 第${pageNumber}页` : ''}`,
      description: `探索 ${CategoryName} 类别中的精彩视频${pageNumber > 1 ? `，第${pageNumber}页` : ''}。${websiteName}为您带来最优质的${CategoryName}内容。`,
      openGraph: {
        title: `${CategoryName} 视频${pageNumber > 1 ? ` - 第${pageNumber}页` : ''} | ${websiteName}`,
        description: `在${websiteName}上浏览${CategoryName}分类的精彩视频。${pageNumber > 1 ? `第${pageNumber}页展示了` : ''}最新、最热门的${CategoryName}内容。`,
        url: pageUrl,
        siteName: websiteName,
        locale: 'zh_CN',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${CategoryName} 视频精选 - ${websiteName}`,
        description: `${websiteName}为您精选${CategoryName}类别的视频。${pageNumber > 1 ? `浏览第${pageNumber}页，` : ''}发现更多精彩内容。`,
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch (error) {
    return {
      title: '分类页面',
      description: '查看我们的视频分类',
      alternates: {
        canonical: 'https://nvpuge0.cc/category',
      },
    };
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const [encodedSlug, page] = params.slug;
  const slug = decodeURIComponent(encodedSlug);
  const pageNumber = parseInt(page) || 1;
  const pageSize = 20;


    const [categoriesData, websiteData, videosData] = await Promise.all([
      getCategories({ filters: { name: { $eq: slug } } }),
      getWebsiteInfo(),
      getCategoryVideos(slug, { 
        pagination: { page: pageNumber, pageSize: pageSize },
        sort: ['createdAt:desc']
      }),
    ]);

    if (!categoriesData.data || categoriesData.data.length === 0) {
      notFound();
    }

    const category = categoriesData.data[0];
    const CategoryName = category.attributes.name;
    const websiteInfo = websiteData.data.attributes;
    const websiteImageURL = websiteInfo.imageURL;
    const seo = websiteInfo.seo;
    const websiteName = websiteInfo.name;
    const Videos = videosData.data;
    const { total } = videosData.meta.pagination;
    const totalPages = Math.ceil(total / pageSize);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${CategoryName} 在线观看 - 第${pageNumber}页`,
      description: `探索 ${CategoryName} 类别中的精彩视频，第${pageNumber}页`,
      url: `${seo.canonicalURL}/category/${slug}/${pageNumber}`,
      isPartOf: {
        '@type': 'WebSite',
        name: websiteName,
        url: seo.canonicalURL,
      },
      about: {
        '@type': 'Thing',
        name: CategoryName,
      },
      numberOfItems: Videos.length,
      itemListElement: Videos.map((video: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'VideoObject',
          name: video.attributes.originalname,
          duration: video.attributes.duration,
          thumbnailUrl: `${websiteImageURL}${video.attributes.poster2.url}`,
          
        },
      })),
    };

    return (
      <>
        <Script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          id="ld+json"
          type="application/ld+json"
        />
        <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className={title()}>{CategoryName} 在线观看</h1>
            <h2 className={subtitle({ class: 'mt-4' })}>
              探索 {CategoryName} 类别中的精彩视频
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
            {Videos.map((video: any) => (
              <VideoCard
                key={video.id}
                category={CategoryName}
                video={video}
                websiteImageURL={websiteImageURL}
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              basePath="/category"
              pageNumber={pageNumber}
              slug={slug}
              totalPages={totalPages}
            />
          </div>
        </section>
      </>
    );
}