import { fetchContents, fetchVideoById} from '@/config/api';
import VideoPlayer from '@/components/VideoPlayer';
import { Chip } from "@nextui-org/chip";
import { FcMultipleCameras } from "react-icons/fc";
import { FcFilm } from "react-icons/fc";
import ButtonServer from '@/components/ButtonServer';
import { Metadata } from 'next';
import VideoCard from '@/components/VideoCard';
import type { Video } from '@/types/index';
import { createHash } from 'crypto';

type Props = {
  params: { id: string };
};
// 生成防盗链URL的函数
function generateAntiTheftUrl(url: string, tokenKey: string) {
  const nowstamp = Math.floor(Date.now() / 1000);
  const dutestamp = nowstamp + 10; // 10秒后过期
  const playCount = 3; // 允许播放3次
  const tokenUrl = `${url}&counts=${playCount}&timestamp=${dutestamp}${tokenKey}`;
  
  const md5 = createHash('md5');
  const md5Token = md5.update(tokenUrl).digest('hex');

  return `${url}?counts=${playCount}&timestamp=${dutestamp}&key=${md5Token}`;
}

// 生成页面元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const IMG_HOST = process.env.NEXT_PUBLIC_IMG_HOST;
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
      url: `/video/${video.id}`,
      locale: 'zh_CN',
      description: `${video.category} ${video.title} 在线观看`,
      images: [
        {
          url: `${IMG_HOST}${video.poster2.url}`,
          width: video.poster2.width,
          height: video.poster2.height,
        },
      ],
    },
  };
}

// 页面组件
export default async function VideoPage({ params }: Props) {
  const IMG_HOST = process.env.NEXT_PUBLIC_IMG_HOST;
  const VIDEO_HOST = process.env.NEXT_PUBLIC_VIDEO_HOST
  const TOKEN_KEY = process.env.TOKEN_KEY || '1q1a1z2q2a2z3q3a3z';

  // 获取视频信息
  const video = await fetchVideoById(params.id);

  // 生成防盗链视频 URL 和海报链接
  const videoURL = generateAntiTheftUrl(`${VIDEO_HOST}${video.m3u8}`, TOKEN_KEY);
  const posterUrl = `${IMG_HOST}${video.poster2.url}`;

  // 获取相关视频
  const relatedVideos = await fetchContents('category', video.category, 'movie,tv', 1, 10, 'countDesc');

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-2 md:py-6">
    <div className="flex flex-wrap min-h-screen sm:px-4">
      <div className="w-full lg:w-3/4">
        {/* 视频播放器 */}
        <VideoPlayer videoUrl={videoURL} posterUrl={posterUrl} />

        {/* 视频标题和复制网址按钮 */}
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-base lg:text-lg text-nord6 flex-grow">{video.title}</h1>
          <ButtonServer>点击复制网址</ButtonServer>
        </div>

        {/* 视频统计信息 */}
        <div className="mt-4">
          <Chip startContent={<FcMultipleCameras size={18} />} variant="faded" color="success">
            {video.count}次
          </Chip>
          <Chip startContent={<FcFilm size={18} />} variant="faded" color="success">
            {video.category}
          </Chip>
        </div>

        {/* 视频摘要 */}
        <p className="mt-4">{video.summary}</p>

        {/* 相关视频推荐 */}
        <div className="mt-8">
          <h2 className='font-bold text-lg border-rose-500 border-l-4 pl-3'>智能推荐</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-4 xl:gap-8 mt-4'>
            {video.likes.map((video: Video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      </div>

      {/* 侧边栏相关视频 */}
      <div className="w-full lg:w-1/4 p-3 hidden lg:block">
        <div className="flex-col mb-6">
          {relatedVideos.map((video: Video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </div>
      </div>
		</section>
  );
}