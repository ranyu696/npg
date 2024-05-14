"use client";
import React, { useEffect, useRef } from 'react';
import { Card } from '@nextui-org/card';
import Hls from 'hls.js';
import DPlayer, { DPlayerOptions } from 'dplayer';

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl: string;
  thumbnailUrl: string;
  duration: number;
}

const VideoPlayer = ({ videoUrl, posterUrl, thumbnailUrl }: VideoPlayerProps) => {
  const dpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dpRef.current) {
      const dp = new DPlayer({
        container: dpRef.current,
        autoplay: false,
        airplay: false,
        playInline: true,
        video: {
          url: videoUrl,
          type: 'customHls',
          pic: posterUrl,
          thumbnails: thumbnailUrl,
          customType: {
            customHls: function (video: HTMLMediaElement, player: DPlayerOptions) {
              const hls = new Hls();
              hls.loadSource(video.src);
              hls.attachMedia(video);
            },
          },
        },
        poster: posterUrl,
      });

      return () => {
        dp.destroy();
      };
    }
  }, [videoUrl, posterUrl]);

  return (
    <Card className="border-none bg-background/60 dark:bg-default-100/50 max-w-auto" shadow="sm">
      <div className="grid grid-cols-6 items-center justify-center">
        <div className="relative col-span-6 w-full object-cover aspect-w-16 aspect-h-9">
          <div ref={dpRef} />
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;