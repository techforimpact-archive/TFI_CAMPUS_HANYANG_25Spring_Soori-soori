import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { createPortal } from 'react-dom'

import { SOORITheme } from '@/theme/theme'

export function ProgressIndicator() {
  return createPortal(
    <ProgressIndicatorContainer>
      <Indicator aria-label="로딩 중" role="status" />
    </ProgressIndicatorContainer>,
    document.body
  )
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const ProgressIndicatorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.4s ease-in-out;
  z-index: 9999;
`

const Indicator = styled.div`
  width: 45px;
  height: 45px;
  border: 5px solid ${SOORITheme.colors.outlineVariant};
  border-top: 5px solid ${SOORITheme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`
