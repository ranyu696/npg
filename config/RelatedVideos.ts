import { Video } from '@/types/index'; // 假设您有一个 Video 类型定义

async function fetchRelatedVideos(
  video: Video,
  limit: number = 8
): Promise<Video[]> {
  const categoryName = video.attributes.category.data.attributes.name;
  const currentVideoId = video.id;

  try {
    const response = await fetch(
      `https://strapi.xiaoxinlook.cc/api/videos?filters[category][name][$eq]=${encodeURIComponent(categoryName)}` +
        `&filters[id][$ne]=${currentVideoId}` + // 排除当前视频
        `&fields[0]=originalname&fields[1]=duration&fields[2]=aka&fields[3]=count` +
        `&populate[poster2][fields][0]=url&populate[poster2][fields][1]=width&populate[poster2][fields][2]=height` +
        `&populate[category][fields][0]=name` +
        `&random=true` + // 使用 Strapi 的随机排序
        `&pagination[limit]=${limit + 5}`, // 多获取几个，以防有重复
      {
        next: { revalidate: 3600 }, // 缓存一小时
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch related videos');
    }

    const data = await response.json();
    let relatedVideos = data.data;

    // 在客户端进行额外的随机化和去重
    relatedVideos = relatedVideos
      .filter((video: Video) => video.id !== currentVideoId) // 再次确保当前视频被排除
      .sort(() => 0.5 - Math.random()) // 额外的随机排序
      .slice(0, limit); // 限制数量

    return relatedVideos;
  } catch (error) {
    console.error('Error fetching related videos:', error);

    return [];
  }
}

export default fetchRelatedVideos;
