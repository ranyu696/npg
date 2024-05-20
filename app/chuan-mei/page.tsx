// app/categories/chuan-mei/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Divider } from "@nextui-org/divider";
import VideoCard from "@/components/VideoCard";
import { Video } from '@/types';
import {Progress} from "@nextui-org/progress";
import { Snippet } from '@nextui-org/snippet';
import { Code } from '@nextui-org/code';
import Link from 'next/link'

const categories = [
  "麻豆视频",
  "糖心VLOG",
  "兔子先生",
  "Ed Mosaic",
  "皇家华人",
  "蜜桃传媒",
  "萝莉社",
  "葫芦影业",
  "天美传媒",
  "扣扣传媒",
  "大象传媒",
  "91制片厂",
  "肉肉传媒",
  "性视界",
  "起点传媒",
  "乌托邦",
  "杏吧传媒",
  "冠希传媒",
  "果冻传媒",
  "蝌蚪传媒",
  "爱豆传媒",
  "绝对领域",
  "精东传媒",
  "猫爪影像",
  "爱神传媒",
  "星空无限"
];

const CategoryTabs: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api?category=${activeCategory}`);
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [activeCategory, setVideos]);

  return (
    <>
      <div className="flex flex-nowrap overflow-x-auto md:flex-wrap md:overflow-x-visible scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-md mr-2 mb-0 md:mb-2 transition-colors duration-300 whitespace-nowrap ${
              activeCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <Divider className="my-4" />
      {isLoading ? (
       <div className="flex justify-center items-center h-screen">
       <Progress size="sm" isIndeterminate aria-label="Loading..." className="max-w-md" />
     </div>
      ) : (
        <div className="grid grid-cols-2 gap-1 m:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 s:gap-1.5 m:gap-2.5 sm:gap-3.5 md:gap-4">
          {videos.map((video: any) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
      <div className="flex justify-center mt-8">
      <Link href={`/chuan-mei/${activeCategory}`}>
  <Snippet hideSymbol hideCopyButton variant="flat">
    <span>
      查看更多 <Code color="primary">GO</Code>
    </span>
  </Snippet>
</Link>
      </div>
    </>
  );
};

export default CategoryTabs;