import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import React from 'react';
import { FaFacebookF, FaTwitter, FaLink, FaDiscord } from 'react-icons/fa';

interface VideoInfoProps {
  video: {
    attributes: {
      screenshots: any;
      originalname: string;
      count: number;
      duration: string;
      aka?: string;
      gif: string;
      category: {
        data: {
          attributes: {
            name: string;
          };
        };
      };
    };
  };
  websiteImageURL: string;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ video, websiteImageURL }) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col items-start">
        <div className="flex justify-between w-full mt-2">
          <span className="text-base text-black">
            播放: {video.attributes.count}
          </span>
          <span className="text-base text-black">
            时长: {video.attributes.duration}
          </span>
        </div>
        <div className="flex justify-between w-full mt-1">
          <span className="text-base text-black">
            分类: {video.attributes.category.data.attributes.name}
          </span>
          {video.attributes.aka && (
            <span className="text-base text-black">
              番号: {video.attributes.aka}
            </span>
          )}
        </div>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Video preview"
          className="object-cover rounded-xl"
          src={`${websiteImageURL}${video.attributes.gif}`}
          width="100%"
        />
      </CardBody>
      <CardFooter className="justify-around">
        <Button isIconOnly aria-label="Facebook" color="primary" size="sm">
          <FaFacebookF />
        </Button>
        <Button isIconOnly aria-label="Twitter" color="primary" size="sm">
          <FaTwitter />
        </Button>
        <Button isIconOnly aria-label="Discord" color="primary" size="sm">
          <FaDiscord />
        </Button>
        <Button isIconOnly aria-label="Copy Link" color="primary" size="sm">
          <FaLink />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoInfo;
