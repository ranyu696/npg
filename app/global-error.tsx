'use client';

import React from 'react';

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {}, [error]);

  return (
    <html lang="zh-CN">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
          <h1 className="text-4xl font-bold text-red-700 mb-4">严重错误</h1>
          <p className="text-gray-700 mb-8">抱歉，应用程序遇到了严重问题。</p>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={reset}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
