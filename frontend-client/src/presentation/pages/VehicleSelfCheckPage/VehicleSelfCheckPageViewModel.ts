import { useQueryClient } from '@tanstack/react-query'
import { makeAutoObservable } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { SelfCheckModel } from '@/domain/models/models'
import { useSelfCheck, useLoading } from '@/presentation/hooks/hooks'

export enum TabId {
  SELF_CHECK = 'self_check',
  HISTORY = 'history',
}

interface TabItem {
  id: TabId
  label: string
}

const tabItems: TabItem[] = [
  { id: TabId.SELF_CHECK, label: '자가점검 하기' },
  { id: TabId.HISTORY, label: '자가점검 기록' },
]

interface SelfCheckItem {
  id: string
  field: keyof SelfCheckModel
  question: string
  answer: boolean | null
}

class VehicleSelfCheckStore {
  selfCheckItems: SelfCheckItem[] = []
  submitting = false
  error: Error | null = null
  activeTab: TabId = TabId.SELF_CHECK

  constructor() {
    makeAutoObservable(this)
    this.initializeSelfCheckItems()
  }

  get allItemsAnswered() {
    return this.selfCheckItems.every((item) => item.answer !== null)
  }

  setAnswer = (id: string, answer: boolean) => {
    const item = this.selfCheckItems.find((i) => i.id === id)
    if (item) {
      item.answer = answer
    }
  }

  changeTab = (tabId: TabId) => {
    this.activeTab = tabId
  }

  setSubmitting = (value: boolean) => {
    this.submitting = value
  }

  setError = (error: Error | null) => {
    this.error = error
  }

  reset = () => {
    this.selfCheckItems.forEach((item) => {
      item.answer = null
    })
    this.submitting = false
    this.error = null
  }

  initializeSelfCheckItems = () => {
    this.selfCheckItems = [
      {
        id: 'motorNoise',
        field: 'motorNoise',
        question: '구동 시 모터에서 시끄러운 소음이나 심한 진동이 있나요?',
        answer: null,
      },
      {
        id: 'abnormalSpeed',
        field: 'abnormalSpeed',
        question: '속도가 너무 느리거나 빠르게 느껴지나요?',
        answer: null,
      },
      {
        id: 'batteryBlinking',
        field: 'batteryBlinking',
        question: '계기판 및 손잡이의 배터리 표시가 깜빡이나요?',
        answer: null,
      },
      {
        id: 'chargingNotStart',
        field: 'chargingNotStart',
        question: '충전기를 연결해도 충전이 시작되지 않나요?',
        answer: null,
      },
      {
        id: 'breakDelay',
        field: 'breakDelay',
        question: '브레이크를 당겼을 때 즉시 멈추지 않나요?',
        answer: null,
      },
      {
        id: 'breakPadIssue',
        field: 'breakPadIssue',
        question: '브레이크 패드가 많이 닳아 얇아지거나 금이 가 있나요?',
        answer: null,
      },
      {
        id: 'tubePunctureFrequent',
        field: 'tubePunctureFrequent',
        question: '튜브에 자주 펑크가 나나요?',
        answer: null,
      },
      {
        id: 'tireWearFrequent',
        field: 'tireWearFrequent',
        question: '타이어가 심하게 닳아 자주 교체하나요?',
        answer: null,
      },
      {
        id: 'batteryDischargeFast',
        field: 'batteryDischargeFast',
        question: '완전히 충전해도 주행 중 배터리가 금방 닳나요?',
        answer: null,
      },
      {
        id: 'incompleteCharging',
        field: 'incompleteCharging',
        question: '하루 종일 충전해도 완전히 충전되지 않나요?',
        answer: null,
      },
      {
        id: 'seatUnstable',
        field: 'seatUnstable',
        question: '시트가 흔들리거나 고정이 풀려 있나요?',
        answer: null,
      },
      {
        id: 'seatCoverIssue',
        field: 'seatCoverIssue',
        question: '시트 커버에 찢어짐이나 손상이 있나요?',
        answer: null,
      },
      {
        id: 'footRestLoose',
        field: 'footRestLoose',
        question: '발걸이가 흔들리거나 이탈할 위험이 있나요?',
        answer: null,
      },
      {
        id: 'antislipWorn',
        field: 'antislipWorn',
        question: '미끄럼 방지 고무 패드가 많이 마모되었나요?',
        answer: null,
      },
      {
        id: 'frameNoise',
        field: 'frameNoise',
        question: '주행 중 프레임에서 삐걱거리거나 소리가 나나요?',
        answer: null,
      },
      {
        id: 'frameCrack',
        field: 'frameCrack',
        question: '프레임에 금이 가거나 휘어진 곳이 있나요?',
        answer: null,
      },
    ]
  }
}

const store = new VehicleSelfCheckStore()

export function useVehicleSelfCheckViewModel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loading, showLoading, hideLoading } = useLoading()

  const vehicleId = searchParams.get('vehicleId') ?? ''
  const { createSelfCheck, error: apiError, selfChecks } = useSelfCheck({ vehicleId })

  const goBack = () => {
    void navigate(buildRoute('REPAIRS', {}, { vehicleId: vehicleId }))
  }

  const queryClient = useQueryClient()

  const handleSaveSelfCheckResults = async () => {
    if (!vehicleId) {
      alert('차량 정보가 필요합니다')
      return
    }

    try {
      showLoading()
      const checkData: Record<string, boolean> = {}
      store.selfCheckItems.forEach((item) => {
        if (item.answer !== null) {
          checkData[item.field] = item.answer
        }
      })
      const selfCheckModel = new SelfCheckModel({
        ...checkData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await createSelfCheck(selfCheckModel)

      if (result) {
        alert('자가점검이 성공적으로 저장되었습니다')
        store.reset()

        store.changeTab(TabId.HISTORY)
        void queryClient.invalidateQueries({ queryKey: ['selfChecks', vehicleId] })
      } else if (apiError) {
        throw apiError
      }
    } catch {
      alert('자가점검 저장에 실패했습니다')
    } finally {
      hideLoading()
    }
  }

  return {
    ...store,
    vehicleId,
    allItemsAnswered: store.allItemsAnswered,
    selfCheckItems: store.selfCheckItems,
    setAnswer: store.setAnswer,
    reset: store.reset,
    saveSelfCheckResults: handleSaveSelfCheckResults,
    submitting: loading,
    goBack,
    activeTab: store.activeTab,
    changeTab: store.changeTab,
    selfChecks,
    tabItems,
  }
}
