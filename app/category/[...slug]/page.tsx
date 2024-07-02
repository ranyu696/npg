import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Metadata } from 'next';

import { title, subtitle } from '@/components/primitives';
import VideoCard from '@/components/VideoCard';
import Pagination from '@/components/Pagination';

// 数据获取函数
async function fetchCategoryData(slug: string) {
  const res = await fetch(
    `https://strapi.xiaoxinlook.cc/api/categories?filters[slug][$eq]=${slug}`
  );

  if (!res.ok) throw new Error('Failed to fetch category data');

  return res.json();
}

async function fetchWebsiteData() {
  const res = await fetch(
    'https://strapi.xiaoxinlook.cc/api/websites/2?fields[0]=name&fields=imageURL&populate[seo][populate][0]=metaSocial'
  );

  if (!res.ok) throw new Error('Failed to fetch website data');

  return res.json();
}

async function fetchVideos(
  categoryId: number,
  pageNumber: number,
  pageSize: number
) {
  const res = await fetch(
    `https://strapi.xiaoxinlook.cc/api/videos?filters[category][id][$eq]=${categoryId}&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}&fields[0]=originalname&fields[1]=duration&fields[2]=aka&fields[3]=count&fields[4]=video_id&populate[poster2][fields][0]=url&populate[poster2][fields][1]=width&populate[poster2][fields][2]=height&populate[category][fields][0]=name`
  );

  if (!res.ok) throw new Error('Failed to fetch videos');

  return res.json();
}

// 动态生成元数据
export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const [slug, page] = params.slug;
  const pageNumber = parseInt(page) || 1;

  try {
    const [categoryData, websiteData] = await Promise.all([
      fetchCategoryData(slug),
      fetchWebsiteData(),
    ]);

    const CategoryName = categoryData.data[0]?.attributes.name || '未知分类';
    const seo = websiteData.data.attributes.seo;
    const websiteName = websiteData.data.attributes.name;
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
  const [slug, page] = params.slug;
  const pageNumber = parseInt(page) || 1;
  const pageSize = 20;

  try {
    const categoryData = await fetchCategoryData(slug);

    if (!categoryData.data || categoryData.data.length === 0) {
      notFound();
    }

    const categoryId = categoryData.data[0].id;
    const [websiteData, videosData] = await Promise.all([
      fetchWebsiteData(),
      fetchVideos(categoryId, pageNumber, pageSize),
    ]);

    const CategoryName = categoryData.data[0].attributes.name;
    const websiteImageURL = websiteData.data.attributes.imageURL;
    const seo = websiteData.data.attributes.seo;
    const websiteName = websiteData.data.attributes.name;
    const Videos = videosData.data;
    const totalCount = videosData.meta.pagination.total;
    const totalPages = Math.ceil(totalCount / pageSize);

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
          thumbnailUrl: video.attributes.poster2.url,
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

          <div className="columns-2 sm:columns-3 md:columns-3 lg:columns-4 gap-1 s:gap-1.5 m:gap-2.5 sm:gap-3 md:gap-3">
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
  } catch (error) {
    //console.error('Error in CategoryPage:', error);
    notFound();
  }
}
