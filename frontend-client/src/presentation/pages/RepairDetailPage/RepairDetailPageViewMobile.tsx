import { css, useTheme, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { Setting, User } from '@/assets/svgs/svgs'
import { REPAIR_CATEGORIES } from '@/domain/models/repair_model'
import { Header } from '@/presentation/components/Header'

import { useRepairDetailViewModel } from './RepairDetailPageViewModel'

export const RepairDetailPageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  if (!viewModel.repairModel) {
    return <></>
  }

  return (
    <Container>
      <StickyTop theme={theme}>
        <Header title="전동보장구 정비이력 확인" description={viewModel.repairModel.id} onBack={viewModel.goBack} />
      </StickyTop>
      <MainContent>
        <BasicInfoSection />
        <RepairInfoSection />
      </MainContent>
    </Container>
  )
})

const BasicInfoSection = observer(() => {
  const theme = useTheme()

  return (
    <SectionBox>
      <SectionHeader theme={theme}>
        <IconContainer aria-hidden>
          <User width={15} height={15} color={theme.colors.onSurfaceVariant} />
        </IconContainer>
        <SectionTitle>기본정보</SectionTitle>
      </SectionHeader>
      <RepairTypeFormGroup />
      <RepairDateFormGroup />
      <RepairStationFormGroup />
      <RepairerFormGroup />
      <RepairBillingPriceFormGroup />
    </SectionBox>
  )
})

const RepairTypeFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  if (!viewModel.repairModel) return null

  return (
    <FormGroup>
      <FormLabel id="repair-type-title">수리 이유</FormLabel>
      <ButtonGroup role="radiogroup" aria-labelledby="repair-type-title">
        <ReadonlySelectButton selected={viewModel.repairModel.isAccident} theme={theme}>
          사고로 인한 수리예요
        </ReadonlySelectButton>
        <ReadonlySelectButton selected={!viewModel.repairModel.isAccident} theme={theme}>
          일상적인 수리예요
        </ReadonlySelectButton>
      </ButtonGroup>
    </FormGroup>
  )
})

const RepairDateFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-date-title">점검일</FormLabel>
      <ReadonlyValue theme={theme} aria-labelledby="repair-date-title">
        {viewModel.repairModel?.repairedAtDisplayString}
      </ReadonlyValue>
    </FormGroup>
  )
})

const RepairStationFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-station-title">담당기관</FormLabel>
      <ReadonlyValue theme={theme} aria-labelledby="repair-station-title">
        {viewModel.repairModel?.repairStationLabel}
      </ReadonlyValue>
    </FormGroup>
  )
})

const RepairerFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-repairer-title">담당수리자</FormLabel>
      <ReadonlyValue theme={theme} aria-labelledby="repair-repairer-title">
        {viewModel.repairModel?.repairer}
      </ReadonlyValue>
    </FormGroup>
  )
})

const RepairBillingPriceFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-billing-price-title">청구가격</FormLabel>
      <ReadonlyValue theme={theme} aria-labelledby="repair-billing-price-title">
        {viewModel.billingPriceDisplayString}
      </ReadonlyValue>
    </FormGroup>
  )
})

const RepairInfoSection = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  return (
    <SectionBox>
      <SectionHeader theme={theme}>
        <IconContainer aria-hidden>
          <Setting width={15} height={15} color={theme.colors.onSurfaceVariant} />
        </IconContainer>
        <SectionTitle>수리정보</SectionTitle>
      </SectionHeader>
      <RepairCategoryFormGroup />
      {(() => {
        if (viewModel.repairModel?.batteryVoltage) {
          return <BatteryVoltageFormGroup />
        }
      })()}
      {(() => {
        if (viewModel.repairModel?.etcRepairParts) {
          return <EtcRepairPartsFormGroup />
        }
      })()}
      {(() => {
        if (viewModel.repairModel?.memo) {
          return <RepairMemoFormGroup />
        }
      })()}
    </SectionBox>
  )
})

const RepairCategoryFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-category-title">수리 항목</FormLabel>
      <CategoryGrid>
        {REPAIR_CATEGORIES.map((category) => (
          <CategoryBadge
            key={category}
            selected={viewModel.repairModel!.repairCategories.includes(category)}
            theme={theme}
          >
            {category}
          </CategoryBadge>
        ))}
      </CategoryGrid>
    </FormGroup>
  )
})

const BatteryVoltageFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  return (
    <FormGroup aria-label="배터리 전압">
      <ReadonlyValue theme={theme}>{viewModel.repairModel?.batteryVoltage}</ReadonlyValue>
    </FormGroup>
  )
})

const EtcRepairPartsFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  return (
    <FormGroup aria-label="기타 수리 부위">
      <ReadonlyValue theme={theme}>{viewModel.repairModel?.etcRepairParts}</ReadonlyValue>
    </FormGroup>
  )
})

const RepairMemoFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairDetailViewModel()

  return (
    <FormGroup aria-label="수리 사항">
      <ReadonlyTextArea value={viewModel.repairModel?.memo} readOnly rows={5} theme={theme} aria-readonly="true" />
    </FormGroup>
  )
})

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px; /* 하단 버튼 높이만큼 패딩 추가 */
`

const StickyTop = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.background};
`

const MainContent = styled.main`
  flex: 1;
  padding: 15px 16px;
  padding-bottom: 80px; /* 하단 버튼 높이만큼 패딩 추가 */
`

const SectionBox = styled.div`
  margin-bottom: 40px;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  gap: 8px;
  padding: 7px 13px;
  border-radius: 12px;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.outlineVariant};
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const SectionTitle = styled.h2`
  ${({ theme }) => css`
    ${theme.typography.bodyMedium};
  `}
`

const FormGroup = styled.div`
  padding: 0 11px;
  margin-bottom: 13px;
`

const FormLabel = styled.label`
  display: block;
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
`

const ReadonlyValue = styled.div`
  width: 100%;
  padding: 12px;
  height: 42px;
  display: flex;
  align-items: center;
  border: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.primary};
  border-radius: 6px;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.secondary};
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
`

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 100px));
  gap: 10px;
  justify-content: center;
`

const CategoryBadge = styled.div`
  flex: 1;
  padding: 3px 12px;
  border-radius: 6px;
  border: 0.8px solid ${({ theme }: { theme: Theme; selected: boolean }) => theme.colors.outline};
  background-color: ${({ theme, selected }: { theme: Theme; selected: boolean }) => {
    if (selected) {
      return theme.colors.primary
    } else {
      return theme.colors.background
    }
  }};
  color: ${({ theme, selected }: { theme: Theme; selected: boolean }) => {
    if (selected) {
      return theme.colors.onSurface
    } else {
      return theme.colors.onSurfaceVariant
    }
  }};
  transition: all 0.2s ease;
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
`

const ReadonlyTextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.primary};
  border-radius: 6px;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.secondary};
  resize: none;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  cursor: default;

  &:focus {
    outline: none;
    border-color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`

const ReadonlySelectButton = styled.button`
  flex: 1;
  padding: 3px 12px;
  border-radius: 6px;
  border: 0.8px solid
    ${({ theme, selected }: { theme: Theme; selected: boolean }) =>
      selected ? theme.colors.primary : theme.colors.outline};
  background-color: ${({ theme, selected }: { theme: Theme; selected: boolean }) =>
    selected ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, selected }: { theme: Theme; selected: boolean }) =>
    selected ? theme.colors.onSurface : theme.colors.onSurfaceVariant};
  cursor: default;
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
`
