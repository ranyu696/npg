'use client';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP':
        // 处理 First Contentful Paint 指标
        break;
      case 'LCP':
        // 处理 Largest Contentful Paint 指标
        break;
      case 'CLS':
        // 处理 Cumulative Layout Shift 指标
        break;
      case 'FID':
        // 处理 First Input Delay 指标
        break;
      case 'TTFB':
        // 处理 Time to First Byte 指标
        break;
      case 'INP':
        // 处理 Interaction to Next Paint 指标
        break;
    }
  });

  return null;
}