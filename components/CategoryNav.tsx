'use client';

import Link from 'next/link';
import { Button } from '@nextui-org/button';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';

interface Category {
  id: number;
  attributes: {
    slug: string;
    name: string;
  };
}

interface CategoryNavProps {
  categories: Category[];
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories }) => {
  const repeatedCategories = [...categories, ...categories]; // 复制导航项的内容
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: ['0%', '-100%'],
      transition: { duration: 30, repeat: Infinity, ease: 'linear' },
    });
  }, [controls]);

  const handleMouseEnter = () => {
    controls.stop();
  };

  const handleMouseLeave = () => {
    controls.start({
      x: ['0%', '-100%'],
      transition: { duration: 30, repeat: Infinity, ease: 'linear' },
    });
  };

  return (
    <nav className="w-full max-w-7xl overflow-x-hidden pb-2 mb-8">
      <motion.div
        animate={controls}
        className="flex space-x-4"
        style={{ display: 'flex', width: '200%' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {repeatedCategories.map((category, index) => (
          <div key={`${category.id}-${index}`} className="flex-shrink-0">
            <Link href={`/category/${category.attributes.slug}`}>
              <motion.div className="flex flex-col items-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-900 transition-colors">
                <Button className="text-sm font-medium" variant="ghost">
                  {category.attributes.name}
                </Button>
              </motion.div>
            </Link>
          </div>
        ))}
      </motion.div>
    </nav>
  );
};

export default CategoryNav;
