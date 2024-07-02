import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
interface Actor {
  id: number;
  attributes: {
    name: string;
    // 其他 Actor 相关字段
  };
}

interface Tag {
  id: number;
  attributes: {
    name: string;
    // 其他 Tag 相关字段
  };
}

export interface SubCategory {
  id: number; // 根据实际情况选择 string 或 number
  attributes: {
    name: string;
    slug: string;
    length: number;
    // 添加其他 subCategory 可能有的属性
  };
}

export interface Category {
  id: number; // 根据实际情况选择 string 或 number
  attributes: {
    name: string;
    slug: string;
    videos: {
      data: Video[];
    };
    subcategories?: {
      data: SubCategory[];
    };
  };
}

interface M3u8Path {
  hd: string;
  path: string;
}

interface Poster2 {
  url: string;
  height: number;
  width: number;
}

interface Screenshot {
  url: string;
}

// 主要的 Video 接口
export interface Video {
  id: string;
  attributes: {
    originalname: string;
    aka: string;
    summary: string;
    moviepath: string;
    actors: {
      data: Actor[];
    };
    tags: {
      data: Tag[];
    };
    category: {
      data: Category;
    };
    language: string;
    firstScreen: string;
    poster: string;
    previewvideo: string;
    gif: string;
    video_id: string;
    m3u8paths: M3u8Path;
    poster2: Poster2;
    episodes: {
      videos: {
        data: Video[];
      };
    };
    originaltitle: string;
    studio: string;
    serie: string;
    director: string;
    screenshots: Screenshot[];
    count: number;
    isEpisode: boolean;
    duration: string;
    releaseDate: string; // 或者使用 Date 类型，取决于您如何处理日期
    year: number;
    // 添加 Strapi 的元数据字段
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// 如果需要，可以为列表响应创建一个接口
export interface VideoListResponse {
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

// 单个视频响应的接口
export interface VideoResponse {
  data: Video;
  meta: {};
}
export interface ApiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
