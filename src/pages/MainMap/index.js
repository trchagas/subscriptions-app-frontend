import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native'

import {
  LocationAccuracy,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchHeadingAsync,
  watchPositionAsync,
  startLocationUpdatesAsync,
  hasStartedLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from 'expo-location'
import MapView, { Marker, Circle } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { isTaskRegisteredAsync, defineTask } from 'expo-task-manager'

import { Audio } from 'expo-av'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

import Layout from '../../layouts/Default'

import { styles, orderCardStyles } from './styles'

import api from '../../services/api'

import LocationArrow from '../../assets/locationarrow.png'
import CurrentLocation from '../../assets/currentlocation.jsx'
import Close from '../../assets/close.jsx'
import Route from '../../assets/route.jsx'
import Ping from '../../assets/ping.mp3'

import { useOrderData } from '../../hooks/OrderContext'
import { useUserData } from '../../hooks/UserContext'
import { useAuth } from '../../hooks/AuthContext'

import TabBar from '../../components/TabBar'
import GenericModal from '../../components/GenericModal'

import MinToMinSec from '../../utils/minToMinSec'
import OrderStatusColor from '../../utils/orderStatusColor'
import OrderStatus from '../../utils/orderStatus'
import { formatMoney } from '../../utils/format'
import FoodWalkerStatus from '../../utils/foodWalkerStatus'
import { errorApi } from '../../utils/errorApi'

const BACKGROUND_FETCH_TASK = 'background-fetch-position-task'

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
defineTask(BACKGROUND_FETCH_TASK, async ({ data: { locations }, error }) => {
  if (error) {
    console.error(error)
    return
  }

  const now = Date.now()

  try {
    console.log(
      `Got background fetch call at date: ${new Date(now).toISOString()}`,
    )

    const [{ coords }] = locations
    const position = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    }
    await api.patch('foodwalker/update-position', position)
    // Be sure to return the successful result type!
    return true
  } catch (e) {
    console.error(e)
    return false
  }
})

function startTask() {
  // 2 start the task
  startLocationUpdatesAsync(BACKGROUND_FETCH_TASK, {
    accuracy: LocationAccuracy.Highest,
    distanceInterval: 5, // minimum change (in meters) betweens updates
    deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
    // foregroundService is how you get the task to be updated as often as would be if the app was open
    foregroundService: {
      notificationTitle: 'Utilizando sua localização',
      notificationBody: 'Para desativar, altere seu status para "inativo".',
    },
  })
}

function stopTask() {
  // 3 when you're done, stop it
  hasStartedLocationUpdatesAsync(BACKGROUND_FETCH_TASK).then((value) => {
    if (value) {
      stopLocationUpdatesAsync(BACKGROUND_FETCH_TASK)
    }
  })
}

function MainMap({ route, navigation }) {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyAfqczu7x3_zOGMgaI1Ipxjk4KIsuPtAdU'
  const { ignoredIds } = useOrderData()
  const { signOut } = useAuth()
  const { loadProfile, userData } = useUserData()

  const [granted, setGranted] = useState(null)
  const [sound, setSound] = useState(null)

  const [initialRegion, setInitialRegion] = useState({})
  const [currentRegion, setCurrentRegion] = useState({})
  const [previousRegion, setPreviousRegion] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [heading, setHeading] = useState(0)

  const [orders, setOrders] = useState([])
  const [orderList, setOrderList] = useState([])

  const [destination, setDestination] = useState(null)
  const [routeCoords, setRouteCoords] = useState(null)
  const routeRadius = 1500

  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)

  const [showModal, setShowModal] = useState(false)

  const ref = useRef(null)

  //useEffect que será executado apenas na inicialização:
  useEffect(() => {
    async function loadInitialPosition() {
      try {
        const permission = await requestForegroundPermissionsAsync()

        if (permission.granted) {
          setGranted(permission.granted)
          const { coords } = await getCurrentPositionAsync({
            accuracy: LocationAccuracy.Highest,
          })

          const { latitude, longitude } = coords

          setInitialRegion({
            latitude,
            longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          })
          setCurrentRegion({
            latitude,
            longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          })

          setIsLoading(false)
        } else {
          alert('Ative a localização para utilizar o mapa.')
        }

        loadData()
        loadProfile()
      } catch (err) {
        alert(errorApi(err, 'Ocorreu um erro ao carregar as informações.'))
        signOut()
        console.error(err)
      }
    }

    async function loadAudio() {
      const { sound } = await Audio.Sound.createAsync(Ping)
      setSound(sound)
    }

    loadAudio()
    loadInitialPosition()
  }, [])

  useEffect(async () => {
    const isRegistered = await isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)
    if (!granted && isRegistered) {
      stopTask()
      return
    }
    if (userData.status === 'inactive' && isRegistered) stopTask()
    else if (userData.status === 'active' && !isRegistered) startTask()
  }, [userData.status, granted])

  const handlePressOrder = (pressedOrder) => {
    let newOrderList = [pressedOrder]

    orders
      .filter((order) => order !== pressedOrder)
      .forEach((order) => {
        const R = 6371
        const x1 = order.latitude - pressedOrder.latitude
        const dLat = degrees_to_radians(x1)
        const x2 = order.longitude - pressedOrder.longitude
        const dLon = degrees_to_radians(x2)
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(degrees_to_radians(pressedOrder.latitude)) *
            Math.cos(degrees_to_radians(order.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const d = R * c
        if (d <= 0.1) {
          order.distanceFromOrigin = d
          newOrderList.push(order)
        }
      })

    for (const order of newOrderList)
      if (typeof order.items === 'string') order.items = JSON.parse(order.items)

    setOrderList(newOrderList)
  }

  const loadData = async () => {
    try {
      const { data } = await api.get('/foodwalker/orders')
      const filterData = data.filter((order) => !ignoredIds.includes(order.id))
      setOrders(filterData)
      return filterData
    } catch (err) {
      console.error(err)
      alert(errorApi(err, 'Ocorreu um erro ao carregar os pedidos.'))
      return []
    }
  }

  useEffect(() => {
    const filterData = orders.filter((order) => !ignoredIds.includes(order.id))
    setOrders(filterData)
  }, [ignoredIds])

  const [rendered, setRendered] = useState(false)
  useEffect(() => {
    if (!granted) return

    const interval = setInterval(async () => {
      try {
        const oldIds = orders.map((order) => order.id)
        const newOrders = await loadData()
        const newIds = newOrders.map((order) => order.id)

        if (sound && newIds.some((id) => oldIds.includes(id)))
          await sound.playAsync()

        if (
          previousRegion.latitude !== currentRegion.latitude ||
          previousRegion.longitude !== currentRegion.longitude
        ) {
          if (userData.status === 'active')
            await api.patch('foodwalker/update-position', currentRegion)
          setPreviousRegion(currentRegion)
        }
      } catch (err) {
        console.error(err)
        signOut()
        alert(errorApi(err, 'Ocorreu um erro ao atualizar as informações.'))
      } finally {
        setRendered(!rendered)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [granted, rendered])

  //useEffect que será executado a cada renderização:
  useEffect(() => {
    if (!granted) return

    let locationWatcher
    let headingWatcher

    async function startWatchingLocation() {
      try {
        locationWatcher = await watchPositionAsync(
          {
            accuracy: LocationAccuracy.Highest,
            distanceInterval: 1,
            timeInterval: 1000,
          },
          (coords) => {
            if (coords.coords.accuracy !== 0) {
              const { latitude, longitude } = coords.coords
              setCurrentRegion({
                latitude,
                longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              })
            }
          },
        )
      } catch (err) {
        console.error(err)
        alert(
          errorApi(
            err,
            'Ocorreu um erro ao carregar as informações de localização.',
          ),
        )
      }
    }

    async function startWatchingHeading() {
      try {
        headingWatcher = await watchHeadingAsync((head) => {
          if (head.accuracy !== 0) {
            setHeading(head.trueHeading)
          }
        })
      } catch (err) {
        console.error(err)
        alert(
          errorApi(
            err,
            'Ocorreu um erro ao carregar as informações de direcionamento.',
          ),
        )
      }
    }

    startWatchingLocation()
    startWatchingHeading()

    return () => {
      headingWatcher.remove()
      locationWatcher.remove()
    }
  }, [granted])

  const focusFunction = () => {
    function loadDirections() {
      if (route.params) {
        setDestination({
          latitude: route.params.coords.latitude,
          longitude: route.params.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        })
      }
    }

    loadDirections()
  }

  //useEffect para pedidos, que precisam ser atualizados com menos frequencia
  useEffect(() => {
    navigation.addListener('focus', focusFunction)
    return () => {
      navigation.removeListener('focus', focusFunction)
    }
  }, [navigation])

  function degrees_to_radians(degrees) {
    var pi = Math.PI
    return degrees * (pi / 180)
  }

  const handleResetPosition = async () => {
    try {
      const { coords } = await getCurrentPositionAsync({
        accuracy: LocationAccuracy.Highest,
      })

      const { latitude, longitude } = coords

      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      })

      ref.current.animateToRegion(initialRegion)
    } catch (err) {
      console.error(err)
      alert(
        errorApi(
          err,
          'Ocorreu um erro ao recarregar as informações de posição.',
        ),
      )
    }
  }

  const getFormattedDuration = (duration) => {
    const res = MinToMinSec(duration)
    if (res.min > 0) return res.min + 'min ' + res.sec + 's'
    return res.sec + 's'
  }

  const getFormattedDistance = (distance) => distance * 1000 + 'm'

  return (
    <Layout>
      {isLoading ? (
        <ActivityIndicator size="large" color="#d0d0d0" />
      ) : (
        <View style={styles.map}>
          <MapView
            initialRegion={initialRegion}
            style={{ flex: 2 }}
            ref={ref}
            followsUserLocation={destination && true}
          >
            {routeCoords && (
              <Circle
                center={currentRegion}
                radius={routeRadius}
                strokeColor="rgb(43,103, 237)"
                fillColor="rgba(43,103, 237,0.15)"
              />
            )}
            <Marker
              coordinate={currentRegion}
              rotation={heading}
              anchor={{ x: 0.5, y: 0.5 }}
              flat={true}
            >
              <Image
                source={LocationArrow}
                style={{
                  height: 35,
                  width: 35,
                }}
              />
            </Marker>
            {orders.map((order, index) => (
              <Marker
                coordinate={{
                  latitude: order.latitude,
                  longitude: order.longitude,
                  latitudeDelta: 0.04,
                  longitudeDelta: 0.04,
                }}
                pinColor={OrderStatusColor[order.status]}
                onPress={() => {
                  handlePressOrder(order)
                  setShowModal(true)
                }}
                key={index}
              />
            ))}
            {destination && (
              <MapViewDirections
                origin={currentRegion}
                destination={destination}
                apikey={GOOGLE_MAPS_APIKEY}
                mode={'BICYCLING'}
                strokeWidth={3}
                strokeColor="blue"
                lineDashPattern={[10]}
                onReady={(result) => {
                  setDuration(result.duration)
                  setDistance(result.distance)
                }}
              />
            )}
          </MapView>
          {duration && distance && (
            <View style={[styles.distance, styles.shadow]}>
              <View style={styles.center}>
                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name={'map-marker-distance'}
                    color="#000"
                    size={30}
                  />
                  <Text style={styles.displayText}>
                    {getFormattedDistance(distance)}
                  </Text>
                </View>
                <View style={[styles.row, styles.marginTop]}>
                  <MaterialCommunityIcons
                    name={'timer-outline'}
                    color="#000"
                    size={30}
                  />
                  <Text style={styles.displayText}>
                    {getFormattedDuration(duration)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {destination && (
            <TouchableOpacity
              style={[styles.button, styles.close, styles.shadow]}
              onPress={() => {
                route.params = null
                setDestination(null)
                setDistance(null)
                setDuration(null)
              }}
            >
              <Close />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.setRoute, styles.shadow]}
            onPress={() => {
              if (routeCoords) setRouteCoords(false)
              else setRouteCoords(true)
            }}
          >
            <Route />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.resetPosition, styles.shadow]}
            onPress={handleResetPosition}
          >
            <CurrentLocation />
          </TouchableOpacity>

          <View style={styles.status}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginTop: 2,
                backgroundColor: FoodWalkerStatus[userData?.status]?.['color'],
              }}
            ></View>
            <Text style={styles.statusText}>
              {' '}
              {FoodWalkerStatus[userData?.status]?.['label']}
            </Text>
          </View>

          <GenericModal
            title="Pedidos nesta área"
            showConfirm={false}
            show={showModal}
            closeModal={() => setShowModal(false)}
          >
            <ScrollView style={{ width: '100%' }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {orderList.map((order) => (
                  <View
                    style={[
                      orderCardStyles.card,
                      orderCardStyles.shadow,
                      { marginBottom: 30 },
                    ]}
                    key={order.id}
                  >
                    <View
                      style={[
                        orderCardStyles.col1,
                        { backgroundColor: OrderStatusColor[order.status] },
                      ]}
                    >
                      <Text>Status:</Text>
                      <Text style={orderCardStyles.bold}>
                        {OrderStatus[order.status]}
                      </Text>
                    </View>
                    <View style={orderCardStyles.col2}>
                      <View>
                        {order.street &&
                        order.street_number &&
                        order.neighborhood ? (
                          <Text
                            numberOfLines={1}
                            style={[
                              orderCardStyles.address,
                              orderCardStyles.bold,
                            ]}
                          >
                            {order.street + ', ' + order.street_number}
                            {order.complement && ', ' + order.complement}
                          </Text>
                        ) : (
                          <Text style={orderCardStyles.address}>
                            Sem endereço cadastrado
                          </Text>
                        )}
                        {order.spot && (
                          <Text numberOfLines={1} style={styles.address}>
                            {order.spot}
                          </Text>
                        )}
                        {order.items.length ? (
                          <View style={orderCardStyles.items}>
                            {order.items
                              .filter((product) => product.amount !== 0)
                              .slice(0, 2)
                              .map((item, index) => (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                  }}
                                  key={item.id}
                                >
                                  <View>
                                    <Text
                                      style={orderCardStyles.items}
                                      key={index}
                                    >
                                      {item.name}{' '}
                                    </Text>
                                  </View>
                                  <View>
                                    <Text style={orderCardStyles.items}>
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
                          <Text style={orderCardStyles.items}>
                            Nenhum item pré-selecionado
                          </Text>
                        )}
                      </View>
                      {order.items.length ? (
                        <View>
                          <Text
                            style={[
                              orderCardStyles.total,
                              orderCardStyles.bold,
                            ]}
                          >
                            Total:{' '}
                            {formatMoney(
                              order.items
                                .map((item) => item.value * item.amount)
                                .reduce((current, next) => {
                                  return current + next
                                }, 0),
                            )}
                          </Text>
                        </View>
                      ) : (
                        <View></View>
                      )}
                    </View>
                    <View style={orderCardStyles.col3}>
                      <TouchableOpacity>
                        <MaterialIcons
                          name="location-on"
                          size={30}
                          onPress={() => {
                            setDestination({
                              latitude: order.latitude,
                              longitude: order.longitude,
                              latitudeDelta: 0.04,
                              longitudeDelta: 0.04,
                            })
                            setShowModal(false)
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <MaterialIcons
                          name="visibility"
                          size={30}
                          onPress={() => {
                            navigation.navigate('Detalhes do Pedido', {
                              id: order.id,
                            })
                            setShowModal(false)
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </GenericModal>
        </View>
      )}
      <TabBar navigation={navigation} />
    </Layout>
  )
}

export default MainMap
