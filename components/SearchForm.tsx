'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@nextui-org/input';
import { Kbd } from '@nextui-org/kbd';

import { SearchIcon } from '@/components/icons';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/search/${encodeURIComponent(searchTerm)}`);
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={['command']}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="搜索视频..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );

  return <form onSubmit={handleSearch}>{searchInput}</form>;
};

export default SearchForm;
