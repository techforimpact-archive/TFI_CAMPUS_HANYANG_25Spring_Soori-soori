import { createContext, useState, ReactNode, useRef, useCallback } from 'react'

const MIN_LOADING_TIME = 500

interface LoadingContextProps {
  loading: boolean
  showLoading: () => void
  hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextProps | null>(null)

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false)
  const loadingStartTime = useRef<number | null>(null)
  const hideLoadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showLoading = useCallback(() => {
    if (hideLoadingTimeoutRef.current) {
      clearTimeout(hideLoadingTimeoutRef.current)
      hideLoadingTimeoutRef.current = null
    }

    loadingStartTime.current = Date.now()
    setLoading(true)
  }, [])

  const hideLoading = useCallback(() => {
    const startTime = loadingStartTime.current
    const currentTime = Date.now()

    if (startTime === null || currentTime - startTime >= MIN_LOADING_TIME) {
      setLoading(false)
      loadingStartTime.current = null
    } else {
      const remainingTime = MIN_LOADING_TIME - (currentTime - startTime)
      hideLoadingTimeoutRef.current = setTimeout(() => {
        setLoading(false)
        loadingStartTime.current = null
        hideLoadingTimeoutRef.current = null
      }, remainingTime)
    }
  }, [])

  return <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>{children}</LoadingContext.Provider>
}

export { LoadingContext }
