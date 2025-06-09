import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { repairStationRepositorySoori } from '@/data/services/services'
import { RepairStationModel } from '@/domain/models/repair_station_model'

import { useAuthState } from './useAuthState'
import { useLoading } from './useLoading'

export interface StationUI {
  id: string
  name: string
  district: string
  distance: number
}

export function getDistance(p1: { lat: number; lon: number }, p2: { lat: number; lon: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371 // Earth radius in km
  const dLat = toRad(p2.lat - p1.lat)
  const dLon = toRad(p2.lon - p1.lon)
  const lat1 = toRad(p1.lat)
  const lat2 = toRad(p2.lat)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function useRepairStations() {
  const { user, loading: authLoading } = useAuthState()
  const { showLoading, hideLoading } = useLoading()

  const query = useQuery<StationUI[]>({
    queryKey: ['repairStations'],
    queryFn: async () => {
      if (!user) throw new Error('로그인 후 이용 가능합니다.')

      const token = await user.getIdToken()
      const rawStations = await repairStationRepositorySoori.getRepairStations(token)

      let position: GeolocationPosition | null = null
      try {
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
      } catch {
        // location access denied or error, distances will be 0
      }

      return rawStations.map((raw) => {
        const model = new RepairStationModel(raw)
        const distance = position
          ? getDistance(
              { lat: position.coords.latitude, lon: position.coords.longitude },
              { lat: model.coordinate[1], lon: model.coordinate[0] }
            )
          : 0
        const name = model.label
        const district = model.region
        return {
          id: model.id,
          name,
          district,
          distance,
        }
      })
    },
    enabled: !authLoading,
  })

  useEffect(() => {
    if (query.isLoading) showLoading()
    else hideLoading()
  }, [query.isLoading, showLoading, hideLoading])

  useEffect(() => {
    if (query.error) throw query.error
  }, [query.error])

  return query
}
