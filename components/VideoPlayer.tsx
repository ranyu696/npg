"use client";
import { Card } from '@nextui-org/card';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import {
  MediaPlayer,
  MediaProvider,
  isHLSProvider,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from '@vidstack/react';
import { Gesture } from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';
import HLS from 'hls.js';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({videoUrl}: VideoPlayerProps) => {

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent,
  ) {
    if (isHLSProvider(provider)) {
      // Static import
      provider.library = HLS;
      // Or, dynamic import
      provider.library = () => import('hls.js');
    }
  }


  return (
    <Card className="border-none bg-background/60 dark:bg-default-100/50 max-w-auto" shadow="sm">
      <div className="grid grid-cols-6 items-center justify-center">
        <div className="relative col-span-6 w-full object-cover aspect-w-16 aspect-h-9">
        <MediaPlayer
      src={videoUrl}
      onProviderChange={onProviderChange}
      playsInline
      aspectRatio="16/9"
    >
      <MediaProvider />
      <Gesture className="vds-gesture" event="pointerup" action="toggle:paused" />
      <Gesture className="vds-gesture" event="pointerup" action="toggle:controls" />
      <Gesture className="vds-gesture" event="dblpointerup" action="seek:-10" />
      <Gesture className="vds-gesture" event="dblpointerup" action="seek:10" />
      <Gesture className="vds-gesture" event="dblpointerup" action="toggle:fullscreen" />
      <PlyrLayout icons={plyrLayoutIcons} />
    </MediaPlayer>
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;