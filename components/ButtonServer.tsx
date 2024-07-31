// ButtonServer.tsx
'use client';
import { Button } from '@nextui-org/button';
import React from 'react';
import { FcRatings } from 'react-icons/fc';

const ButtonServer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('网址已复制到剪切板！'); // 显示用户反馈
    } catch (err) {
      //console.error('Failed to copy: ', err); // 处理错误情况
    }
  };

  return (
    <Button color="success" endContent={<FcRatings />} onClick={handleClick}>
      {children}
    </Button>
  );
};

export default ButtonServer;
