import React, {
  useCallback,
  useState,
  useContext,
  createContext,
  useEffect,
} from 'react'
import api from '../services/api'
import Roles from '../utils/roles'
import AsyncStorage from '@react-native-async-storage/async-storage'

const USER_TOKEN = '@foodinthestreet:token'
const ROLE_TOKEN = '@foodinthestreet:role'

const AuthContext = createContext({})

function AuthProvider({ children }) {
  const [authData, setAuthData] = useState({})

  useEffect(() => {
    async function loadData() {
      const token = await AsyncStorage.getItem(USER_TOKEN)
      const role = await AsyncStorage.getItem(ROLE_TOKEN)
      if (role && token) {
        api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`
        setAuthData({
          token: JSON.parse(token),
          role,
        })
      } else setAuthData({})
    }

    loadData()
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    try {
      const response = await api.post('/sessions', {
        email: email.trim(),
        password,
      })

      const { token } = response.data.auth
      const role = response.data.roles[0]

      if (role !== 'foodwalker')
        throw new Error('Permissões de usuário negadas.')

      api.defaults.headers.authorization = `Bearer ${token}`
      const userData = {
        token: JSON.stringify(token),
        role,
      }

      setAuthData(userData)
      await AsyncStorage.setItem(USER_TOKEN, userData.token)
      await AsyncStorage.setItem(ROLE_TOKEN, userData.role)

      return `${Roles[role]}/lista`
    } catch (e) {
      console.log(e)
      throw new Error('Falha ao realizar login')
    }
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.clear()
    api.defaults.headers.authorization = undefined
    setAuthData({})
    //toast.info("Até breve!");
  }, [])

  return (
    <AuthContext.Provider value={{ authData, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('You must use useAuth inside an AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
