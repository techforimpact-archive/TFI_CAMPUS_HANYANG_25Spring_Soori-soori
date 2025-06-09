import { css, useTheme, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { Calendar, Setting, User } from '@/assets/svgs/svgs'
import { REPAIR_CATEGORIES } from '@/domain/models/models'
import { Header } from '@/presentation/components/components'

import { useRepairCreateViewModel } from './RepairCreatePageViewModel'

export const RepairCreatePageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <Container>
      <StickyTop theme={theme}>
        <Header title="전동보장구 정비사항 작성" onBack={viewModel.goBack} />
      </StickyTop>
      <MainContent>
        <BasicInfoSection />
        <RepairInfoSection />
      </MainContent>
      <CTAButtonContainer theme={theme}>
        <CTAButton
          onClick={viewModel.submitRepair}
          theme={theme}
          disabled={!viewModel.valid}
          aria-label="정비내역 저장하기"
          aria-disabled={!viewModel.valid}
        >
          정비내역 저장하기
        </CTAButton>
      </CTAButtonContainer>
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
      <RepairBillingPriceFormGroup />
    </SectionBox>
  )
})

const RepairTypeFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-type-title">수리 이유</FormLabel>
      <ButtonGroup role="radiogroup" aria-labelledby="repair-type-title">
        <SelectButton
          role="radio"
          aria-checked={viewModel.repairModel.type === 'accident'}
          selected={viewModel.repairModel.type === 'accident'}
          onClick={() => {
            viewModel.updateIsAccident(true)
          }}
          theme={theme}
        >
          사고로 인한 수리예요
        </SelectButton>
        <SelectButton
          role="radio"
          aria-checked={viewModel.repairModel.type === 'routine'}
          selected={viewModel.repairModel.type === 'routine'}
          onClick={() => {
            viewModel.updateIsAccident(false)
          }}
          theme={theme}
        >
          일상적인 수리예요
        </SelectButton>
      </ButtonGroup>
    </FormGroup>
  )
})

const RepairDateFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-date-title">점검일</FormLabel>
      <DateInputWrapper>
        <DateInput
          type="date"
          value={viewModel.dateInputFormatString(viewModel.repairModel.repairedAt)}
          onChange={(e) => {
            viewModel.updateRepairDate(e.target.value)
          }}
          theme={theme}
          aria-labelledby="repair-date-title"
        />
        <CalendarIconWrapper>
          <Calendar width={15} height={15} color={theme.colors.onSurfaceVariant} />
        </CalendarIconWrapper>
      </DateInputWrapper>
    </FormGroup>
  )
})

const RepairBillingPriceFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-billing-price-title">청구가격</FormLabel>
      <FormInput
        type="text"
        inputMode="numeric"
        value={viewModel.billingPriceInputFormatString(viewModel.repairModel.billingPrice)}
        onChange={(e) => {
          viewModel.updateBillingPrice(e.target.value)
        }}
        theme={theme}
        placeholder="청구가격(원)을 입력하세요"
        aria-labelledby="repair-billing-price-title"
      />
    </FormGroup>
  )
})

const RepairInfoSection = observer(() => {
  const theme = useTheme()

  return (
    <SectionBox>
      <SectionHeader theme={theme}>
        <IconContainer aria-hidden>
          <Setting width={15} height={15} color={theme.colors.onSurfaceVariant} />
        </IconContainer>
        <SectionTitle>수리정보</SectionTitle>
      </SectionHeader>
      <RepairCategoryFormGroup />
      <BatteryVoltageFormGroup />
      <EtcRepairPartsFormGroup />
      <RepairMemoFormGroup />
    </SectionBox>
  )
})

const RepairCategoryFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <FormGroup>
      <FormLabel id="repair-category-title">수리 항목</FormLabel>
      <CategoryGrid>
        {REPAIR_CATEGORIES.map((category) => (
          <CategoryButton
            key={category}
            selected={viewModel.categorySelected(category)}
            onClick={() => {
              viewModel.toggleCategory(category)
            }}
            role="checkbox"
            aria-checked={viewModel.categorySelected(category)}
            theme={theme}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryGrid>
    </FormGroup>
  )
})

const BatteryVoltageFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  if (!viewModel.hasBattery) return null

  return (
    <FormGroup>
      <FormInput
        type="number"
        value={viewModel.repairModel.batteryVoltage}
        onChange={(e) => {
          viewModel.updateBatteryVoltage(e.target.value)
        }}
        theme={theme}
        style={{
          backgroundColor: theme.colors.secondary,
          border: `0.8px solid ${theme.colors.primary}`,
        }}
        placeholder="배터리 전압을 입력해주세요"
        aria-label="배터리 전압을 입력해주세요"
      />
    </FormGroup>
  )
})

const EtcRepairPartsFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  if (!viewModel.hasEtc) return null

  return (
    <FormGroup>
      <FormInput
        type="text"
        value={viewModel.repairModel.etcRepairParts}
        onChange={(e) => {
          viewModel.updateEtcRepairParts(e.target.value)
        }}
        theme={theme}
        style={{
          backgroundColor: theme.colors.secondary,
          border: `0.8px solid ${theme.colors.primary}`,
        }}
        placeholder="기타 수리 부위를 입력해주세요"
        aria-label="기타 수리 부위를 입력해주세요"
      />
    </FormGroup>
  )
})

const RepairMemoFormGroup = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairCreateViewModel()

  return (
    <FormGroup>
      <TextArea
        placeholder="수리내역을 기록해주세요."
        value={viewModel.repairModel.memo}
        onChange={(e) => {
          viewModel.updateMemo(e.target.value)
        }}
        rows={5}
        theme={theme}
        aria-label="수리내역을 기록해주세요."
      />
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

const FormInput = styled.input`
  width: 100%;
  padding: 3px 12px;
  height: 42px;
  border: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
  border-radius: 6px;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}

  &::placeholder {
    color: ${({ theme }: { theme: Theme }) => theme.colors.onSurfaceVariant};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`

const SelectButton = styled.button`
  flex: 1;
  padding: 3px 12px;
  border-radius: 6px;
  border: 0.8px solid ${({ theme }: { theme: Theme; selected: boolean }) => theme.colors.primary};
  background-color: ${({ theme, selected }: { theme: Theme; selected: boolean }) =>
    selected ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, selected }: { theme: Theme; selected: boolean }) =>
    selected ? theme.colors.onSurface : theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
`

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 100px));
  gap: 10px;
  justify-content: center;
`

const CategoryButton = styled.button`
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
  cursor: pointer;
  transition: all 0.2s ease;
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
  border-radius: 6px;
  resize: none;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}

  &::placeholder {
    color: ${({ theme }: { theme: Theme }) => theme.colors.onSurfaceVariant};
  }
`

const CTAButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  padding: 12px 25px;
  z-index: 5;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.surfaceContainer};
  border-top: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
`

const CTAButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-color: ${({ theme, disabled }: { theme: Theme; disabled: boolean }) => {
    if (disabled) {
      return theme.colors.onSurfaceVariant
    } else {
      return theme.colors.primary
    }
  }};
  color: ${({ theme, disabled }: { theme: Theme; disabled?: boolean }) => {
    if (disabled) {
      return theme.colors.onSurface
    } else {
      return theme.colors.background
    }
  }};
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyLarge};
  `}
  transition: all 0.2s ease;

  &:disabled {
    cursor: not-allowed;
  }
`

const DateInputWrapper = styled.div`
  position: relative;
  width: 100%;
`

const DateInput = styled.input`
  width: 100%;
  padding: 3px 12px;
  height: 42px;
  border: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
  border-radius: 6px;
  position: relative;
  ${({ theme }) => css`
    ${theme.typography.bodySmall};
  `}
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  text-align: left;

  &::-webkit-calendar-picker-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    color: transparent;
    cursor: pointer;
  }

  &::placeholder {
    color: ${({ theme }: { theme: Theme }) => theme.colors.onSurfaceVariant};
  }
`

const CalendarIconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  bottom: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`
