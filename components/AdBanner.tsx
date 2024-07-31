import React from 'react';
import Image from 'next/image';

interface AdBannerProps {
  banners: {
    data: AdvertisementBanner[];
  };
  baseUrl: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ banners, baseUrl }) => {
  if (!banners || !banners.data || !Array.isArray(banners.data)) {
    return null;
  }

  const sortedBanners = [...banners.data].sort((a, b) => {
    const orderA = parseInt(a.attributes.order) || 0;
    const orderB = parseInt(b.attributes.order) || 0;

    return orderA - orderB;
  });

  return (
    <div className="w-full max-w-7xl mt-1 mb-8">
      {sortedBanners.map((banner) => {
        const imageData = banner.attributes.image.data[0]?.attributes;

        if (!imageData) {
          return null;
        }

        return (
          <a
            key={banner.id}
            className="block mb-4"
            href={banner.attributes.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt={banner.attributes.name}
              className="w-full h-auto"
              height={imageData.height}
              loading="lazy"
              src={`${baseUrl}${imageData.url}`}
              width={imageData.width}
            />
          </a>
        );
      })}
    </div>
  );
};

export default AdBanner;
