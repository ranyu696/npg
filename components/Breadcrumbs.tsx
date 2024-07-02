'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/breadcrumbs';

const ClientBreadcrumbs: React.FC = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter((path) => path);
    let breadcrumbs = [{ href: '/', label: '首页' }];

    paths.forEach((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`;

      breadcrumbs.push({
        href,
        label: path.charAt(0).toUpperCase() + path.slice(1),
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumbs size="lg" variant="solid">
      {breadcrumbs.map((crumb, index) => (
        <BreadcrumbItem key={crumb.href}>
          {index === breadcrumbs.length - 1 ? (
            crumb.label
          ) : (
            <Link href={crumb.href}>{crumb.label}</Link>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default ClientBreadcrumbs;
