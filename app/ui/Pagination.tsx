// app/components/Pagination.tsx
import Link from 'next/link';
import React from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  basePath: string;
}

export function Pagination({ totalPages, currentPage, basePath }: PaginationProps) {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex justify-center space-x-2 mt-4">
      {visiblePages.map((number, index) => (
        <React.Fragment key={index}>
          {number === '...' ? (
            <span className="px-3 py-1">...</span>
          ) : (
            <Link
              href={`${basePath}/${number === 1 ? '' : number}`}
              className={`px-3 py-1 rounded ${
                number === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {number}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const visiblePages = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    visiblePages.push(...[1, 2, 3, 4, 5, '...', totalPages]);
  } else if (currentPage >= totalPages - 3) {
    visiblePages.push(...[1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]);
  } else {
    visiblePages.push(...[1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]);
  }

  return visiblePages;
}