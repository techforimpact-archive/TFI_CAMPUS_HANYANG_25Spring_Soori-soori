import { css, useTheme, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { Link as LinkIcon } from '@/assets/svgs/svgs'
import { Header } from '@/presentation/components/components'

import { SortType, useRepairStationsViewModel } from './RepairStationsPageViewModel'

export const RepairStationsPageViewMobile = observer(() => {
  const theme = useTheme()
  const viewModel = useRepairStationsViewModel()

  return (
    <Container>
      <StickyTop theme={theme}>
        <Header title="전동보장구 정비소" onBack={viewModel.goBack} />
      </StickyTop>
      <SortFilterContainer>
        <SortChip
          onClick={() => {
            viewModel.setSortType(SortType.DEFAULT)
          }}
          selected={viewModel.sortType === SortType.DEFAULT}
          theme={theme}
        >
          기본순
        </SortChip>
        <SortChip
          onClick={() => {
            viewModel.setSortType(SortType.DISTANCE)
          }}
          selected={viewModel.sortType === SortType.DISTANCE}
          theme={theme}
        >
          거리순
        </SortChip>
      </SortFilterContainer>
      <MainContent>
        <RepairStationListSection />
      </MainContent>
    </Container>
  )
})

function RepairStationListSection() {
  const theme = useTheme()
  const viewModel = useRepairStationsViewModel()
  return (
    <RepairStationList aria-label="정비소 목록">
      {viewModel.sortedRepairStations.map((repairStation) => {
        const query = encodeURIComponent(repairStation.name + ' ' + repairStation.district)
        return (
          <RepairStationItem
            key={repairStation.id}
            theme={theme}
            href={`https://map.naver.com/p/search/${query}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <RepairStationName theme={theme}>{repairStation.name}</RepairStationName>
            <RepairStationInfoContainer>
              <RepairStationDistrict theme={theme}>
                {viewModel.getRepairStationInfoText(repairStation)}
              </RepairStationDistrict>
              <LinkIconContainer>
                <LinkIcon color={theme.colors.primary} aria-hidden />
              </LinkIconContainer>
            </RepairStationInfoContainer>
          </RepairStationItem>
        )
      })}
    </RepairStationList>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
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
`

const SortFilterContainer = styled.div`
  display: flex;
  padding: 7px 11px;
  gap: 10px;
  border-bottom: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
`

const SortChip = styled.button`
  width: 67px;
  padding: 1.5px 3px;
  border-radius: 12px;
  border: 0.8px solid
    ${({ theme, selected }: { theme: Theme; selected: boolean }) => {
      if (selected) {
        return theme.colors.primary
      } else {
        return theme.colors.outline
      }
    }};
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
      return theme.colors.primary
    }
  }};
  transition: all 0.2s ease;
  ${({ theme }) => css`
    ${theme.typography.labelSmall};
  `}
`

const RepairStationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const RepairStationItem = styled.a`
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  border-bottom: 0.8px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
`

const RepairStationName = styled.p`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
`

const RepairStationInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const RepairStationDistrict = styled.span`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyMedium};
  `}
  color: ${({ theme }: { theme: Theme }) => theme.colors.onSurfaceVariant};
  font-weight: 300;
`

const LinkIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
