//config\api.ts

import qs from 'qs';

async function fetchAPI<T>(endpoint: string, options: QueryOptions = {}): Promise<ApiResponse<T>> {
  const query = qs.stringify(options, {
    encodeValuesOnly: true,
    arrayFormat: 'indices',
    addQueryPrefix: true,
  });

  const url = `${process.env.STRAPI_API_URL}/api/${endpoint}${query}`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  };

  try {
    const response = await fetch(url, { headers, next: options.next });

    if (!response.ok) {
      const errorBody = await response.text();

      throw new Error(
        `API request failed: ${response.statusText}. URL: ${url}. Details: ${errorBody}`
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch from ${url}. Error: ${error}`);
  }
}
export async function getCategories(options: QueryOptions = {}): Promise<ApiResponse<Category[]>> {
  const defaultOptions: QueryOptions = {
    filters: {
      isCategory: {
        $eq: true,
      },
      websites: {
        id: {
          $eq: 2,
        },
      },
    },
    populate: ['subcategories', 'parent', 'categories'],
    ...options,
  };

  return fetchAPI<Category[]>('categories', defaultOptions);
}

export async function getWebsiteInfo(options: QueryOptions = {}): Promise<ApiResponse<Website>> {
  const defaultOptions: QueryOptions = {
    fields: ['*'],
    populate: {
      advertisement_banners: {
        populate: '*',
      },
      seo: {
        populate: ['metaSocial', 'BasicFields', 'formatDetection', 'metaRobots', 'Links'],
      },
      Links: {
        populate: '*',
      },
    },
    ...options,
  };

  return fetchAPI<Website>('websites/2', defaultOptions);
}

export async function getRelatedVideos(
  videoId: string,
  categorySlug: string,
  options: QueryOptions = {}
): Promise<ApiResponse<Video[]>> {
  const defaultOptions: QueryOptions = {
    filters: {
      id: {
        $ne: videoId,
      },
      category: {
        slug: {
          $eq: categorySlug,
        },
      },
    },
    pagination: {
      pageSize: 8,
    },
    fields: ['originalname', 'duration', 'aka', 'count', 'video_id'],
    populate: {
      poster2: {
        fields: ['url', 'width', 'height'],
      },
      category: {
        fields: ['name', 'slug'],
      },
    },
    ...options,
  };

  return fetchAPI<Video[]>('videos', defaultOptions);
}
export async function getCategoryVideos(
  categorySlug: string,
  options: QueryOptions = {}
): Promise<ApiResponse<Video[]>> {
  const defaultOptions: QueryOptions = {
    filters: {
      category: {
        name: {
          $eq: categorySlug,
        },
      },
    },
    pagination: {
      pageSize: 20,
      page: 1,
    },
    fields: ['originalname', 'duration', 'aka', 'count', 'video_id'],
    populate: {
      poster2: {
        fields: ['url', 'width', 'height'],
      },
      category: {
        fields: ['name', 'slug'],
      },
    },
    sort: ['createdAt:desc'],
    ...options,
  };

  return fetchAPI<Video[]>('videos', defaultOptions);
}
export async function getVideoData(identifier: string, options: QueryOptions = {}): Promise<Video> {
  // 视频ID格式检查保持不变
  const isVideoId = /^[0-9a-fA-F]{24}$/.test(identifier);

  async function queryVideo(filter: any): Promise<Video | null> {
    const queryOptions: QueryOptions = {
      filters: filter,
      populate: {
        poster2: {
          fields: ['url', 'width', 'height'],
        },
        category: {
          fields: ['name', 'slug'],
        },
        m3u8paths: {
          fields: ['*'],
        },
        screenshots: {
          fields: ['url'],
        },
      },
      ...options,
    };

    try {
      const response = await fetchAPI<ApiResponse<Video>>('videos', queryOptions);

      return response.data && Array.isArray(response.data) && response.data.length > 0
        ? response.data[0]
        : null;
    } catch (error) {
      return null;
    }
  }

  let video: Video | null = null;

  if (identifier) {
    // 首先尝试使用 aka 查询
    video = await queryVideo({ aka: { $eq: identifier } });
  }

  if (!video && isVideoId) {
    // 如果 aka 查询失败或者输入看起来像 video_id，尝试使用 video_id 查询
    video = await queryVideo({ video_id: { $eq: identifier } });
  }

  if (!video) {
    // 如果还是没有找到,尝试模糊匹配
    video = await queryVideo({ aka: { $regex: identifier, $options: 'i' } });
  }

  if (!video) {
    throw new Error('Video not found');
  }

  return video;
}
export async function getHomeVideos(categoryIds: number | number[]): Promise<Category[]> {
  const options: QueryOptions = {
    fields: ['name', 'slug'],
    populate: {
      videos: {
        fields: ['originalname', 'duration', 'aka'],
        populate: { poster2: { fields: ['url', 'width', 'height'] } },
        pagination: { page: 1, pageSize: 8 },
        sort: ['createdAt:desc'],
      },
    },
  };

  if (Array.isArray(categoryIds)) {
    const promises = categoryIds.map((id) => fetchAPI<Category>(`categories/${id}`, options));
    const results = await Promise.all(promises);

    return results.map((result) => result.data);
  } else {
    const result = await fetchAPI<Category>(`categories/${categoryIds}`, options);

    return [result.data];
  }
}
export async function getWebsiteCategories(websiteId: number = 2): Promise<number[]> {
  const response = await fetchAPI<Category[]>('categories', {
    filters: {
      websites: {
        id: {
          $eq: websiteId,
        },
      },
    },
    fields: ['id'],
  });

  return response.data.map((category: Category) => category.id);
}

export async function getSearchResults(
  query: string,
  categoryIds: number[],
  page: number = 1
): Promise<ApiResponse<Video[]>> {
  return fetchAPI<Video[]>('videos', {
    filters: {
      category: {
        id: {
          $in: categoryIds,
        },
      },
      $or: [{ originalname: { $containsi: query } }],
    },
    fields: ['originalname', 'duration'],
    populate: ['poster2', 'category'],
    sort: ['createdAt:desc'],
    pagination: {
      page,
      pageSize: 12,
    },
  });
}
