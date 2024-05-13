import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          color: 'black',
          background: '#f5f5f5',
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <svg width="180" height="180" viewBox="0 0 24 24">
          <path fill="black" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm5-11l-6 4-6-4v-2l6 4 6-4v2z"/>
        </svg>
        <div style={{ marginTop: 40, fontSize: 60, fontWeight: 700 }}>
        女仆阁视频网站 - 海量高清视频免费观看
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}