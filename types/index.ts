type ReferrerEnum =
  | 'no-referrer'
  | 'origin'
  | 'no-referrer-when-downgrade'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url'
  | null
  | undefined;
interface SVGProps {
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  fill?: string;
  xmlns?: string;
  // 你可以根据需要添加其他属性
}

type IconSvgProps = SVGProps & {
  size?: number;
  className?: string;
};

interface Website {
  data: any;
  id: number;
  attributes: {
    name: string;
    googleAnalyticsId: string;
    MetrikaID: number;
    AdvertisementCode: string; // Rich text (Blocks) 类型,可能需要更具体的定义
    announcement: string;
    imageURL: string;
    videoURL: string;
    email: string;
    advertisement_icons: {
      data: AdvertisementIcon[];
    };
    advertisement_banners: {
      data: AdvertisementBanner[];
    };
    Links: Array<{
      id: number;
      order: number | null;
      name: string;
      url: string;
    }>;
    categories: {
      data: Category[];
    };
    seo: SEO;
    Telegram: string;
    Twitter: string;
    PPURL: string;
    efvtoken: string;
    counts: number;
    currentTimestamp: string;
  };
}

interface AdvertisementBanner {
  id: number;
  attributes: {
    order: string;
    url: string;
    name: string;
    image: {
      data: Array<{
        attributes: {
          url: string;
          width: number;
          height: number;
        };
      }>;
    };
  };
}
interface AdvertisementIcon {
  id: number;
  attributes: {
    order: string;
    url: string;
    name: string;
    image: string;
  };
}

interface Category {
  id: number;
  attributes: {
    name: string;
    description?: string;
    keywords?: string;
    videos?: {
      data: Video[];
    };
    slug: string;
    subcategories: {
      data: Category[];
    };
    parent?: {
      data: Category | null;
    };
    categories?: {
      data: Category[];
    };
    isCategory: boolean;
    websites?: {
      data: Website[];
    };
  };
}

interface SEO {
  canonicalURL: string;
  metaSocial: Array<{
    socialNetwork: string;
    title: string;
    description: string;
  }>;
  metaRobots: {
    index: boolean;
    follow: boolean;
    nocache: boolean;
  };
  templateTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  BasicFields: {
    generator: string;
    applicationName: string;
    referrer: ReferrerEnum;
    authors: string;
    creator: string;
    publisher: string;
  };
  formatDetection: {
    email: boolean;
    address: boolean;
    telephone: boolean;
  };
}

interface MetaSocial {
  socialNetwork: 'Facebook' | 'Twitter'; // 假设这是枚举类型的可能值
  title: string;
  description: string;
  image: Media;
}

interface BasicFields {
  generator: string;
  applicationName: string;
  referrer: string;
  authors: string;
  creator: string;
  publisher: string;
}

interface FormatDetection {
  email: boolean;
  address: boolean;
  telephone: boolean;
}

interface MetaRobots {
  index: boolean;
  follow: boolean;
  nocache: boolean;
}

interface Media {
  // 定义Media的属性,可能包括url, type等
  url: string;
  type: string;
  // 其他可能的属性
}

interface ApiResponse<T> {
  data: T;
  meta: {
    pagination: PaginationMeta;
  };
}
interface Video {
  id: number;
  attributes: {
    originalname: string;
    aka?: string;
    summary?: string;
    moviepath: string;
    actors?: {
      data: Actor[];
    };
    tags?: {
      data: Tag[];
    };
    category: {
      data: Category;
    };
    language?: string;
    firstScreen: string;
    poster: string;
    previewvideo?: string;
    gif: string;
    video_id: string;
    m3u8paths: {
      hd: string;
      path: string;
    };
    poster2: {
      url: string;
      height: number;
      width: number;
    };
    episodes?: {
      videos?: {
        data: Video[];
      };
    };
    originaltitle?: string;
    studio?: string;
    serie?: string;
    director?: string;
    screenshots: Array<{
      url: string;
    }>;
    count: number;
    isEpisode?: boolean;
    duration: string;
    releaseDate?: string; // 或者使用 Date 类型
    year?: number;
    isFeatured?: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

interface M3U8Paths {
  hd: string;
  path: string;
}

interface Poster2 {
  url: string;
  height: number;
  width: number;
}

interface Episodes {
  videos: Video[]; // 注意这里是对Video自身的引用
}

interface Screenshot {
  url: string;
}

// 以下接口需要根据实际情况定义
interface Actor {
  // 定义Actor的属性
}

interface Tag {
  // 定义Tag的属性
}
interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
interface SearchResult {
  data: Video[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
interface SearchPageProps {
  searchParams: { q: string; page?: string };
}
interface CategoryPageProps {
  params: { id: string };
  searchParams: { page?: string };
}
interface QueryOptions {
  populate?: string | object;
  fields?: string[];
  filters?: object;
  locale?: string | string[];
  publicationState?: 'live' | 'preview';
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
    withCount?: boolean;
  };
  next?: NextFetchRequestConfig;
}
