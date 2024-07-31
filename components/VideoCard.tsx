import React from 'react';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import Image from 'next/image';
import Link from 'next/link';
import { AiFillEye } from 'react-icons/ai';
import { RiTimeLine } from 'react-icons/ri';

interface VideoCardProps {
  video: Video;
  websiteImageURL: string;
  category: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, websiteImageURL, category }) => {
  // 生成视频链接
  const videoLink = React.useMemo(() => {
    if (video.attributes?.aka) {
      return `/video/${video.attributes.aka}`;
    }
    if (video.attributes?.video_id) {
      return `/video/${video.attributes.video_id}`;
    }
    if (typeof video.id === 'string' || typeof video.id === 'number') {
      return `/video/${video.id}`;
    }

    return '/videos'; // 默认链接，可以改为您的视频列表页面
  }, [video]);

  return (
    <Card isBlurred isPressable className="mb-1 s:mb-1.5 m:mb-2.5 sm:mb-3.5 md:mb-4" radius="sm">
      <CardBody className="p-0">
        <Link href={videoLink}>
          <div className="relative w-full aspect-video">
            <Image
              alt={video.attributes.originalname}
              className="object-cover rounded-xl"
              height={video.attributes.poster2.height}
              src={`${websiteImageURL}${video.attributes.poster2.url}`}
              width={video.attributes.poster2.width}
            />
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-primary text-white px-1 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm rounded">
                {category}
              </span>
            </div>
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-success text-white px-1 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm rounded">
                HD
              </span>
            </div>
            <div className="absolute bottom-2 left-2 z-10 flex items-center">
              <span className="text-white px-1 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm bg-black bg-opacity-50 rounded flex items-center">
                <AiFillEye className="sm:size-18 mr-1" size={14} />
                {video.attributes.count}
              </span>
            </div>
            <div className="absolute bottom-2 right-2 z-10 flex items-center">
              <span className="text-white px-1 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm bg-black bg-opacity-50 rounded flex items-center">
                <RiTimeLine className="sm:size-18 text-white mr-1" size={14} />
                {video.attributes.duration}
              </span>
            </div>
          </div>
        </Link>
      </CardBody>
      <CardFooter className="justify-between overflow-hidden py-1 rounded-large w-full shadow-small z-10 bg-white/10 border-white/20 border-1">
        <p className="text-tiny text-black/80 dark:text-white/80 line-clamp-1">
          {video.attributes.originalname}
        </p>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
