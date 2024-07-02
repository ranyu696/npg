'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from '@nextui-org/tabs';
import { Select, SelectItem } from '@nextui-org/select';
import { useRouter, usePathname } from 'next/navigation';

interface Subcategory {
  id: number;
  attributes: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
    subcategories: {
      data: Subcategory[];
    };
  };
}

interface CategoryTabsProps {
  category: Category;
}

export default function CategoryTabs({ category }: CategoryTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleChange = (value: string) => {
    router.push(`/category/${category.attributes.slug}/${value}`);
  };

  const currentSlug = pathname.split('/').pop();

  if (isMobile) {
    return (
      <Select
        className="w-full mb-4"
        items={category.attributes.subcategories.data}
        label="选择分类"
        placeholder="选择一个分类"
        selectedKeys={[currentSlug || '']}
        onSelectionChange={(keys) =>
          handleChange(Array.from(keys)[0] as string)
        }
      >
        {(subcategory) => (
          <SelectItem
            key={subcategory.attributes.slug}
            value={subcategory.attributes.slug}
          >
            {subcategory.attributes.name}
          </SelectItem>
        )}
      </Select>
    );
  }

  return (
    <Tabs
      aria-label="Category tabs"
      className="w-full"
      placement="start"
      selectedKey={currentSlug}
      onSelectionChange={(key) => handleChange(key as string)}
    >
      {category.attributes.subcategories.data.map(
        (subcategory: Subcategory) => (
          <Tab
            key={subcategory.attributes.slug}
            title={subcategory.attributes.name}
          />
        )
      )}
    </Tabs>
  );
}
