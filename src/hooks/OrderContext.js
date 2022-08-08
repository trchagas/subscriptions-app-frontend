import React, {
  useCallback,
  useState,
  useContext,
  createContext,
  useEffect,
} from 'react'
import api from '../services/api'

const OrderContext = createContext({})

function OrderProvider({ children }) {
  const [ignoredIds, setIgnoredIds] = useState([])

  const pushId = useCallback(
    async (id) => {
      if (ignoredIds.includes(id)) return
      const newIds = [...ignoredIds]
      newIds.push(id)
      setIgnoredIds(newIds)
    },
    [ignoredIds],
  )

  const removeId = useCallback(
    async (id) => {
      if (!ignoredIds.includes(id)) return
      const newIds = ignoredIds.filter((current) => current !== id)
      setIgnoredIds(newIds)
    },
    [ignoredIds],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const newIds = [...ignoredIds]
      newIds.shift()
      setIgnoredIds(newIds)
    }, 300000)
    if (ignoredIds.length === 0) clearInterval(interval)

    return () => {
      clearInterval(interval)
    }
  }, [ignoredIds])

  return (
    <OrderContext.Provider value={{ ignoredIds, pushId, removeId }}>
      {children}
    </OrderContext.Provider>
  )
}

function useOrderData() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('You must use useOrderData inside an OrderProvider')
  }

  return context
}

export { OrderProvider, useOrderData }
