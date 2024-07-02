import React, { Suspense } from 'react';
import { Snippet } from '@nextui-org/snippet';
import { Code } from '@nextui-org/code';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Skeleton } from '@nextui-org/skeleton';
import Script from 'next/script';

import { title, subtitle } from '@/components/primitives';
import VideoCard from '@/components/VideoCard';
import CategoryNav from '@/components/CategoryNav';
import {
  getFeaturedVideos,
  getCategories,
  getRecentVideos,
  getPopularVideos,
} from '@/config/HomeVideos';
import { Video } from '@/types/index';

export default async function Home() {
  const websiteId = 2;

  try {
    const resWebsite = await fetch(
      'https://strapi.xiaoxinlook.cc/api/websites/2?fields[0]=imageURL&fields[1]=PPURL&fields[2]=name',
      { next: { revalidate: 7200 } }
    );

    if (!resWebsite.ok) {
      notFound();
    }
    const dataWebsite = await resWebsite.json();
    const websiteImageURL = dataWebsite.data.attributes.imageURL;
    const PPURL = dataWebsite.data.attributes.PPURL;
    const websiteName = dataWebsite.data.attributes.name;

    const [
      featuredVideosData,
      categoriesData,
      recentVideosData,
      popularVideosData,
    ] = await Promise.all([
      getFeaturedVideos(websiteId, 4).catch((_error: Error) => {
        //console.error('Error fetching featured videos:', error);

        return { data: [] };
      }),
      getCategories(websiteId, 5, 10, true).catch((_error: Error) => {
        //console.error('Error fetching categories:', error);

        return { data: [] };
      }),
      getRecentVideos(websiteId, 8).catch((_error: Error) => {
        // console.error('Error fetching recent videos:', error);

        return { data: [] };
      }),
      getPopularVideos(websiteId, 8).catch((_error: Error) => {
        //console.error('Error fetching popular videos:', error);

        return { data: [] };
      }),
    ]);

    if (
      !featuredVideosData.data.length &&
      !recentVideosData.data.length &&
      !popularVideosData.data.length
    ) {
      notFound();
    }
    //const featuredVideos = featuredVideosData.data;
    const categories = categoriesData.data;
    const recentVideos = recentVideosData.data;
    const popularVideos = popularVideosData.data;

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
          <Suspense fallback={<Skeleton className="w-24 h-10 rounded-lg" />}>
            <CategoryNav categories={categories} />
          </Suspense>
          <div className="w-full max-w-7xl">
            <h2 className="text-2xl font-bold mb-4">最新上线</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2">
              {recentVideos.slice(0, 10).map((video) => (
                <VideoCard
                  key={video.id}
                  category={''}
                  video={video}
                  websiteImageURL={websiteImageURL}
                />
              ))}
            </div>
            <div className="text-right mt-2">
              <Link className="text-primary hover:underline" href="/recent">
                查看更多
              </Link>
            </div>
          </div>

          <div className="w-full max-w-7xl mt-8">
            <h2 className="text-2xl font-bold mb-4">热门推荐</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2">
              {popularVideos.slice(0, 10).map((video) => (
                <VideoCard
                  key={video.id}
                  category={''}
                  video={video}
                  websiteImageURL={websiteImageURL}
                />
              ))}
            </div>
            <div className="text-right mt-2">
              <Link className="text-primary hover:underline" href="/popular">
                查看更多
              </Link>
            </div>
          </div>

          {categories
            .filter((category) => category.attributes.videos.data.length >= 4)
            .slice(0, 8)
            .map((category) => (
              <div key={category.id} className="w-full max-w-7xl mt-8">
                <h2 className="text-2xl font-bold mb-4">
                  {category.attributes.name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2">
                  {category.attributes.videos.data
                    .slice(0, 4)
                    .map((video: Video) => (
                      <VideoCard
                        key={video.id}
                        category={category.attributes.name}
                        video={video}
                        websiteImageURL={websiteImageURL}
                      />
                    ))}
                </div>
                <div className="text-right mt-2">
                  <Link
                    className="text-primary hover:underline"
                    href={`/category/${category.attributes.slug}`}
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
  } catch (error) {
    notFound();
  }
}
