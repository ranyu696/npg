// app/lib/getData.tsx
import { fetchContents } from '@/config/api';

export async function getData() {
  const categories = ['麻豆视频', '糖心VLOG', 'Ed Mosaic', '皇家华人', '兔子先生', '果冻传媒'];
  const videosByCategory: { [key: string]: any[] } = {};

  for (const category of categories) {
    const data = await fetchContents('category', category, 'movie,tv', 1, 10);
    videosByCategory[category] = data;
  }

  return videosByCategory;
}