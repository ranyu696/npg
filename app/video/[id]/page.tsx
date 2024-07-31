import { Metadata } from 'next';
import Script from 'next/script';

import VideoCard from '@/components/VideoCard';
import { getWebsiteInfo, getRelatedVideos, getVideoData } from '@/config/api';
import { generateAntiTheftUrl, generateVideoJsonLd } from '@/config/utils';

import VideoPlayer from './VideoPlayer';
import VideoInfo from './VideoInfo';
import VideoScreenshots from './VideoScreenshots';
import VideoBread from './VideoBread';
interface VideoPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const [video, websiteData] = await Promise.all([getVideoData(params.id), getWebsiteInfo()]);

  const websiteInfo = websiteData.data.attributes;
  const seo = websiteInfo.seo;

  return {
    title: `${video.attributes.originalname} - ${websiteInfo.name}`,
    description: video.attributes.aka || `观看 ${video.attributes.originalname} 视频`,
    openGraph: {
      title: `${video.attributes.originalname} - ${websiteInfo.name}`,
      description: video.attributes.aka || `观看 ${video.attributes.originalname} 视频`,
      type: 'video.other',
      url: `${seo.canonicalURL}/video/${params.id}`,
      images: [
        {
          url: `${websiteInfo.imageURL}${video.attributes.poster2.url}`,
          width: video.attributes.poster2.width,
          height: video.attributes.poster2.height,
          alt: video.attributes.originalname,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${video.attributes.originalname} - ${websiteInfo.name}`,
      description: video.attributes.aka || `观看 ${video.attributes.originalname} 视频`,
      images: [`${websiteInfo.imageURL}${video.attributes.poster2.url}`],
    },
    alternates: {
      canonical: `${seo.canonicalURL}/video/${params.id}`,
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const [video, websiteData] = await Promise.all([getVideoData(params.id), getWebsiteInfo()]);

  const websiteInfo = websiteData.data.attributes;

  const antiTheftUrl = generateAntiTheftUrl(
    websiteInfo.currentTimestamp,
    websiteInfo.counts,
    video.attributes.m3u8paths.path,
    websiteInfo.efvtoken
  );

  const categorySlug = video.attributes.category.data.attributes.slug;
  const relatedVideos = await getRelatedVideos(video.id.toString(), categorySlug, {
    pagination: { limit: 10 },
  });

  const jsonLd = generateVideoJsonLd(video, websiteInfo, antiTheftUrl);

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id="jsonld-video"
        type="application/ld+json"
      />
      <section className="py-4">
        <h1 className="text-2xl font-bold mb-2">{video.attributes.originalname}</h1>
        <div className="mb-2">
          <VideoBread />
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-3/4">
            <VideoPlayer
              title={video.attributes.originalname}
              videoId={video.id}
              videoPoster={`${websiteInfo.imageURL}${video.attributes.poster2.url}`}
              videoURL={`${websiteInfo.videoURL}${antiTheftUrl}`}
            />
          </div>
          <div className="lg:w-1/4">
            <VideoInfo video={video} websiteImageURL={websiteInfo.imageURL} />
          </div>
        </div>
        <div className="mt-8">
          <VideoScreenshots
            screenshots={video.attributes.screenshots}
            websiteImageURL={websiteInfo.imageURL}
          />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">相关推荐</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2">
            {relatedVideos.data.map((relatedVideo: Video) => (
              <VideoCard
                key={relatedVideo.id}
                category={video.attributes.category.data.attributes.name}
                video={relatedVideo}
                websiteImageURL={websiteInfo.imageURL}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
