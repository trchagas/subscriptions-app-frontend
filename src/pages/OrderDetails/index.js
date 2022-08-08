import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useIsFocused, CommonActions } from '@react-navigation/native'
import { Table, Row } from 'react-native-table-component'
import { Rating } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'

import { parseISO, format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'

import Layout from '../../layouts/Default'

import api from '../../services/api'

import { useOrderData } from '../../hooks/OrderContext'

import { styles, buttonStyles } from './styles'
import DefaultProfile from '../../assets/DefaultProfile.png'

import { PaymentMethods } from '../../utils/paymentMethods'
import { formatMoney } from '../../utils/format'
import { Money, Pix, Balance, Card } from '../../utils/paymentMethods'

import GenericModal from '../../components/GenericModal'

import Edit from '../../assets/edit'
import { errorApi } from '../../utils/errorApi'

function OrderDetails({ route, navigation }) {
  const isFocused = useIsFocused()
  const { pushId, removeId } = useOrderData()
  const [isLoading, setIsLoading] = useState(true)

  // const [accepted, setAccepted] = useState(false)
  const [order, setOrder] = useState({})
  const [customer, setCustomer] = useState(null)

  const [total, setTotal] = useState(0)

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [payment, setPayment] = useState(null)

  const handleCloseCancelModal = () => {
    setShowCancelModal(false)
  }

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false)
  }

  const handleCloseCompleteModal = () => {
    setShowCompleteModal(false)
  }

  const handleChangePayment = async () => {
    try {
      const newOrder = { ...order }
      await api.patch(`/foodwalker/orders/${route.params.id}`, { payment })
      newOrder.payment = payment
      setOrder(newOrder)
      setShowPaymentModal(false)
      setPayment(null)
    } catch (e) {
      console.error(e)
      alert(errorApi(e, 'Ocorreu um erro ao editar o pedido.'))
    }
  }

  const handleCancelOrder = async () => {
    try {
      if (order.status === 'pendent') {
        await api.patch(`/foodwalker/orders/${route.params.id}/cancel`)

        navigation.reset({
          index: 0,
          routes: [{ name: 'Inicio' }, { name: 'Pedidos' }],
        })
      } else {
        pushId(route.params.id)
        navigation.popToTop()
      }
      setShowCancelModal(false)
    } catch (e) {
      console.error(e)
      alert(errorApi(e, 'Ocorreu um erro ao cancelar o pedido.'))
    }
  }

  const handleConfirmOrder = async () => {
    try {
      const newOrder = { ...order }
      if (order.status === 'waiting') {
        removeId(route.params.id)
        await api.patch(`/foodwalker/orders/${route.params.id}/accept`)
      } else
        await api.patch(`/foodwalker/orders/${route.params.id}`, {
          status: 'confirmed',
        })
      newOrder.status = 'confirmed'
      setOrder(newOrder)
      setShowConfirmModal(false)
    } catch (e) {
      console.error(e)
      alert(errorApi(e, 'Ocorreu um erro ao confirmar o pedido.'))
    }
  }
  const handleCompleteOrder = async () => {
    try {
      const { data } = await api.patch(
        `/foodwalker/orders/${route.params.id}/complete`,
      )

      navigation.reset({
        index: 0,
        routes: [
          { name: 'Inicio' },
          { name: 'Pedido Concluído', params: { customer, order: data } },
        ],
      })
    } catch (e) {
      alert(errorApi(e, 'Ocorreu um erro ao completar o pedido.'))
      setShowCompleteModal(false)
      console.error(e)
    }
  }

  useEffect(() => {
    if (order)
      setTotal(
        order.items?.reduce(
          (current, item) => current + parseInt(item.amount) * item.value,
          0,
        ),
      )
  }, [order])

  useEffect(() => {
    async function loadOrderData() {
      try {
        const { data } = await api.get(`/foodwalker/orders/${route.params.id}`)
        data.items = JSON.parse(data.items)
        setCustomer(data.customer)
        delete data.customer
        setOrder(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (isFocused) loadOrderData()
  }, [isFocused])

  return (
    <Layout>
      <View style={styles.view}>
        {!isLoading && (
          <>
            <View style={styles.card}>
              <View style={styles.spaceBetween}>
                <View>
                  <View style={styles.title}>
                    <View>
                      <Text style={styles.header}>Cliente:</Text>
                      {customer ? (
                        <View style={styles.userCard}>
                          <View>
                            <Image
                              source={
                                customer.profile_picture
                                  ? { uri: customer.profile_picture }
                                  : DefaultProfile
                              }
                              style={[styles.profilePicture]}
                            />
                          </View>
                          <View style={styles.userCardCol2}>
                            <Text style={styles.userName}>{customer.name}</Text>
                            <View style={styles.customerReview}>
                              <Rating
                                fractions={20}
                                ratingCount={5}
                                startingValue={customer.rating}
                                readonly
                                imageSize={30}
                                showRating={false}
                              />
                              <Text style={styles.reviewCounterText}>
                                ({customer.rating_count})
                              </Text>
                            </View>
                            <Text>
                              {format(
                                parseISO(order.updated_at),
                                'dd/MM/yyyy - HH:mm',
                                {
                                  locale: pt,
                                },
                              )}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.nullCustomer}>
                          <Text style={styles.nullCustomerTxt}>
                            Nenhum cliente selecionado
                          </Text>
                        </View>
                      )}
                    </View>

                    <TouchableOpacity style={styles.h1}>
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
                  </View>

                  <Text style={styles.h2}>Endereço:</Text>
                  {order.street && order.street_number && order.neighborhood ? (
                    <Text style={[styles.addressDetails, styles.marginBottom]}>
                      <Text>
                        {order.street} {'\n'}
                      </Text>
                      <Text>
                        {order.neighborhood} {'\n'}
                      </Text>
                      <Text>Número: {order.street_number}</Text>
                      {order.complement && <Text>, Sala 401</Text>}
                      <Text>
                        {'\n'}
                        CEP: {order.cep ? order.cep : 'Não informado'}
                      </Text>
                      {order.spot && (
                        <Text>
                          {'\n'}
                          {order.spot}
                        </Text>
                      )}
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 18, marginVertical: 10 }}>
                      Este pedido não possui um endereço cadastrado. Utilize o
                      botão de localizar.
                    </Text>
                  )}

                  <View style={styles.orderItemsTitle}>
                    <Text style={styles.h2}>Itens do pedido:</Text>
                    {order.status === 'confirmed' && (
                      <TouchableOpacity
                        style={buttonStyles.editButton}
                        onPress={() =>
                          order.status === 'confirmed'
                            ? navigation.navigate('Editar Pedido', {
                                id: order.id,
                                items: order.items,
                              })
                            : alert(
                                'O pedido precisa ser confirmado para que possa ser editado.',
                              )
                        }
                      >
                        <Edit />
                      </TouchableOpacity>
                    )}
                  </View>

                  {order.items.length > 0 ? (
                    <Table style={styles.table}>
                      <Row
                        data={['Nome', 'Valor', 'Quantia', 'Subtotal']}
                        textStyle={styles.bold}
                      />
                      {order.items
                        .filter((product) => product.amount !== 0)
                        .map((item, index) => (
                          <Row
                            key={index}
                            data={[
                              item.name,
                              formatMoney(item.value),
                              item.amount,
                              formatMoney(item.value * item.amount),
                            ]}
                          />
                        ))}
                    </Table>
                  ) : (
                    <Text style={{ fontSize: 18, marginTop: 10 }}>
                      Este pedido não contém nenhum item pré-selecionado.
                    </Text>
                  )}
                </View>
                <View>
                  {order.items.length > 0 ? (
                    <Text style={[styles.total]}>
                      Total: {formatMoney(total)}
                      {((order.payment === 'balance' &&
                        order.status === 'confirmed') ||
                        order.status === 'pendent') && (
                        <Text
                          style={{
                            color:
                              customer.balance - total >= 0
                                ? '#28a745'
                                : '#dc3545',
                          }}
                        >
                          {' '}
                          ({formatMoney(customer.balance - total)})
                        </Text>
                      )}
                    </Text>
                  ) : (
                    <></>
                  )}

                  <View style={styles.paymentMethodContainer}>
                    <Text style={styles.paymentMethodHeader}>
                      Forma de pagamento:
                    </Text>
                    <View style={styles.paymentMethod}>
                      <Image
                        source={PaymentMethods[order.payment].icon}
                        style={[styles.paymentMethodIcon]}
                      />
                      <Text style={styles.paymentMethodText}>
                        {PaymentMethods[order.payment].label}
                      </Text>
                    </View>
                    {order.status === 'confirmed' ? (
                      <TouchableOpacity
                        style={buttonStyles.editButton}
                        onPress={() => {
                          setPayment(order.payment)
                          setShowPaymentModal(true)
                        }}
                      >
                        <Edit />
                      </TouchableOpacity>
                    ) : (
                      <></>
                    )}
                  </View>

                  <View style={styles.paddingVertical}>
                    {order.status === 'confirmed' ? (
                      <View style={styles.marginHorizontalAuto}>
                        <TouchableOpacity
                          style={[
                            buttonStyles.button,
                            buttonStyles.completeButton,
                          ]}
                          onPress={() =>
                            order.items.length > 0
                              ? setShowCompleteModal(true)
                              : alert(
                                  'O pedido não pode ser finalizado pois ainda não contém nenhum item.',
                                )
                          }
                        >
                          <Text style={[styles.whiteFont, styles.upper]}>
                            Finalizar pedido
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : order.status !== 'canceled' &&
                      order.status !== 'completed' ? (
                      <View style={styles.buttonGroup}>
                        <TouchableOpacity
                          style={[
                            buttonStyles.button,
                            buttonStyles.cancelButton,
                          ]}
                          onPress={() => setShowCancelModal(true)}
                        >
                          <Text style={[styles.whiteFont, styles.upper]}>
                            Recusar
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            buttonStyles.button,
                            buttonStyles.confirmButton,
                          ]}
                          onPress={() => setShowConfirmModal(true)}
                        >
                          <Text style={[styles.whiteFont, styles.upper]}>
                            Confirmar
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <GenericModal
              title="Confirmar Pedido"
              label="Confirmar"
              show={showConfirmModal}
              action={handleConfirmOrder}
              closeModal={handleCloseConfirmModal}
            >
              <View>
                <Text style={{ marginVertical: 15, fontSize: 15 }}>
                  Tem certeza que deseja confirmar o pedido?
                </Text>
              </View>
            </GenericModal>
            <GenericModal
              title="Forma de Pagamento"
              label="Confirmar"
              show={showPaymentModal}
              action={handleChangePayment}
              closeModal={() => setShowPaymentModal(false)}
            >
              <View style={styles.paymentModal}>
                <TouchableOpacity
                  onPress={() => setPayment('money')}
                  style={[
                    styles.paymentMethod,
                    styles.paymentOption,
                    {
                      borderColor: payment === 'money' ? '#289d8c' : '#ccc',
                    },
                  ]}
                >
                  <Image source={Money} style={[styles.paymentMethodIcon]} />
                  <Text style={styles.paymentMethodText}>Dinheiro</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPayment('pix')}
                  style={[
                    styles.paymentMethod,
                    styles.paymentOption,
                    {
                      borderColor: payment === 'pix' ? '#289d8c' : '#ccc',
                    },
                  ]}
                >
                  <Image source={Pix} style={[styles.paymentMethodIcon]} />
                  <Text style={styles.paymentMethodText}>Pix</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPayment('card')}
                  style={[
                    styles.paymentMethod,
                    styles.paymentOption,
                    {
                      borderColor: payment === 'card' ? '#289d8c' : '#ccc',
                    },
                  ]}
                >
                  <Image source={Card} style={[styles.paymentMethodIcon]} />
                  <Text style={styles.paymentMethodText}>Cartão</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPayment('balance')}
                  style={[
                    styles.paymentMethod,
                    styles.paymentOption,
                    {
                      borderColor: payment === 'balance' ? '#289d8c' : '#ccc',
                    },
                  ]}
                >
                  <Image source={Balance} style={[styles.paymentMethodIcon]} />
                  <Text style={styles.paymentMethodText}>Saldo</Text>
                </TouchableOpacity>
              </View>
            </GenericModal>
            <GenericModal
              title="Cancelar Pedido"
              label="Confirmar"
              show={showCancelModal}
              action={handleCancelOrder}
              closeModal={handleCloseCancelModal}
            >
              <View>
                <Text style={{ marginVertical: 15, fontSize: 15 }}>
                  Tem certeza que deseja cancelar o pedido?
                </Text>
              </View>
            </GenericModal>
            <GenericModal
              title="Finalizar Pedido"
              label="Confirmar"
              show={showCompleteModal}
              action={handleCompleteOrder}
              closeModal={handleCloseCompleteModal}
            >
              <View>
                <Text style={{ marginBottom: 15, fontSize: 15 }}>
                  Tem certeza que deseja finalizar o pedido?
                  {order.payment === 'balance' && customer.balance - total < 0 && (
                    <Text
                      style={{
                        color: '#dc3545',
                      }}
                    >
                      O cliente ficará com o saldo negativo ao finalizar a
                      compra.
                    </Text>
                  )}
                </Text>
              </View>
            </GenericModal>
          </>
        )}
      </View>
    </Layout>
  )
}

export default OrderDetails
