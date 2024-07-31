'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { FaBookmark } from 'react-icons/fa';

interface FavoriteButtonProps {
  userAgent: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ userAgent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
    };

    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkMobile);
      }
    };
  }, [userAgent]);

  const getBookmarkInstructions = useCallback(() => {
    if (isMobile) {
      if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return '点击底部的分享图标，然后选择"添加到主屏幕"选项。';
      } else if (/Android/i.test(userAgent)) {
        return '点击浏览器菜单中的星形图标，或者选择"添加到主屏幕"选项。';
      } else {
        return '使用您的浏览器菜单中的"添加书签"或"收藏"选项。';
      }
    } else {
      const isMac = /Macintosh|MacIntel|MacPPC|Mac68K|Mac OS X/.test(userAgent);

      return `按 ${isMac ? 'Command+D' : 'Ctrl+D'} 键，或使用浏览器菜单添加书签。`;
    }
  }, [isMobile, userAgent]);

  return (
    <>
      <Button isIconOnly color="primary" onClick={handleOpen}>
        <FaBookmark />
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          <ModalHeader>添加到收藏夹</ModalHeader>
          <ModalBody>
            <p>{getBookmarkInstructions()}</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose}>了解</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FavoriteButton;
