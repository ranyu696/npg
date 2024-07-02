import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';

import VideoCard from '@/components/VideoCard';
import Pagination from '@/components/Pagination';
import { getPopularVideos } from '@/config/HomeVideos';
import { Video } from '@/types/index';

interface PopularVideosPageProps {
  params: { page: string };
}

export async function generateMetadata(): Promise<Metadata> {
  const websiteRes = await fetch(
    'http://127.0.0.1:1337/api/websites/2?fields[0]=name&populate[seo][fields][0]=canonicalURL'
  );
  const websiteData = await websiteRes.json();
  const websiteName = websiteData.data.attributes.name;
  const canonicalURL = websiteData.data.attributes.seo.canonicalURL;

  return {
    title: `热门视频 - ${websiteName}`,
    description: `探索${websiteName}上最受欢迎的视频内容。这里汇集了用户最喜爱的精彩视频。`,
    openGraph: {
      title: `热门视频 - ${websiteName}`,
      description: `探索${websiteName}上最受欢迎的视频内容。这里汇集了用户最喜爱的精彩视频。`,
      url: `${canonicalURL}/popular`,
      siteName: websiteName,
      type: 'website',
    },
    alternates: {
      canonical: `${canonicalURL}/popular`,
    },
  };
}

export default async function PopularVideosPage({
  params,
}: PopularVideosPageProps) {
  const page = parseInt(params.page) || 1;
  const pageSize = 20;
  const websiteId = 2;

  try {
    const [videosData, websiteData] = await Promise.all([
      getPopularVideos(websiteId, pageSize, page),
      fetch(
        'http://127.0.0.1:1337/api/websites/2?fields[0]=imageURL&fields[1]=name&populate[seo][fields][0]=canonicalURL'
      ).then((res) => res.json()),
    ]);

    const videos = videosData.data;
    const { meta } = videosData;
    const websiteImageURL = websiteData.data.attributes.imageURL;
    // const websiteName = websiteData.data.attributes.name;
    const canonicalURL = websiteData.data.attributes.seo.canonicalURL;

    if (!videos || videos.length === 0) {
      notFound();
    }

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
          interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: { '@type': 'WatchAction' },
            userInteractionCount: video.attributes.count,
          },
        },
      })),
    };

    return (
      <>
        <Script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          id="jsonld-popular-videos"
          type="application/ld+json"
        />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">热门视频</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {videos.map((video: Video) => (
              <VideoCard
                key={video.id}
                category={
                  video.attributes.category?.data?.attributes?.name || ''
                }
                video={video}
                websiteImageURL={websiteImageURL}
              />
            ))}
          </div>
          <div className="mt-8">
            <Pagination
              basePath="/popular"
              pageNumber={page}
              slug={''}
              totalPages={meta.pagination.pageCount}
            />
          </div>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}
