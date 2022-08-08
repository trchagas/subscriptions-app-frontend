import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import DrawerNavigator from './DrawerNavigator'

import { useAuth } from '../hooks/AuthContext'

import Login from '../pages/Login'

const Stack = createStackNavigator()

function LoginStack() {
  return (
    <Stack.Navigator>
      {/* TODO: Sign In route */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: '#28a745',
          },
        }}
      />
    </Stack.Navigator>
  )
}

function RouteStack() {
  const { authData } = useAuth()

  return (
    <NavigationContainer>
      {authData?.role === 'foodwalker' ? <DrawerNavigator /> : <LoginStack />}
    </NavigationContainer>
  )
}

export default RouteStack
