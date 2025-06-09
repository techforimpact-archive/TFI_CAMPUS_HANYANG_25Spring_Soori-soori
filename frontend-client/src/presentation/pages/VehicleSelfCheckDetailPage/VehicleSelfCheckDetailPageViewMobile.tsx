import { css, useTheme, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { Info } from '@/assets/svgs/svgs'
import { Header } from '@/presentation/components/components'

import { useVehicleSelfCheckDetailViewModel } from './VehicleSelfCheckDetailPageViewModel'

export const VehicleSelfCheckDetailPageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useVehicleSelfCheckDetailViewModel()

  return (
    <Container>
      <Header title="자가점검 상세 내역" onBack={viewModel.goBack} />
      <MainContent>
        <DateSection>
          <DateLabel theme={theme}>점검 일시</DateLabel>
          <DateValue theme={theme}>{viewModel.selfCheck.createdAtDisplayString}</DateValue>
        </DateSection>
        <ResultSection>
          <ResultSummary theme={theme}>
            {(() => {
              if (viewModel.selfCheck.totalIssueCount > 0) {
                return (
                  <>
                    <ResultCount theme={theme}>{viewModel.selfCheck.totalIssueCount}</ResultCount>개 문제 발견
                  </>
                )
              }
              return <>발견된 문제가 없어요</>
            })()}
          </ResultSummary>
        </ResultSection>
        <CategoryList>
          {(() => {
            if (viewModel.selfCheck.totalIssueCount === 0) {
              return <NoIssueView />
            }
            return <IssueListView />
          })()}
        </CategoryList>
      </MainContent>
    </Container>
  )
})

const NoIssueView = observer(() => {
  const theme = useTheme()

  return (
    <NoIssueContainer>
      <NoIssueIcon theme={theme} aria-hidden>
        ✓
      </NoIssueIcon>
      <NoIssueText theme={theme}>점검 결과 문제가 발견되지 않았습니다.</NoIssueText>
      <NoIssueDescription theme={theme}>앞으로도 정기적인 자가점검을 통해</NoIssueDescription>
      <NoIssueDescription theme={theme}>안전하게 이용해 주세요.</NoIssueDescription>
    </NoIssueContainer>
  )
})

const IssueListView = observer(() => {
  const theme = useTheme()
  const viewModel = useVehicleSelfCheckDetailViewModel()

  return (
    <>
      {viewModel.categoryItems.map((category) => {
        if (category.issueCount > 0) {
          const categoryMaintenanceTip = viewModel.getCategoryMaintenanceTip(category.name)
          return (
            <>
              <CategorySection key={category.name}>
                <CategoryHeader>
                  <CategoryName theme={theme}>{category.name}</CategoryName>
                  <CategoryCount theme={theme}>{category.issueCount}개</CategoryCount>
                </CategoryHeader>
                <IssueList>
                  {category.issues.map((issue) => {
                    if (issue.hasIssue) {
                      return (
                        <IssueItem key={issue.field} theme={theme}>
                          {issue.description}
                        </IssueItem>
                      )
                    }
                  })}
                </IssueList>
              </CategorySection>
              {(() => {
                if (categoryMaintenanceTip) {
                  return (
                    <MaintenanceTipBox theme={theme}>
                      <TipHeader theme={theme}>
                        <IconWrapper theme={theme}>
                          <Info width={40} height={40} color={theme.colors.tertiary} />
                        </IconWrapper>
                        <TipTitle theme={theme}>관리 팁</TipTitle>
                      </TipHeader>
                      <TipContent theme={theme}>{categoryMaintenanceTip}</TipContent>
                    </MaintenanceTipBox>
                  )
                }
              })()}
            </>
          )
        }
      })}
    </>
  )
})

const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const MainContent = styled.section`
  flex: 1;
  padding-bottom: 40px;
`

const DateSection = styled.div`
  padding: 24px 20px 8px 20px;
`
const DateLabel = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.labelMedium};
    color: ${theme.colors.onSurfaceVariant};
  `}
  margin-bottom: 2px;
`
const DateValue = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyLarge};
  `}
`
const ResultSection = styled.div`
  padding: 0 20px 16px 20px;
`
const ResultSummary = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyLarge};
  `}
`
const ResultCount = styled.span`
  color: ${({ theme }: { theme: Theme }) => theme.colors.error};
  margin-right: 4px;
`
const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 16px;
`
const CategorySection = styled.section`
  border-radius: 10px;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.surfaceContainer};
  border: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
  margin-bottom: 0px;
  overflow: hidden;
`
const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 18px;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.secondary};
`
const CategoryName = styled.h3`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyMedium};
  `}
`
const CategoryCount = styled.span`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyMedium};
    color: ${theme.colors.primary};
  `}
`
const IssueList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`
const IssueItem = styled.li`
  padding: 13px 18px;
  border-top: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyMedium};
  `}

  &:before {
    content: '•';
    margin-right: 8px;
  }
`

const MaintenanceTipBox = styled.div`
  background: ${({ theme }: { theme: Theme }) => theme.colors.secondary};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const IconWrapper = styled.div`
  width: 15px;
  height: 15px;
  display: flex;
  margin-right: 4px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondary};
`

const TipTitle = styled.h4`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.labelMedium};
    color: ${theme.colors.tertiary};
  `}
`

const TipContent = styled.div`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodySmall};
    color: ${theme.colors.tertiary};
    word-break: keep-all;
  `}
`
const NoIssueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px 28px 20px;
  border-radius: 8px;
  border: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
  margin: 32px 0 0 0;
`
const NoIssueIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }: { theme: Theme }) => theme.colors.secondary};
  color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 24px;
`
const NoIssueText = styled.h3`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyLarge};
  `}
  margin-bottom: 12px;
`
const NoIssueDescription = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyMedium};
    color: ${theme.colors.onSurfaceVariant};
  `}
  text-align: center;
  margin: 0;
  margin-top: 2px;
  padding: 0 8px;
`
