import { createContext, ReactNode } from 'react'

import { FirebaseApp } from 'firebase/app'
import { Auth } from 'firebase/auth'

import { app, auth } from '../configurations/configurations'

interface FirebaseContext {
  app: FirebaseApp
  auth: Auth
}

const FirebaseContext = createContext<FirebaseContext | null>(null)

interface FirebaseProviderProps {
  children: ReactNode
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  return <FirebaseContext.Provider value={{ app, auth }}>{children}</FirebaseContext.Provider>
}
