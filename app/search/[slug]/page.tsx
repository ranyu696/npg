// app/search/[slug]/page.tsx
import { searchVideos } from '@/app/lib/api';
import VideoCard from "@/components/VideoCard";
import { Metadata } from 'next';

const allowedCategories = [
  '越南博主',
  '台湾博主',
  '内地博主',
  '香港博主',
  '欧美博主',
  "糖心VLOG",
  "兔子先生",
  "麻豆视频",
  "Ed Mosaic",
  "蜜桃传媒",
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
  "星空无限",
  "MarcDorcelLuxure",
  "寸止合集",
  "越南博主", 
  "台湾博主", 
  "内地博主",
  "香港博主",
  "欧美博主"
  ];
async function SearchResultPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = decodeURIComponent(params.slug);
  const pageSize = 1000;
  const currentPage = searchParams.page ? parseInt(searchParams.page as string, 10) : 1;

  const posts = await searchVideos(query, currentPage, pageSize);

  // 过滤搜索结果,只保留 "category" 为 "麻豆视频" 的结果
  const filteredPosts = posts.filter((posts: any) => allowedCategories.includes(posts.category));
  return (
    <>
      <h1 className="text-xl font-bold subpixel-antialiased pb-4">
        搜索结果: {query}
      </h1>
      <div className="grid grid-cols-2 gap-1 m:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 s:gap-1.5 m:gap-2.5 sm:gap-3.5 md:gap-4">
        {filteredPosts.map((video: any) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </>
  );
}

export default SearchResultPage;
export async function generateMetadata({ params, searchParams }: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const query = decodeURIComponent(params.slug);
  const pageSize = 1000;
  const currentPage = searchParams.page ? parseInt(searchParams.page as string, 10) : 1;
  const posts = await searchVideos(query, currentPage, pageSize);

  // 过滤搜索结果,只保留 "category" 为 "麻豆视频" 的结果
  const filteredPosts = posts.filter((post: any) => allowedCategories.includes(post.category));

  const resultCount = filteredPosts.length;
  const description = `共找到 ${resultCount} 个与 "${query}" 相关的视频`;

  return {
    title: `搜索结果: ${query}`,
    description,
    openGraph: {
      title: `搜索结果: ${query}`,
      description,
      type: 'website',
      url: `/search/${encodeURIComponent(query)}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `搜索结果: ${query}`,
      description,
    },
  };
}