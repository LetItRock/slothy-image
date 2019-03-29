import * as React from 'react'
import styled, { keyframes, css } from 'styled-components'

const ImageHolder = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`
const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e2e2;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
`
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;

  ${({ show }) =>
    show &&
    css`
      animation: ${fadeIn} 1s ease;
    `};
`
const Placeholder = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  opacity: ${({ hide }) => (hide ? 0 : 1)};
`

type IntersectionCallback = (el: HTMLElement) => void
const listeners = new WeakMap<HTMLElement, IntersectionCallback>()

let intersectionObserver
const getIntersectionObserver = () => {
  if (!intersectionObserver && IntersectionObserver) {
    const options = {
      rootMargin: '100px',
    }
    intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement
        const cb = listeners.get(el)
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          listeners.delete(el)
          observer.unobserve(el)
          cb && cb(el)
        }
      })
    }, options)
  }
  return intersectionObserver
}

const addToIntersectionObserver = (
  el: HTMLElement,
  cb: IntersectionCallback,
) => {
  const io = getIntersectionObserver()
  if (io) {
    io.observe(el)
    listeners.set(el, cb)
  } else {
    cb(el)
  }
}

const removeFromIntersectionObserver = (el: HTMLElement) => {
  const io = getIntersectionObserver()
  if (io) {
    io.unobserve(el)
    listeners.delete(el)
  }
}

interface ImageConfig {
  src: string
  srcSet?: string
  media?: string
  type?: string
  style?: any
  [key: string]: any
}
interface PlaceholderConfig {
  src: string
  style?: any
  [key: string]: any
}
interface ImageProps {
  image: ImageConfig
  placeholder: PlaceholderConfig
}
export function Image({ placeholder, image }: ImageProps) {
  const {
    src: placeholderSrc,
    style: placeholderStyles,
    ...placeholderProps
  } = placeholder
  const { src, srcSet, media, type, style: imageStyle, ...imageProps } = image
  const imgRef = React.useRef()
  const [imageVisible, setVisible] = React.useState(false)
  const [hidePlaceholder, setHidePlaceholder] = React.useState(false)

  React.useEffect(() => {
    if (imgRef.current) {
      addToIntersectionObserver(imgRef.current, () => setVisible(true))
    }
    return () => {
      removeFromIntersectionObserver(imgRef.current)
    }
  }, [])

  const handleRefChange = ref => {
    if (!ref) return

    addToIntersectionObserver(ref, () => {
      setVisible(true)
      removeFromIntersectionObserver(ref)
    })
  }

  return (
    <ImageHolder ref={handleRefChange}>
      <Background isVisible={!imageVisible && !placeholderSrc} />
      {placeholderSrc && (
        <Placeholder
          hide={hidePlaceholder}
          src={placeholderSrc}
          style={{ ...placeholderStyles }}
          {...placeholderProps}
        />
      )}
      {imageVisible && (
        <picture>
          {srcSet && <source type={type} media={media} srcSet={srcSet} />}
          <Img
            ref={imgRef}
            src={src}
            show={hidePlaceholder}
            style={{ ...imageStyle }}
            onLoad={() => setHidePlaceholder(true)}
            {...imageProps}
          />
        </picture>
      )}
    </ImageHolder>
  )
}
