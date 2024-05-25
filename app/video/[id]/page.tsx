
import { fetchContents, fetchVideoById } from '@/app/lib/api';
import VideoPlayer from '@/components/VideoPlayer';
import {Chip} from "@nextui-org/chip";
import { FcMultipleCameras } from "react-icons/fc";
import { FcFilm } from "react-icons/fc";
import ButtonServer from '@/components/ButtonServer';
import { Metadata } from 'next';
import VideoCard from '@/components/VideoCard';
import type { Video } from '@/types/index';

type Props = {
  params: { id: string };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const IMG_HOST = process.env.NEXT_PUBLIC_IMG_HOST;
  
  // 根据id获取视频信息
  const video = await fetchVideoById(id);
  
  return {
    title: video.title,
    description: `${video.category} ${video.title} 在线观看`,
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description: video.tags,
      images: [
        {
          url: `${IMG_HOST}${video.poster2.url}`,
          width: video.poster2.width,
          height: video.poster2.height,
        },
      ],
    },
    openGraph: {
      type: 'video.other',
      title: video.title,
      url: `/videos/${video.id}`,
      locale: 'zh_CN',
      description: `${video.category} ${video.title} 在线观看`,
      images: [
        {
          url: `${IMG_HOST}${video.poster2.url}`,
          width: video.poster2.width,
          height: video.poster2.height,
        },
      ],
      videos: [
        {
          url: video.m3u8,
          type: 'application/x-mpegURL',
        },
      ],
    },
  };
}
export default async function VideoPage({ params }: Props) {
  const video = await fetchVideoById(params.id);
  const videos = await fetchContents('category', video.category, 'movie,tv', 1, 10, 'countDesc');
  const IMG_HOST = process.env.NEXT_PUBLIC_IMG_HOST;
  const posterUrl = `${IMG_HOST}${video.poster2.url}`;

  return (
    <>
    <div className="w-full lg:w-3/4">
      <VideoPlayer videoUrl={video.m3u8}  posterUrl={posterUrl} />
      <div className="mt-4 flex items-center justify-between">
  <h1 className="text-base lg:text-lg text-nord6 flex-grow">{video.title}</h1>
  <ButtonServer>点击复制网址</ButtonServer>
       
</div>
      <Chip
        startContent={<FcMultipleCameras size={18} />}
        variant="faded"
        color="success"
      >
        {video.count}次
      </Chip>
      <Chip
        startContent={<FcFilm size={18} />}
        variant="faded"
        color="success"
      >
        {video.category}
      </Chip>
      <p>{video.summary}</p>
      <div className="pt-4">
      <div className="mt-4 mb-4">
       <h2 className='font-bold text-lg border-rose-500 border-l-4 pl-3'>智能推荐</h2>
       <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-4 xl:gap-8 mt-4'>
            {video.likes.map((video: Video) => (
        <VideoCard key={video._id} video={video} />
      ))}
      </div>
    </div>
      </div>
      </div>
      <div className="w-full lg:w-1/4 p-3 hidden lg:block">
      <div className="flex-col mb-6">
      {videos.map((video: Video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
      </div>
      </>
  );
}