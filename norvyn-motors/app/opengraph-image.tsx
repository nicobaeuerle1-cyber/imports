import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Norvyn Motors — Premium Fahrzeugimport aus Asien'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, "Times New Roman", serif',
          position: 'relative',
        }}
      >
        {/* Top gold line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#c9a96e' }} />

        {/* Subtle ambient glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(201,169,110,0.06) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* NORVYN wordmark */}
        <div
          style={{
            fontSize: 100,
            fontWeight: 400,
            color: '#f0ede8',
            letterSpacing: '0.18em',
            marginBottom: 12,
            lineHeight: 1,
          }}
        >
          NORVYN
        </div>

        {/* MOTORS with lines */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 52,
          }}
        >
          <div style={{ width: 90, height: 1, background: '#c9a96e' }} />
          <div
            style={{
              fontSize: 16,
              letterSpacing: '0.45em',
              color: '#c9a96e',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontWeight: 300,
            }}
          >
            MOTORS
          </div>
          <div style={{ width: 90, height: 1, background: '#c9a96e' }} />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 16,
            color: '#6b6560',
            letterSpacing: '0.25em',
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontWeight: 300,
          }}
        >
          PREMIUM FAHRZEUGIMPORT · ASIEN → DEUTSCHLAND
        </div>

        {/* Bottom gold line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#c9a96e' }} />
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
