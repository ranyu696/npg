// VideoCard.tsx

import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import type { Video } from '@/types/index';
import {Skeleton} from "@nextui-org/skeleton";


type VideoCardProps = {
  video: Video;
};

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { originalname, poster2, _id,poster, duration } = video;
  const IMG_HOST = process.env.NEXT_PUBLIC_IMG_HOST;
  const posterUrl = `${IMG_HOST}${poster2 ? poster2.url : poster}`;
  const posterwidth = poster2 && poster2.width ? poster2.width : 850;
  const posterheight = poster2 && poster2.height ? poster2.height : 500;
  // 视频时长处理
  const match = duration.match(/\d+/);
  const durationInMinutes = match ? parseInt(match[0], 10) : 0;
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

  return (
    <div className="thumbnail group">
    <div className="relative aspect-w-16 aspect-h-9 rounded overflow-hidden shadow-lg">
      <span className="absolute bottom-1 right-1 rounded-lg px-2 py-1 text-xs text-white bg-white/30 backdrop-blur-sm">
        {time}
      </span>
      <Link href={`/video/${_id}`}>
      <Image
        loading="lazy"
        placeholder="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 300'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='%23e0e0e0'%3E%3Canimate attributeName='x' from='-100%25' to='100%25' dur='1s' repeatCount='indefinite'/%3E%3C/rect%3E%3C/svg%3E"
        src={posterUrl}
        alt={originalname}
        width={posterwidth} // 确保提供适当的尺寸
        height={posterheight} // 确保提供适当的尺寸
        className="object-cover w-full h-full"
      />
      </Link>

      
    </div>
    <div className="my-2 text-sm text-nord4 truncate">
    <Link href={`/video/${_id}`}>
      <p className="text-secondary group-hover:text-primary">
        {originalname}
      </p>
      </Link>
    </div>
    </div>
  );
};

export default VideoCard;