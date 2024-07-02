import React from 'react';
import Link from 'next/link';
import { Snippet } from '@nextui-org/snippet';
import { Code } from '@nextui-org/code';

import VideoCard from '@/components/VideoCard';

interface TabContentProps {
  params: {
    slug: string;
  };
}

async function getVideos(slug: string) {
  const resVideos = await fetch(
    `https://strapi.xiaoxinlook.cc/api/videos?filters[category][slug][$eq]=${slug}&pagination[pageSize]=20&fields[0]=originalname&fields[1]=duration&fields[2]=aka&fields[3]=count&populate[poster2][fields][0]=url&populate[poster2][fields][1]=width&populate[poster2][fields][2]=height&populate[category][fields][0]=name`,
    { next: { revalidate: 60 } }
  );

  if (!resVideos.ok) {
    throw new Error('Failed to fetch videos');
  }

  return resVideos.json();
}

async function getWebsite() {
  const resWebsite = await fetch(
    'https://strapi.xiaoxinlook.cc/api/websites/2?fields[0]=name&fields=imageURL',
    { next: { revalidate: 60 } }
  );

  if (!resWebsite.ok) {
    throw new Error('Failed to fetch website data');
  }

  return resWebsite.json();
}

export default async function TabContent({ params }: TabContentProps) {
  const [dataVideos, dataWebsite] = await Promise.all([
    getVideos(params.slug),
    getWebsite(),
  ]);

  const videos = dataVideos.data;
  const websiteImageURL = dataWebsite.data.attributes.imageURL;

  return (
    <>
      <div className="columns-2 sm:columns-2 md:columns-2 lg:columns-3 gap-1 s:gap-1.5 m:gap-2.5 sm:gap-3.5 md:gap-4">
        {videos.map((video: any) => (
          <VideoCard
            key={video.id}
            category={video.attributes.category.data.attributes.name}
            video={video}
            websiteImageURL={websiteImageURL}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Link href={`/category/${params.slug}`}>
          <Snippet hideCopyButton hideSymbol variant="flat">
            <span>
              查看更多 <Code color="primary">GO</Code>
            </span>
          </Snippet>
        </Link>
      </div>
    </>
  );
}
