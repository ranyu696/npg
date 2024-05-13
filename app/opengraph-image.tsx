import { ImageResponse } from 'next/og'

export const alt = '女仆阁视频网站 - 海量高清视频免费观看'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          fontFamily: 'sans-serif',
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        女仆阁视频网站- 海量高清视频免费观看
      </div>
    ),
    {
      ...size,
    }
  )
}