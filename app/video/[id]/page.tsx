import { createHash } from 'crypto';

import { Metadata } from 'next';
import Script from 'next/script';

import VideoPlayer from '@/components/VideoPlayer';
import Breadcrumbs from '@/components/Breadcrumbs';
import VideoInfo from '@/components/VideoInfo';
import VideoScreenshots from '@/components/VideoScreenshots';
import fetchRelatedVideos from '@/config/RelatedVideos';
import { Video } from '@/types/index';
import VideoCard from '@/components/VideoCard';

interface VideoPageProps {
  params: {
    id: string;
  };
}

function generateAntiTheftUrl(
  currentTimestamp: string,
  counts: string,
  url: string,
  tokenKey: string
) {
  const nowstamp = Date.now();
  const dutestamp = nowstamp + Number(currentTimestamp);
  const playCount = counts;
  const tokenUrl = `${url}&counts=${playCount}&timestamp=${dutestamp}${tokenKey}`;
  const md5 = createHash('md5');
  const md5Token = md5.update(tokenUrl).digest('hex');

  return `${url}?counts=${playCount}&timestamp=${dutestamp}&key=${md5Token}`;
}

function extractMinutes(durationStr: string): number {
  const match = durationStr.match(/(\d+)\s*分钟/);

  return match ? parseInt(match[1], 10) : NaN;
}

function convertMinutesToISO8601(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `PT${hours}H${remainingMinutes}M`;
}

async function getVideoData(id: string): Promise<Video> {
  let res = await fetch(
    `https://strapi.xiaoxinlook.cc/api/videos?filters[aka][$eq]=${id}&populate=*`,
    { next: { revalidate: 60 } }
  );
  let data = await res.json();

  if (!data.data || data.data.length === 0) {
    res = await fetch(
      `https://strapi.xiaoxinlook.cc/api/videos?filters[video_id][$eq]=${id}&populate=*`,
      { next: { revalidate: 60 } }
    );
    data = await res.json();
  }

  if (!data.data || data.data.length === 0) {
    throw new Error('Video not found');
  }

  return data.data[0];
}

async function getWebsiteData() {
  const res = await fetch(
    'https://strapi.xiaoxinlook.cc/api/websites/2?fields[]=name&fields[]=imageURL&fields[]=videoURL&fields[]=efvtoken&fields[]=counts&fields[]=currentTimestamp&populate[seo][populate][0]=metaSocial'
  );

  return res.json();
}

export async function generateMetadata({
  params,
}: VideoPageProps): Promise<Metadata> {
  const video = await getVideoData(params.id);
  const websiteData = await getWebsiteData();

  const websiteName = websiteData.data.attributes.name;
  const websiteImageURL = websiteData.data.attributes.imageURL;
  const seo = websiteData.data.attributes.seo;

  return {
    title: `${video.attributes.originalname} - ${websiteName}`,
    description:
      video.attributes.aka || `观看 ${video.attributes.originalname} 视频`,
    openGraph: {
      title: `${video.attributes.originalname} - ${websiteName}`,
      description:
        video.attributes.aka || `观看 ${video.attributes.originalname} 视频`,
      type: 'video.other',
      url: `${seo.canonicalURL}/video/${params.id}`,
      images: [
        {
          url: `${websiteImageURL}${video.attributes.poster2.url}`,
          width: video.attributes.poster2.width,
          height: video.attributes.poster2.height,
          alt: video.attributes.originalname,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${video.attributes.originalname} - ${websiteName}`,
      description:
        video.attributes.aka || `观看 ${video.attributes.originalname} 视频`,
      images: [`${websiteImageURL}${video.attributes.poster2.url}`],
    },
    alternates: {
      canonical: `${seo.canonicalURL}/video/${params.id}`,
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const video = await getVideoData(params.id);
  const websiteData = await getWebsiteData();

  const websiteImageURL = websiteData.data.attributes.imageURL;
  const websiteVideoURL = websiteData.data.attributes.videoURL;
  const seo = websiteData.data.attributes.seo;
  const efvtoken = websiteData.data.attributes.efvtoken;
  const counts = websiteData.data.attributes.counts;
  const currentTimestamp = websiteData.data.attributes.currentTimestamp;

  const antiTheftUrl = generateAntiTheftUrl(
    currentTimestamp,
    counts,
    video.attributes.m3u8paths.path,
    efvtoken
  );

  const CategoryName = video.attributes.category.data.attributes.name;
  const relatedVideos = await fetchRelatedVideos(video, 10);

  const durationInMinutes = extractMinutes(video.attributes.duration);
  const isoDuration = convertMinutesToISO8601(durationInMinutes);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.attributes.originalname,
    description:
      video.attributes.aka || `观看 ${video.attributes.originalname} 视频`,
    thumbnailUrl: `${websiteImageURL}${video.attributes.poster2.url}`,
    uploadDate: video.attributes.createdAt,
    duration: isoDuration,
    contentUrl: `${websiteVideoURL}${antiTheftUrl}`,
    embedUrl: `${seo.canonicalURL}/video/${params.id}`,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: video.attributes.count,
    },
  };

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id="jsonld-video"
        type="application/ld+json"
      />
      <section className="py-4">
        <h1 className="text-2xl font-bold mb-2">
          {video.attributes.originalname}
        </h1>
        <div className="mb-2">
          <Breadcrumbs />
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-3/4">
            <VideoPlayer
              title={video.attributes.originalname}
              videoId={video.id}
              videoPoster={`${websiteImageURL}${video.attributes.poster2.url}`}
              videoURL={`${websiteVideoURL}${antiTheftUrl}`}
            />
          </div>
          <div className="lg:w-1/4">
            <VideoInfo video={video} websiteImageURL={websiteImageURL} />
          </div>
        </div>
        <div className="mt-8">
          <VideoScreenshots
            screenshots={video.attributes.screenshots}
            websiteImageURL={websiteImageURL}
          />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">相关推荐</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2">
            {relatedVideos.map((video) => (
              <VideoCard
                key={video.id}
                category={CategoryName}
                video={video}
                websiteImageURL={websiteImageURL}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
