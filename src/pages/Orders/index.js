import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { CommonActions, useIsFocused } from '@react-navigation/native'

import api from '../../services/api'

import Layout from '../../layouts/Default'

import { styles } from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import GenericModal from '../../components/GenericModal'

import OrderStatus from '../../utils/orderStatus'
import OrderStatusColor from '../../utils/orderStatusColor'
import { formatMoney } from '../../utils/format'
import { Checkbox } from 'react-native-paper'

import Filter from '../../assets/filter.jsx'
import Refresh from '../../assets/refresh.jsx'
import { errorApi } from '../../utils/errorApi'

function Orders({ route, navigation }) {
  const isFocused = useIsFocused()
  const [orders, setOrders] = useState([])
  const [showModal, setShowModal] = useState(false)

  const [filterWaiting, setFilterWaiting] = useState(true)
  const [filterPendent, setFilterPendent] = useState(true)
  const [filterConfirmed, setFilterConfirmed] = useState(true)
  const [filterCanceled, setFilterCanceled] = useState(false)
  const [filterCompleted, setFilterCompleted] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get(
        `/foodwalker/orders/filter?waiting=${filterWaiting}&pendent=${filterPendent}&confirmed=${filterConfirmed}&canceled=${filterCanceled}&completed=${filterCompleted}`,
      )

      for (const order of data) order.items = JSON.parse(order.items)

      setOrders(data)
    } catch (err) {
      console.error(err)
      alert(errorApi(err, 'Ocorreu um erro ao carregar os pedidos.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isFocused) loadData()
  }, [isFocused])

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <Layout>
      <View style={styles.view}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#9f9f9f" />
        ) : (
          <View style={{ width: '100%', height: '100%' }}>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(true)
                }}
                style={[styles.headerButton, styles.shadow]}
              >
                <Filter />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  loadData()
                }}
                style={[styles.headerButton, styles.shadow]}
              >
                <Refresh />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView}>
              <View style={styles.vstack} alignItems="center">
                {orders.map((order, index) => (
                  <View style={[styles.box, styles.shadow]} key={index}>
                    <View style={styles.hstack}>
                      <View
                        style={[
                          styles.col1,
                          { backgroundColor: OrderStatusColor[order.status] },
                        ]}
                      >
                        <Text>Status:</Text>
                        <Text style={styles.status}>
                          {OrderStatus[order.status]}
                        </Text>
                      </View>
                      <View style={styles.col2}>
                        <View>
                          {order.street &&
                          order.street_number &&
                          order.neighborhood ? (
                            <Text numberOfLines={1} style={styles.address}>
                              {order.street + ', ' + order.street_number}
                              {order.complement && ', ' + order.complement}
                            </Text>
                          ) : (
                            <Text style={styles.address}>
                              Sem endereço cadastrado
                            </Text>
                          )}
                          {order.spot && (
                            <Text numberOfLines={1} style={styles.address}>
                              {order.spot}
                            </Text>
                          )}
                          {order.items.length > 0 ? (
                            <View style={styles.items}>
                              {order.items
                                .filter((product) => product.amount !== 0)
                                .slice(0, 2)
                                .map((item, index) => (
                                  <View
                                    key={index}
                                    style={{
                                      flexDirection: 'row',
                                    }}
                                  >
                                    <View>
                                      <Text style={styles.items} key={index}>
                                        {item.name}{' '}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text style={styles.items}>
                                        x{item.amount}
                                      </Text>
                                    </View>
                                  </View>
                                ))}
                              {order.items.filter(
                                (product) => product.amount !== 0,
                              ).length > 2 && <Text>...</Text>}
                            </View>
                          ) : (
                            <Text style={styles.items}>
                              Nenhum item pré-selecionado
                            </Text>
                          )}
                        </View>
                        {order.items.length > 0 && (
                          <View>
                            <Text style={styles.total}>
                              Total:{' '}
                              {formatMoney(
                                order.items.reduce((current, item) => {
                                  return current + item.amount * item.value
                                }, 0),
                              )}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.col3}>
                        <TouchableOpacity>
                          <MaterialIcons
                            name="location-on"
                            size={30}
                            onPress={() => {
                              const resetAction = CommonActions.reset({
                                index: 0,
                                routes: [
                                  {
                                    name: 'Inicio',
                                    params: {
                                      coords: {
                                        latitude: order.latitude,
                                        longitude: order.longitude,
                                      },
                                    },
                                  },
                                ],
                              })
                              navigation.dispatch(resetAction)
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <MaterialIcons
                            name="visibility"
                            size={30}
                            onPress={() =>
                              navigation.navigate('Detalhes do Pedido', {
                                id: order.id,
                              })
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        <GenericModal
          title="Incluir Pedidos"
          label="Confirmar"
          show={showModal}
          action={() => {
            loadData()
            setShowModal(false)
          }}
          closeModal={handleCloseModal}
        >
          <View style={styles.checkItemGroup}>
            <View style={[styles.row, styles.checkItem]}>
              <Text style={styles.checkItemText}>Aguardando</Text>
              <Checkbox
                color="#28a745"
                status={filterWaiting ? 'checked' : 'unchecked'}
                onPress={() => {
                  setFilterWaiting(!filterWaiting)
                }}
              />
            </View>
            <View style={[styles.row, styles.checkItem]}>
              <Text style={styles.checkItemText}>Pendente</Text>
              <Checkbox
                color="#28a745"
                status={filterPendent ? 'checked' : 'unchecked'}
                onPress={() => {
                  setFilterPendent(!filterPendent)
                }}
              />
            </View>
            <View style={[styles.row, styles.checkItem]}>
              <Text style={styles.checkItemText}>Confirmados</Text>
              <Checkbox
                color="#28a745"
                status={filterConfirmed ? 'checked' : 'unchecked'}
                onPress={() => {
                  setFilterConfirmed(!filterConfirmed)
                }}
              />
            </View>
            <View style={[styles.row, styles.checkItem]}>
              <Text style={styles.checkItemText}>Cancelados</Text>
              <Checkbox
                color="#28a745"
                status={filterCanceled ? 'checked' : 'unchecked'}
                onPress={() => {
                  setFilterCanceled(!filterCanceled)
                }}
              />
            </View>
            <View style={[styles.row, styles.checkItem]}>
              <Text style={styles.checkItemText}>Finalizados</Text>
              <Checkbox
                color="#28a745"
                status={filterCompleted ? 'checked' : 'unchecked'}
                onPress={() => {
                  setFilterCompleted(!filterCompleted)
                }}
              />
            </View>
          </View>
        </GenericModal>
      </View>
    </Layout>
  )
}

export default Orders
