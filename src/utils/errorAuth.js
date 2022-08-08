// eslint-disable-next-line no-unused-vars
import React from 'react'

export default function errorAuth(action, authData) {
  if (!authData.token) {
    // toast.error('Para essa funcionalidade é necessário estar logado.')
    return true
  }
  action()
  return false
}
