// app/home/page.tsx
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { title, subtitle } from "@/components/primitives";
import VideoCard from "@/app/ui/VideoCard";
import Image from 'next/image';
import Link from 'next/link';
import { getData } from '@/app/lib/getData'; // 导入 React Server Component

export default async function Home() {
  const videosByCategory = await getData();
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-1">
      <div className="inline-block max-w-2xl text-center justify-center">
        <h1 className={title({ color: "violet" })}>女仆阁&nbsp;</h1>
        <br />
        <h2 className={subtitle({ class: "mt-4" })}>
        女仆阁专注于提供高质量的视频内容，让您的生活更加丰富多彩。
        </h2>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
  <Link href={process.env.NEXT_PUBLIC_ASX_HOST || 'default_url'}>
    <Image src="/asxhengfu.png" alt="Description" width={1080} height={105} />
  </Link>
  <Link href={process.env.NEXT_PUBLIC_SQKJ_HOST || 'default_url'}>
    <Image src="/sqkjhengfu.png" alt="Description" width={1080} height={105} />
  </Link>
</div>
      {Object.entries(videosByCategory).map(([category, videos]) => (
        <div key={category} className="category-videos">
          <h2 className="text-xl font-bold subpixel-antialiased pb-4">
            类别: {category}
          </h2>
          <div className="grid grid-cols-2 gap-1 m:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 s:gap-1.5 m:gap-2.5 sm:gap-3.5 md:gap-4">
          {videos.map((video: any) => (
              
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8">
        <Snippet hideSymbol hideCopyButton variant="flat">
          <span>
            收藏最新地址<Code color="primary">npg3.ru</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}