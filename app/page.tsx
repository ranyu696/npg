import React from 'react';
import { Snippet } from '@nextui-org/snippet';
import { Code } from '@nextui-org/code';
import Link from 'next/link';
import Script from 'next/script';

import { title, subtitle } from '@/components/primitives';
import VideoCard from '@/components/VideoCard';
import { getWebsiteInfo, getHomeVideos } from '@/config/api';

export default async function Home() {
  const categoryIds = [24, 18, 17, 19];
  const categoryVideos = await getHomeVideos(categoryIds);
  const websiteData = await getWebsiteInfo();
  const websiteInfo = websiteData.data.attributes;
  const websiteImageURL = websiteInfo.imageURL;
  const PPURL = websiteInfo.PPURL;
  const websiteName = websiteInfo.name;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: websiteName,
    url: PPURL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${PPURL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id="jsonld-website"
        type="application/ld+json"
      />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-2xl text-center justify-center mb-8">
          <h1 className={title({ color: 'violet' })}>{websiteName}&nbsp;</h1>
          <h2 className={subtitle({ class: 'mt-4' })}>
            {websiteName}专注于提供高质量的视频内容，让您的生活更加丰富多彩。
          </h2>
        </div>

        {categoryVideos.map((category: Category) => (
          <div key={category.id} className="w-full max-w-7xl mt-8">
            <h2 className="text-2xl font-bold mb-4">{category.attributes.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2">
              {category.attributes.videos?.data
                ?.slice(0, 8)
                .map((video: Video) => (
                  <VideoCard
                    key={video.id}
                    category={category.attributes.name}
                    video={video}
                    websiteImageURL={websiteImageURL}
                  />
                )) || <p>暂无视频</p>}
            </div>
            <div className="text-right mt-2">
              <Link
                className="text-primary hover:underline"
                href={`/category/${category.attributes.name}`}
              >
                查看更多
              </Link>
            </div>
          </div>
        ))}

        <div className="mt-12">
          <Snippet hideCopyButton hideSymbol variant="flat">
            <span>
              收藏最新地址 <Code color="primary">{`${PPURL}`}</Code>
            </span>
          </Snippet>
        </div>
      </section>
    </>
  );
}
