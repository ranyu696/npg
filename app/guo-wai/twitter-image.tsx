import { ImageResponse } from 'next/og'

export const alt =  `女仆阁视频网站 - 国外传媒视频库`
  
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {

  return new ImageResponse(
    (
      <div style={{ fontSize: 64, background: 'white', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div>女仆阁视频网站</div>
        <div style={{fontSize: 48}}>国外传媒视频库</div>
      </div>
    ),
    {
      ...size,
    }
  )
}