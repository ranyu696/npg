import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';

import VideoCard from '@/components/VideoCard';
import Pagination from '@/components/Pagination';
import { Video, Category } from '@/types/index';

interface SearchPageProps {
  params: { slug: string[] };
}

interface WebsiteInfo {
  name: string;
  imageURL: string;
  canonicalURL: string;
}

async function getWebsiteInfo(): Promise<WebsiteInfo> {
  const response = await fetch(
    'https://strapi.xiaoxinlook.cc/api/websites/1?fields[0]=name&fields[1]=imageURL&populate[seo][fields][0]=canonicalURL'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch website info');
  }

  const data = await response.json();

  return {
    name: data.data.attributes.name,
    imageURL: data.data.attributes.imageURL,
    canonicalURL: data.data.attributes.seo.canonicalURL,
  };
}

async function getWebsiteCategories(websiteId: number = 2): Promise<number[]> {
  const response = await fetch(
    `https://strapi.xiaoxinlook.cc/api/categories?filters[website][id][$eq]=${websiteId}&fields[0]=id`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await response.json();

  return data.data.map((category: Category) => category.id);
}

async function getSearchResults(
  query: string,
  categoryIds: number[],
  page: number = 1
) {
  const categoryFilter = categoryIds
    .map((id) => `filters[category][id][$in]=${id}`)
    .join('&');
  const response = await fetch(
    `http://127.0.0.1:1337/api/videos?${categoryFilter}&filters[$or][0][originalname][$containsi]=${query}&filters[$or][1][aka][$containsi]=${query}&populate[poster2][fields][0]=url&populate[poster2][fields][1]=width&populate[poster2][fields][2]=height&populate[category][fields][0]=name&pagination[page]=${page}&pagination[pageSize]=12`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }

  return response.json();
}

export async function generateMetadata({
  params,
}: SearchPageProps): Promise<Metadata> {
  const { slug } = params;
  const encodedQuery = slug.slice(0, -1).join('/') || slug[0];
  const query = decodeURIComponent(encodedQuery);
  const websiteInfo = await getWebsiteInfo();

  return {
    title: `搜索结果: ${query} - ${websiteInfo.name}`,
    description: `查看 "${query}" 的相关视频搜索结果 - ${websiteInfo.name}`,
    openGraph: {
      title: `搜索结果: ${query} - ${websiteInfo.name}`,
      description: `查看 "${query}" 的相关视频搜索结果 - ${websiteInfo.name}`,
      url: `${websiteInfo.canonicalURL}/search/${encodedQuery}`,
      siteName: websiteInfo.name,
      images: [
        {
          url: websiteInfo.imageURL,
          width: 1200,
          height: 630,
          alt: `${websiteInfo.name} 搜索结果`,
        },
      ],
      locale: 'zh_CN',
      type: 'website',
    },
    alternates: {
      canonical: `${websiteInfo.canonicalURL}/search/${encodedQuery}`,
    },
  };
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { slug } = params;
  const page = parseInt(slug[slug.length - 1], 10) || 1;
  const encodedQuery = slug.slice(0, -1).join('/') || slug[0];
  const query = decodeURIComponent(encodedQuery);

  try {
    const [websiteInfo, categoryIds] = await Promise.all([
      getWebsiteInfo(),
      getWebsiteCategories(),
    ]);

    const { data, meta } = await getSearchResults(query, categoryIds, page);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      name: `搜索结果: ${query}`,
      description: `查看 "${query}" 的相关视频搜索结果 - ${websiteInfo.name}`,
      url: `${websiteInfo.canonicalURL}/search/${encodedQuery}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: data.map((video: Video, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'VideoObject',
            name: video.attributes.originalname,
            description:
              video.attributes.aka ||
              `观看 ${video.attributes.originalname} 视频`,
            thumbnailUrl: `${websiteInfo.imageURL}${video.attributes.poster2.url}`,
            uploadDate: video.attributes.createdAt,
            contentUrl: `${websiteInfo.canonicalURL}/video/${video.attributes.aka || video.id}`,
          },
        })),
      },
    };

    if (data.length === 0 && page === 1) {
      return (
        <>
          <Script
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            id="jsonld-search-results"
            type="application/ld+json"
          />
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">搜索结果: {query}</h1>
            <p>没有找到相关视频。</p>
          </div>
        </>
      );
    }

    return (
      <>
        <Script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          id="jsonld-search-results"
          type="application/ld+json"
        />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">搜索结果: {query}</h1>
          <div className="columns-2 sm:columns-3 md:columns-3 lg:columns-4 gap-1 s:gap-1.5 m:gap-2.5 sm:gap-3 md:gap-3">
            {data.map((video: Video) => (
              <VideoCard
                key={video.id}
                category={
                  video.attributes.category?.data?.attributes?.name || ''
                }
                video={video}
                websiteImageURL={websiteInfo.imageURL}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Pagination
              basePath="/search"
              pageNumber={page}
              slug={query}
              totalPages={meta.pagination.pageCount}
            />
          </div>
        </div>
      </>
    );
  } catch (error) {
    // console.error('Error fetching search results:', error);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">搜索结果: {query}</h1>
        <p>获取搜索结果时出错。请稍后再试。</p>
      </div>
    );
  }
}
