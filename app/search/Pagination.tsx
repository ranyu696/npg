'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Pagination } from '@nextui-org/pagination';

interface PaginationComponentProps {
  basePath: string;
  query: string;
  pageNumber: number;
  totalPages: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  basePath,
  query,
  pageNumber,
  totalPages,
}) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const searchParams = new URLSearchParams({
      q: query,
      page: page.toString(),
    });
    router.push(`${basePath}?${searchParams.toString()}`);
  };

  return (
    <Pagination
      color="warning"
      page={pageNumber}
      total={totalPages}
      onChange={handlePageChange}
    />
  );
};

export default PaginationComponent;