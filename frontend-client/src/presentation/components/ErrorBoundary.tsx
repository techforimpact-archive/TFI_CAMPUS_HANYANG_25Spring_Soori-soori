import { useEffect, useMemo } from 'react'

import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { useRouteError, isRouteErrorResponse } from 'react-router'

import { Info } from '@/assets/svgs/svgs'
import { EventModel } from '@/domain/models/models'
import { EventCreateUseCase } from '@/domain/use_cases/use_cases'

export function ErrorBoundary() {
  const error = useRouteError()
  const theme = useTheme()
  const eventCreateUseCase = useMemo(() => new EventCreateUseCase(), [])

  useEffect(() => {
    let title = ''
    let description = ''
    if (isRouteErrorResponse(error)) {
      title = `Router 에러: ${error.status.toString()} ${error.statusText}`
      description = JSON.stringify(error.data)
    } else if (error instanceof Error) {
      title = `React 에러: ${error.message}`
      description = error.stack ?? ''
    } else {
      title = `알 수 없는 에러: ${String(error)}`
    }
    const event = new EventModel({ title, description, fatal: true })
    void eventCreateUseCase.call(event)
  }, [error, eventCreateUseCase])

  return (
    <Container>
      <Header>오류가 발생했습니다</Header>
      <Content>
        <IconWrapper theme={theme}>
          <Info width={40} height={40} color={theme.colors.error} />
        </IconWrapper>
        <Message theme={theme}>페이지를 표시하는 도중 오류가 발생했습니다.</Message>
        <Message theme={theme}>잠시 후 다시 시도해 주세요.</Message>
        <RetryButton
          theme={theme}
          onClick={() => {
            window.location.reload()
          }}
        >
          새로고침
        </RetryButton>
      </Content>
    </Container>
  )
}

const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
`
const Header = styled.h1`
  ${({ theme }) => css`
    ${theme.typography.titleLarge};
    color: ${theme.colors.onSurface};
    margin-bottom: 16px;
  `}
`
const Content = styled.div`
  max-width: 400px;
  width: 100%;
  text-align: center;
`
const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondary};
`
const Message = styled.p`
  ${({ theme }) => css`
    ${theme.typography.bodyMedium};
    color: ${theme.colors.onSurfaceVariant};
  `}
`
const RetryButton = styled.button`
  ${({ theme }) => css`
    ${theme.typography.labelMedium};
    background-color: ${theme.colors.primary};
    color: ${theme.colors.onSurface};
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    margin: 24px 0px;
  `}
`
