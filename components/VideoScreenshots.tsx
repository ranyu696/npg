'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody } from '@nextui-org/card';
import Image from 'next/image';
import { Modal, ModalContent, ModalBody } from '@nextui-org/modal';
import { Slider } from '@nextui-org/slider';

interface Screenshot {
  url: string;
}

interface VideoScreenshotsProps {
  screenshots: Screenshot[];
  websiteImageURL: string;
}

const VideoScreenshots: React.FC<VideoScreenshotsProps> = ({
  screenshots,
  websiteImageURL,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const handleSliderChange = (value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;

    setSliderValue(newValue);
    if (scrollContainerRef.current) {
      const maxScroll =
        scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth;

      scrollContainerRef.current.scrollLeft = maxScroll * newValue;
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;

      setSliderValue(scrollLeft / maxScroll);
    }
  };

  return (
    <Card>
      <CardBody>
        <h3 className="text-xl font-semibold mb-4">视频截图</h3>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory touch-pan-x"
            onScroll={handleScroll}
          >
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="snap-start flex-shrink-0 w-4/5 md:w-1/2 lg:w-1/3"
              >
                <Image
                  fill
                  alt={`Screenshot ${index + 1}`}
                  className="object-cover w-full h-auto cursor-pointer rounded-lg shadow-md"
                  src={`${websiteImageURL}${screenshot.url}`}
                  onClick={() =>
                    setSelectedImage(`${websiteImageURL}${screenshot.url}`)
                  }
                />
              </div>
            ))}
          </div>
          <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
        {isDesktop && (
          <Slider
            className="mt-4"
            color="foreground"
            maxValue={1}
            minValue={0}
            showSteps={false}
            size="sm"
            step={0.01}
            value={sliderValue}
            onChange={handleSliderChange}
          />
        )}
      </CardBody>

      <Modal
        isOpen={!!selectedImage}
        placement="bottom"
        size="5xl"
        onClose={() => setSelectedImage(null)}
      >
        <ModalContent>
          <ModalBody>
            {selectedImage && (
              <Image
                alt="Selected screenshot"
                className="w-full h-auto"
                src={selectedImage}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default VideoScreenshots;
