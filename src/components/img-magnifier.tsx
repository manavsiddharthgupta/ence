import Image from 'next/image'
import { useState } from 'react'

export const ImageMagnifier = ({
  blobUrl,
  width,
  height,
  magnifierHeight = 100,
  magnifieWidth = 100,
  zoomLevel = 1.5
}: {
  blobUrl: string

  width?: string
  height?: string
  magnifierHeight?: number
  magnifieWidth?: number
  zoomLevel?: number
}) => {
  const [[x, y], setXY] = useState([0, 0])
  const [[imgWidth, imgHeight], setSize] = useState([0, 0])
  const [showMagnifier, setShowMagnifier] = useState(false)
  return (
    <div
      className='border rounded-lg dark:border-zinc-700 border-zinc-200 overflow-scroll'
      style={{
        position: 'relative',
        width: width,
        height: height
      }}
    >
      <Image
        src={blobUrl}
        blurDataURL={blobUrl}
        width='0'
        height='0'
        sizes='100vw'
        style={{ width: width, height: 'auto' }}
        alt='alt'
        onMouseEnter={(e) => {
          const elem = e.currentTarget
          const { width, height } = elem.getBoundingClientRect()
          setSize([width, height])
          setShowMagnifier(true)
        }}
        onMouseMove={(e) => {
          const elem = e.currentTarget
          const { top, left } = elem.getBoundingClientRect()
          const x = e.pageX - left - window.scrollX
          const y = e.pageY - top - window.scrollY
          setXY([x, y])
        }}
        onMouseLeave={() => {
          setShowMagnifier(false)
        }}
        placeholder='blur'
      />
      <div
        style={{
          display: showMagnifier ? '' : 'none',
          borderRadius: '100px',
          position: 'absolute',
          pointerEvents: 'none',
          height: `${magnifierHeight}px`,
          width: `${magnifieWidth}px`,
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifieWidth / 2}px`,
          opacity: '1',
          border: '1px solid lightgray',
          backgroundColor: 'white',
          backgroundImage: `url('${blobUrl}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${imgWidth * zoomLevel}px ${
            imgHeight * zoomLevel
          }px`,
          backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`
        }}
      ></div>
    </div>
  )
}
