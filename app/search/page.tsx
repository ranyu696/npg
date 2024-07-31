import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';

import VideoCard from '@/components/VideoCard';
import Pagination from './Pagination';
import { getWebsiteInfo, getWebsiteCategories, getSearchResults } from '@/config/api';

interface SearchPageProps {
  searchParams: { q?: string; page?: string };
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';
  const websiteInfo = await getWebsiteInfo();

  return {
    title: `搜索结果: ${query} - ${websiteInfo.data.attributes.name}`,
    description: `查看 "${query}" 的相关视频搜索结果 - ${websiteInfo.data.attributes.name}`,
    openGraph: {
      title: `搜索结果: ${query} - ${websiteInfo.data.attributes.name}`,
      description: `查看 "${query}" 的相关视频搜索结果 - ${websiteInfo.data.attributes.name}`,
      url: `${websiteInfo.data.attributes.seo.canonicalURL}/search?q=${encodeURIComponent(query)}`,
      siteName: websiteInfo.data.attributes.name,
      images: [
        {
          url: websiteInfo.data.attributes.imageURL,
          width: 1200,
          height: 630,
          alt: `${websiteInfo.data.attributes.name} 搜索结果`,
        },
      ],
      locale: 'zh_CN',
      type: 'website',
    },
    alternates: {
      canonical: `${websiteInfo.data.attributes.seo.canonicalURL}/search?q=${encodeURIComponent(query)}`,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);

  if (!query) {
    notFound();
  }

  const [websiteInfo, categoryIds] = await Promise.all([
    getWebsiteInfo(),
    getWebsiteCategories(),
  ]);

  const searchResults = await getSearchResults(query, categoryIds, page);
  const { data, meta } = searchResults;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `搜索结果: ${query}`,
    description: `查看 "${query}" 的相关视频搜索结果 - ${websiteInfo.data.attributes.name}`,
    url: `${websiteInfo.data.attributes.seo.canonicalURL}/search?q=${encodeURIComponent(query)}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: data.map((video: Video, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'VideoObject',
          name: video.attributes.originalname,
          description: video.attributes.aka || `观看 ${video.attributes.originalname} 视频`,
          thumbnailUrl: `${websiteInfo.data.attributes.imageURL}${video.attributes.poster2.url}`,
          uploadDate: video.attributes.createdAt,
          contentUrl: `${websiteInfo.data.attributes.seo.canonicalURL}/video/${video.attributes.aka || video.id}`,
        },
      })),
    },
  };

  if (data.length === 0) {
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
          {data.map((video: Video) => (
            <VideoCard
              key={video.id}
              category={video.attributes.category?.data?.attributes?.name || ''}
              video={video}
              websiteImageURL={websiteInfo.data.attributes.imageURL}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Pagination
            basePath="/search"
            pageNumber={page}
            query={query}
            totalPages={meta.pagination.pageCount}
          />
        </div>
      </div>
    </>
  );
}