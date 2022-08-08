import React from 'react'
import AppProviders from './src/hooks'
import Routes from './src/routes'
import { StatusBar } from 'react-native'

function App() {
  return (
    <AppProviders>
      <StatusBar barStyle="light-content" backgroundColor="#28a745" />
      <Routes />
    </AppProviders>
  )
}

export default App
