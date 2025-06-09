import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'

import { SOORITheme } from '@/theme/soori_theme'

interface TabProps {
  activeTab: string
  setActiveTab: (tabId: string) => void
  tabs: { id: string; label: string }[]
}

export function Tabs({ activeTab, setActiveTab, tabs }: TabProps) {
  const theme = useTheme()

  const handleKeyNavigation = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex: number | null = null

    if (e.key === 'ArrowLeft') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
      e.preventDefault()
    } else if (e.key === 'Enter' || e.key === ' ') {
      setActiveTab(tabs[currentIndex].id)
      e.preventDefault()
    }

    if (newIndex !== null) {
      setActiveTab(tabs[newIndex].id)
      const newTabElement = document.getElementById(`tab-${tabs[newIndex].id}`)
      if (newTabElement) {
        newTabElement.focus()
      }
    }
  }

  return (
    <TabContainer theme={theme} role="tablist" aria-label="탭 전환">
      {tabs.map((tab, index) => (
        <Tab
          key={tab.id}
          active={activeTab === tab.id}
          onClick={() => {
            setActiveTab(tab.id)
          }}
          onKeyDown={(e) => {
            handleKeyNavigation(e, index)
          }}
          theme={theme}
          role="tab"
          tabIndex={0}
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          id={`tab-${tab.id}`}
        >
          {tab.label}
        </Tab>
      ))}
    </TabContainer>
  )
}

const TabContainer = styled.nav`
  display: flex;
  width: 100%;
  height: 38px;
  background-color: ${({ theme }: { theme: SOORITheme }) => theme.colors.background};
`

const Tab = styled.div<{ active: boolean; theme: SOORITheme }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => css`
    ${theme.typography.labelMedium};
  `}
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.onSurfaceVariant)};
  border-bottom: 0.8px solid ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.outline)};
  cursor: pointer;
  transition: all 0.2s ease;

  /* 기본 focus 상태에서는 outline 제거 */
  &:focus {
    outline: none;
  }

  /* 키보드 사용 시에만 focus 스타일 적용 */
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.tertiary};
  }
`
