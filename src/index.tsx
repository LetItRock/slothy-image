import * as React from 'react'
import { render } from 'react-dom'
import styled, { createGlobalStyle } from 'styled-components'
import { Image } from './Image'

const Holder = styled.div``

const GlobalStyles = createGlobalStyle`
  body {
    width: 100vw;
    height: 100vh;
    margin: 0;
  }
  #root {
    width: 100%;
    height: 100%;
  }
`

function App() {
  return (
    <>
      <GlobalStyles />
      <Holder>
        <div style={{ height: '1000px', background: 'tomato' }} />
        <div
          style={{
            width: '500px',
            height: '50vh',
          }}
        >
          <Image
            placeholder={{ src: 'auto_placeholder.jpg' }}
            image={{
              src: 'auto.jpg',
              srcSet: 'auto.webp',
              type: 'image/webp',
              alt: 'car',
              media: '(min-width: 600px)',
              srcBase64: null,
            }}
          />
        </div>
        <div style={{ height: '1000px', background: 'tomato' }} />
      </Holder>
    </>
  )
}

const rootElement = document.getElementById('root')
render(<App />, rootElement)
