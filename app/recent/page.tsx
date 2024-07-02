import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';

import VideoCard from '@/components/VideoCard';
import Pagination from '@/components/Pagination';
import { getRecentVideos } from '@/config/HomeVideos';
import { Video } from '@/types/index';

interface PageProps {
  params: { page: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = parseInt(params.page) || 1;
  const websiteRes = await fetch(
    'https://strapi.xiaoxinlook.cc/api/websites/2?fields[0]=name&populate[seo][fields][0]=canonicalURL'
  );
  const websiteData = await websiteRes.json();
  const websiteName = websiteData.data.attributes.name;
  const canonicalURL = websiteData.data.attributes.seo.canonicalURL;

  return {
    title: `最新视频 ${page > 1 ? `- 第${page}页 ` : ''}- ${websiteName}`,
    description: `浏览${websiteName}上最新上传的视频内容。每天更新，为您带来最新最热的视频。`,
    openGraph: {
      title: `最新视频 ${page > 1 ? `- 第${page}页 ` : ''}- ${websiteName}`,
      description: `浏览${websiteName}上最新上传的视频内容。每天更新，为您带来最新最热的视频。`,
      url: `${canonicalURL}/recent${page > 1 ? `/page/${page}` : ''}`,
      siteName: websiteName,
      type: 'website',
    },
    alternates: {
      canonical: `${canonicalURL}/recent`,
    },
  };
}

export default async function RecentVideosPage({ params }: PageProps) {
  const page = parseInt(params.page) || 1;
  const pageSize = 20;
  const websiteId = 2;

  const [videosData, websiteData] = await Promise.all([
    getRecentVideos(websiteId, pageSize, page),
    fetch(
      'https://strapi.xiaoxinlook.cc/api/websites/2?fields[0]=imageURL&fields[1]=name&populate[seo][fields][0]=canonicalURL'
    ).then((res) => res.json()),
  ]);

  const videos = videosData.data;
  const { meta } = videosData;
  const websiteImageURL = websiteData.data.attributes.imageURL;
  const canonicalURL = websiteData.data.attributes.seo.canonicalURL;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: videos.map((video: Video, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'VideoObject',
        name: video.attributes.originalname,
        description: video.attributes.aka,
        thumbnailUrl: `${websiteImageURL}${video.attributes.poster2.url}`,
        uploadDate: video.attributes.createdAt,
        contentUrl: `${canonicalURL}/video/${video.attributes.aka || video.id}`,
      },
    })),
  };

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id="jsonld-recent-videos"
        type="application/ld+json"
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">
          最新视频 {page > 1 ? `- 第${page}页` : ''}
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {videos.map((video: Video) => (
            <VideoCard
              key={video.id}
              category={''}
              video={video}
              websiteImageURL={websiteImageURL}
            />
          ))}
        </div>
        <div className="mt-8">
          <Pagination
            basePath="/recent"
            pageNumber={page}
            slug={''}
            totalPages={meta.pagination.pageCount}
          />
        </div>
      </div>
    </>
  );
}
