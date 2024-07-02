import qs from 'qs';

import { Video, Category, ApiResponse } from '@/types/index';

const API_URL = 'https://strapi.xiaoxinlook.cc/api';

// 定义查询参数的接口
interface QueryParams {
  filters?: Record<string, any>;
  fields?: string[];
  populate?: Record<string, any>;
  pagination?: {
    limit?: number;
    page?: number;
    pageSize?: number;
  };
  sort?: string[];
  random?: boolean;
}
/**
 * 带重试机制的fetch函数
 * @param url 请求URL
 * @param options 请求选项
 * @param retries 重试次数
 * @returns Promise<Response>
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          `Attempt ${i + 1}: Failed to fetch. Status: ${response.status}. Error: ${errorText}`
        );
        if (i === retries - 1) {
          throw new Error(
            `Failed to fetch after ${retries} attempts. Status: ${response.status}`
          );
        }
      } else {
        return response;
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
    }
    // 指数退避策略
    await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
  }
  throw new Error('Failed to fetch after all retries');
}

/**
 * 通用数据获取函数
 * @param endpoint API端点
 * @param queryParams 查询参数
 * @returns Promise<ApiResponse<T>>
 */
async function fetchData<T>(
  endpoint: string,
  queryParams: QueryParams
): Promise<ApiResponse<T>> {
  const { random, ...restParams } = queryParams;
  const query = qs.stringify(restParams, { encodeValuesOnly: true });
  const randomQuery = random ? '&random=true' : '';
  const url = `${API_URL}/${endpoint}?${query}${randomQuery}`;

  console.log(`Fetching ${endpoint} from:`, url);

  try {
    const response = await fetchWithRetry(url, {
      next: { revalidate: 60 }, // 缓存60秒
    });

    const data = await response.json();

    console.log(`Successfully fetched ${endpoint}. Count:`, data.data?.length);

    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// 定义通用的视频查询参数
const commonVideoParams = {
  fields: ['originalname', 'aka', 'duration', 'count'],
  populate: {
    poster2: {
      fields: ['url', 'width', 'height'],
    },
    category: {
      fields: ['name', 'slug'],
    },
  },
};

/**
 * 获取指定网站的所有分类ID
 * @param websiteId 网站ID
 * @returns Promise<number[]> 分类ID数组
 */
async function getCategoryIds(websiteId: number): Promise<number[]> {
  const categoriesResponse = await fetchData<Category>('categories', {
    filters: {
      website: { id: websiteId },
    },
    fields: ['id'],
  });

  return categoriesResponse.data.map((category) => category.id);
}

/**
 * 获取精选视频
 * @param websiteId 网站ID
 * @param limit 限制数量
 * @returns Promise<ApiResponse<Video>>
 */
export async function getFeaturedVideos(
  websiteId: number,
  limit: number
): Promise<ApiResponse<Video>> {
  const categoryIds = await getCategoryIds(websiteId);

  return fetchData<Video>('videos', {
    ...commonVideoParams,
    filters: {
      category: { id: { $in: categoryIds } },
      isFeatured: true,
    },
    pagination: { limit },
  });
}

/**
 * 获取分类（支持随机排序）
 * @param websiteId 网站ID
 * @param videoLimit 每个分类的视频限制数量
 * @param limit 分类数量限制
 * @param random 是否随机排序
 * @returns Promise<ApiResponse<Category>>
 */
export async function getCategories(
  websiteId: number,
  videoLimit: number,
  limit: number,
  random: boolean = true
): Promise<ApiResponse<Category>> {
  return fetchData<Category>('categories', {
    filters: {
      website: { id: websiteId },
    },
    fields: ['name', 'slug', 'description'],
    populate: {
      logo: {
        fields: ['url'],
      },
      videos: {
        fields: ['originalname', 'aka', 'duration', 'count'],
        populate: {
          poster2: {
            fields: ['url', 'width', 'height'],
          },
        },
        pagination: {
          limit: videoLimit,
        },
      },
    },
    pagination: { limit },
    random,
  });
}

/**
 * 获取最新视频
 * @param websiteId 网站ID
 * @param limit 限制数量
 * @param pageSize 每页视频数量（可选）
 * @param page 页码（可选）
 * @returns Promise<ApiResponse<Video>>
 */
export async function getRecentVideos(
  websiteId: number,
  limit: number,
  pageSize?: number,
  page?: number
): Promise<ApiResponse<Video>> {
  const categoryIds = await getCategoryIds(websiteId);
  const pagination: { limit?: number; page?: number; pageSize?: number } = {
    limit,
  };

  if (pageSize !== undefined && page !== undefined) {
    pagination.pageSize = pageSize;
    pagination.page = page;
    delete pagination.limit;
  }

  return fetchData<Video>('videos', {
    ...commonVideoParams,
    filters: {
      category: { id: { $in: categoryIds } },
    },
    sort: ['createdAt:desc'],
    pagination,
  });
}

/**
 * 获取热门视频
 * @param websiteId 网站ID
 * @param limit 限制数量
 * @param pageSize 每页视频数量（可选）
 * @param page 页码（可选）
 * @returns Promise<ApiResponse<Video>>
 */
export async function getPopularVideos(
  websiteId: number,
  limit: number,
  pageSize?: number,
  page?: number
): Promise<ApiResponse<Video>> {
  const categoryIds = await getCategoryIds(websiteId);
  const pagination: { limit?: number; page?: number; pageSize?: number } = {
    limit,
  };

  if (pageSize !== undefined && page !== undefined) {
    pagination.pageSize = pageSize;
    pagination.page = page;
    delete pagination.limit;
  }

  return fetchData<Video>('videos', {
    ...commonVideoParams,
    filters: {
      category: { id: { $in: categoryIds } },
    },
    sort: ['count:desc'],
    pagination,
  });
}
