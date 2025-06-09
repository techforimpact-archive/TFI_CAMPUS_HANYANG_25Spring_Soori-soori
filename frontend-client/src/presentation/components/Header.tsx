import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'

import { ChevronLeft } from '@/assets/svgs/svgs'
import { SOORITheme } from '@/theme/soori_theme'

interface HeaderProps {
  title: string
  description?: string
  onBack?: () => void
}

export function Header({ title, description, onBack }: HeaderProps) {
  const theme = useTheme()
  const hasDescription = !!description
  const hasBackButton = !!onBack

  return (
    <HeaderContainer theme={theme} role="banner">
      <HeaderRow theme={theme} hasDescription={hasDescription} hasBackButton={hasBackButton}>
        {(() => {
          if (onBack) {
            return <BackButton theme={theme} onClick={onBack} />
          }
          return null
        })()}
        <HeaderText hasDescription={hasDescription} hasBackButton={hasBackButton}>
          <HeaderTitle theme={theme}>{title}</HeaderTitle>
          {(() => {
            if (description) {
              return <HeaderDescription theme={theme}>{description}</HeaderDescription>
            }
            return null
          })()}
        </HeaderText>
        {(() => {
          if (onBack) {
            return <InvisibleSpaceBox aria-hidden />
          }
          return null
        })()}
      </HeaderRow>
    </HeaderContainer>
  )
}

interface BackButtonProps {
  theme: SOORITheme
  onClick: () => void
}

export const BackButton = ({ theme, onClick }: BackButtonProps) => {
  return (
    <BackButtonWrapper
      onClick={onClick}
      aria-label="뒤로 가기"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick()
          e.preventDefault()
        }
      }}
    >
      <ChevronLeft width={20} height={20} color={theme.colors.onSurface} aria-hidden />
    </BackButtonWrapper>
  )
}

const HeaderContainer = styled.header`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  padding: 20px 16px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.primary};
`

const HeaderRow = styled.div<{ hasDescription: boolean; hasBackButton: boolean }>`
  display: flex;
  align-items: center;
  gap: 0 18px;
  width: 100%;
  justify-content: ${({ hasDescription, hasBackButton }) => {
    if (!hasDescription && hasBackButton) {
      return 'space-between'
    } else if (!hasDescription && !hasBackButton) {
      return 'center'
    }
    return 'flex-start'
  }};
`

const HeaderText = styled.div<{ hasDescription: boolean; hasBackButton: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ hasDescription, hasBackButton }) => {
    if (!hasDescription && hasBackButton) {
      return `
        text-align: center;
      `
    }
    if (!hasDescription && !hasBackButton) {
      return `
        text-align: center;
      `
    }
    return ''
  }}
`

const HeaderTitle = styled.h1`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.subtitleLarge};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurface};
`

const HeaderDescription = styled.p`
  ${({ theme }: { theme: SOORITheme }) => css`
    ${theme.typography.labelSmall};
  `}
  color: ${({ theme }: { theme: SOORITheme }) => theme.colors.onSurface};
`

const BackButtonWrapper = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`

const InvisibleSpaceBox = styled.div`
  width: 32px;
  height: 32px;
  visibility: hidden;
`
