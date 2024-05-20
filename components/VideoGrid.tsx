import React from 'react';
import VideoCard from '@/components/VideoCard';

interface VideoGridProps {
  videos: any[];
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos }) => {
  return (
    <div className="grid grid-rows-4 grid-cols-5 gap-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;