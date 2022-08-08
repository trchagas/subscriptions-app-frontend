import React, { useCallback, useState, useContext, createContext } from 'react'
import api from '../services/api'

const UserContext = createContext({})

function UserProvider({ children }) {
  const [userData, setUserData] = useState({})

  const loadProfile = useCallback(async () => {
    const { data } = await api.get('/foodwalker/info')
    setUserData(data)
  }, [])

  return (
    <UserContext.Provider value={{ userData, loadProfile }}>
      {children}
    </UserContext.Provider>
  )
}

function useUserData() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('You must use useUserData inside an UserProvider')
  }

  return context
}

export { UserProvider, useUserData }
