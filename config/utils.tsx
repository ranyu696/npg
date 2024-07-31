import { createHash } from 'crypto';

// 生成防盗链URL
export function generateAntiTheftUrl(
  currentTimestamp: string,
  counts: number,
  url: string,
  tokenKey: string
): string {
  const nowstamp = Date.now();
  const dutestamp = nowstamp + Number(currentTimestamp);
  const playCount = counts;
  const tokenUrl = `${url}&counts=${playCount}&timestamp=${dutestamp}${tokenKey}`;
  const md5 = createHash('md5');
  const md5Token = md5.update(tokenUrl).digest('hex');

  return `${url}?counts=${playCount}&timestamp=${dutestamp}&key=${md5Token}`;
}

// 从持续时间字符串中提取分钟数
export function extractMinutes(durationStr: string): number {
  const match = durationStr.match(/(\d+)\s*分钟/);

  return match ? parseInt(match[1], 10) : 0;
}

// 将分钟数转换为ISO 8601格式
export function convertMinutesToISO8601(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `PT${hours}H${remainingMinutes}M`;
}

// 生成结构化数据
export function generateVideoJsonLd(video: any, websiteInfo: any, antiTheftUrl: string): object {
  const durationInMinutes = extractMinutes(video.attributes.duration);
  const isoDuration = convertMinutesToISO8601(durationInMinutes);

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.attributes.originalname,
    description: video.attributes.aka || `观看 ${video.attributes.originalname} 视频`,
    thumbnailUrl: `${websiteInfo.imageURL}${video.attributes.poster2.url}`,
    uploadDate: video.attributes.createdAt,
    duration: isoDuration,
    contentUrl: `${websiteInfo.videoURL}${antiTheftUrl}`,
    embedUrl: `${websiteInfo.seo.canonicalURL}/video/${video.attributes.video_id}`,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: video.attributes.count,
    },
  };
}
