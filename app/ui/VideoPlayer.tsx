'use client';
import { useEffect, useRef } from "react";
import "plyr-react/plyr.css"
import Hls from "hls.js";
import {Card} from "@nextui-org/card";
import Plyr, { APITypes, PlyrProps, PlyrInstance } from "plyr-react";

interface PlyrHLSProps {
  videoUrl: string;    // 视频源 URL
  posterUrl?: string;  // 视频封面图 URL
}

const PlyrHLS: React.FC<PlyrHLSProps> = ({ videoUrl, posterUrl }) => {
  const ref = useRef<APITypes>(null);

  useEffect(() => {
    const videoElement = document.getElementById("plyr") as HTMLVideoElement;
    videoElement.poster = posterUrl || ""; // 设置视频封面图

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement);
      // @ts-ignore
      ref.current!.plyr.media = videoElement;

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        (ref.current!.plyr as PlyrInstance).play();
      });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = videoUrl; // 对于原生支持 HLS 的浏览器，如 Safari
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play();
      });
    } else {
      console.error("HLS is not supported in your browser.");
    }
  }, [videoUrl, posterUrl]);

  return (
    <Card
    className="border-none bg-background/60 dark:bg-default-100/50 max-w-auto"
    shadow="sm"
  >
    <div className="grid grid-cols-6 items-center justify-center">
      <div className="relative col-span-6 w-full object-cover aspect-w-16 aspect-h-9">
    <Plyr
      id="plyr"
      options={{ volume: 0.1 }}
      source={{} as PlyrProps["source"]}
      ref={ref}
    />
     </div>
     </div>
     </Card>
  );
};
export default PlyrHLS;
