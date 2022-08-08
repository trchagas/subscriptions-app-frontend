import React from 'react'
import { AuthProvider } from './AuthContext'
import { UserProvider } from './UserContext'
import { OrderProvider } from './OrderContext'
import { Provider } from 'react-native-paper'

function Providers({ children }) {
  return (
    <AuthProvider>
      <UserProvider>
        <OrderProvider>
          <Provider>{children}</Provider>
        </OrderProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default Providers
