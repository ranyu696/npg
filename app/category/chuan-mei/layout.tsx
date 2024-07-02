import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';

import CategoryTabs from '@/components/CategoryTabs';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

async function getCategories() {
  const res = await fetch(
    `http://127.0.0.1:1337/api/categories/48?populate=subcategories.*`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch category data');
  }

  const data = await res.json();

  return data.data;
}

async function getWebsiteInfo() {
  const res = await fetch(
    'http://127.0.0.1:1337/api/websites/2?fields[0]=name&fields[1]=imageURL&populate[seo][fields][0]=canonicalURL',
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch website data');
  }

  const data = await res.json();

  return data.data.attributes;
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const [category, websiteInfo] = await Promise.all([
    getCategories(),
    getWebsiteInfo(),
  ]);
  const currentSubcategory = category.attributes.subcategories.data.find(
    (sub: any) => sub.attributes.slug === params.slug
  );

  const title = currentSubcategory
    ? `${currentSubcategory.attributes.name} - ${category.attributes.name}`
    : `${category.attributes.name}`;

  const description = currentSubcategory
    ? `浏览 ${currentSubcategory.attributes.name} 分类下的视频 - ${category.attributes.name} | ${websiteInfo.name}`
    : `探索 ${category.attributes.name} 分类下的所有视频 | ${websiteInfo.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${websiteInfo.seo.canonicalURL}/category/${category.attributes.slug}`,
      siteName: websiteInfo.name,
      locale: 'zh_CN',
      type: 'website',
    },
    alternates: {
      canonical: `${websiteInfo.seo.canonicalURL}/category/${category.attributes.slug}`,
    },
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const [category, websiteInfo] = await Promise.all([
    getCategories(),
    getWebsiteInfo(),
  ]);

  const currentSubcategory = category.attributes.subcategories.data.find(
    (sub: any) => sub.attributes.slug === params.slug
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: currentSubcategory
      ? currentSubcategory.attributes.name
      : category.attributes.name,
    description: currentSubcategory
      ? `浏览 ${currentSubcategory.attributes.name} 分类下的视频 - ${category.attributes.name}`
      : `探索 ${category.attributes.name} 分类下的所有视频`,
    url: `${websiteInfo.seo.canonicalURL}/category/${category.attributes.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: websiteInfo.name,
      url: websiteInfo.seo.canonicalURL,
    },
  };

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id="jsonld-category"
        type="application/ld+json"
      />
      <section className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/6 mb-4 md:mb-0 order-first md:order-none">
          <CategoryTabs category={category} />
        </div>
        <div className="w-full md:w-5/6 md:pl-4 order-last md:order-none">
          {children}
        </div>
      </section>
    </>
  );
}
