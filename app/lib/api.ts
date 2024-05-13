// lib/api.ts
import { NextResponse } from 'next/server';
const API_BASE_URL = process.env.API_HOST;
const API_KEY = process.env.API_KEY;

type OrderType = 'countDesc' | 'countAsc' | 'createAsc' | 'createDesc';

interface Content {
  _id: string;
  originalname: string;
  category: string;
  categoryObj: {
    title: string;
  };
}

async function fetchData(url: string ) {
  const headers = new Headers();
  if (API_KEY) {
    headers.append('token', API_KEY);
  }
  const res = await fetch(url, {
    headers,
    next: { revalidate: 36000 }, // 设置重新验证间隔为 1 小时
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return res.json();
}

// 获取内容列表
export async function fetchContents(
  param: 'category' | 'tag' | 'q',
  value: string,
  type: string = 'movie,tv',
  page: number = 1,
  size: number = 10,
  order: OrderType = 'createDesc'
) {
  const url = `${API_BASE_URL}/api2/getcontents?${param}=${encodeURIComponent(value)}&type=${type}&page=${page}&size=${size}&order=${order}`;
  return fetchData(url);
}

// 获取视频播放信息
export async function fetchVideoById(id: string) {
  const url = `${API_BASE_URL}/api2/getvideo/${id}`;
  return fetchData(url);
}

// 搜索视频
export async function searchVideos(
  query: string,
  page: number = 1,
  size: number = 10,
  type: string = 'movie,tv'
) {
  const url = `${API_BASE_URL}/api2/getcontents?q=${encodeURIComponent(query)}&page=${page}&size=${size}&type=${type}`;
  return fetchData(url);
}

// 获取视频数量
export async function fetchContentCounts(
  param: 'category' | 'tag' | 'q',
  value: string,
  type: string = 'movie,tv'
) {
  const url = `${API_BASE_URL}/api2/contentcounts?${param}=${encodeURIComponent(value)}&type=${type}`;
  return fetchData(url);
}