// src/providers/YandexMetrica.tsx
'use client';
import { Router } from 'next/router'
import { PropsWithChildren, useCallback, useEffect } from 'react'
import ym, { YMInitializer } from 'react-yandex-metrika'

// 检查是否为生产环境,并确保 NEXT_PUBLIC_YM_ID 环境变量已设置
export const enableYM = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_YM_ID

export const YandexMetrica = ({ children }: PropsWithChildren) => {
  // 定义一个函数,用于在 Yandex Metrica 中记录页面浏览事件
  const hit = useCallback((url: string) => {
    if (enableYM) {
      // 如果 enableYM 为 true,则使用 Yandex Metrica API 记录页面浏览事件
      ym('hit', url)
    } else {
      // 如果 enableYM 为 false,则在控制台输出日志
      console.log(`%c[YandexMetrika](HIT)`, `color: orange`, url)
    }
  }, [])

  useEffect(() => {
    // 在组件挂载时,记录初始页面浏览事件
    hit(window.location.pathname + window.location.search)

    // 监听路由变化事件,并在路由变化完成时记录新页面的浏览事件
    Router.events.on('routeChangeComplete', (url: string) => hit(url))
  }, [hit])

  return (
    <>
      {/* 如果 enableYM 为 true,则渲染 Yandex Metrica 初始化组件 */}
      {enableYM && (
        <YMInitializer accounts={[Number(process.env.NEXT_PUBLIC_YM_ID)]} options={{ defer: true }} version="2" />
      )}

      {/* 渲染子组件 */}
      {children}
    </>
  )
}