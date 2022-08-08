import React, { useState } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native'

import Layout from '../../layouts/Default'
import { AntDesign } from '@expo/vector-icons'

import { Table, Row } from 'react-native-table-component'

import { Rating } from 'react-native-elements'

import { styles } from './styles'

import api from '../../services/api'

import Modal from '../../components/GenericModal'

import DefaultProfile from '../../assets/DefaultProfile.png'
import Money from '../../assets/paymentMethods/Money.png'
import Pix from '../../assets/paymentMethods/Pix.png'
import Balance from '../../assets/paymentMethods/Balance.png'
import Card from '../../assets/paymentMethods/Card.png'

import { formatMoney } from '../../utils/format'
import { errorApi } from '../../utils/errorApi'

function OrderReview({ route, navigation }) {
  const payment = route.params.payment
  const items = route.params.items
  const total = items.reduce(
    (current, item) => current + parseInt(item.amount) * item.value,
    0,
  )
  const customer = route.params.customer
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const paymentMethods = {
    money: { icon: Money, label: 'Dinheiro' },
    pix: { icon: Pix, label: 'Pix' },
    balance: { icon: Balance, label: 'Saldo' },
    card: { icon: Card, label: 'Cartão' },
  }

  const confirmOrder = async () => {
    setIsLoading(true)
    try {
      const requestData = {
        customer_id: customer?.id,
        payment,
        items: items.map((item) => {
          return { id: item.id, amount: item.amount }
        }),
      }

      const { data } = await api.post(
        '/foodwalker/orders/instant-sell',
        requestData,
      )

      navigation.reset({
        index: 0,
        routes: [
          { name: 'Inicio' },
          { name: 'Pedido Concluído', params: { customer, order: data } },
        ],
      })
    } catch (e) {
      alert(errorApi(e, 'Ocorreu um erro ao finalizar a venda'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = () => {
    if (payment !== 'balance' || customer.balance - total >= 0) confirmOrder()
    else setShowModal(true)
  }

  return (
    <Layout>
      <View style={styles.view}>
        <View style={[styles.spaceBetween]}>
          <View>
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
                      style={styles.profilePicture}
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
                        imageSize={25}
                        showRating={false}
                      />
                      <Text style={styles.reviewCounterText}>
                        ({customer.rating_count})
                      </Text>
                    </View>
                    <Text style={styles.balance}>
                      Saldo:{' '}
                      <Text
                        style={{
                          color: customer.balance > 0 ? '#28a745' : '#dc3545',
                        }}
                      >
                        {formatMoney(customer.balance)}
                      </Text>
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
            <View>
              <Text style={styles.header}>Itens do pedido:</Text>
              <Table style={styles.table}>
                <Row
                  data={['Nome', 'Valor', 'Quantia', 'Subtotal']}
                  textStyle={styles.bold}
                />
                {items.map((item, index) => (
                  <Row
                    key={index}
                    data={[
                      item.name,
                      formatMoney(item.value),
                      item.amount,
                      formatMoney(item.value * item.amount),
                    ]}
                    style={styles.tableRow}
                  />
                ))}
              </Table>
            </View>
          </View>
        </View>
        <View>
          <Text style={[styles.total]}>
            Total: {formatMoney(total)}{' '}
            {payment === 'balance' && (
              <Text
                style={{
                  color: customer.balance - total >= 0 ? '#28a745' : '#dc3545',
                }}
              >
                ({formatMoney(customer.balance - total)})
              </Text>
            )}
          </Text>
          <View style={styles.paymentMethodContainer}>
            <Text style={styles.paymentMethodHeader}>Forma de pagamento:</Text>
            <View style={styles.paymentMethod}>
              <Image
                source={paymentMethods[payment].icon}
                style={[styles.paymentMethodIcon]}
              />
              <Text style={styles.paymentMethodText}>
                {paymentMethods[payment].label}
              </Text>
            </View>
          </View>
          <View style={[styles.next]}>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading}
              style={styles.row}
            >
              <Text
                style={[
                  styles.nextText,
                  { color: isLoading ? '#a5a5a5' : '#000' },
                ]}
              >
                Confirmar
              </Text>

              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#a5a5a5"
                  style={styles.marginLeft}
                />
              ) : (
                <AntDesign
                  style={styles.marginLeft}
                  size={25}
                  name="right"
                  color={isLoading ? '#a5a5a5' : '#000'}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        show={showModal}
        closeModal={() => setShowModal(false)}
        action={() => {
          setShowModal(false)
          confirmOrder()
        }}
        label="Prosseguir"
        title="Saldo de Cliente Insuficiente"
      >
        <View style={styles.modal}>
          <Text style={styles.modalTxt}>
            O cliente ficará com o saldo negativo ao confirmar a compra. Deseja
            prosseguir?
          </Text>
        </View>
      </Modal>
    </Layout>
  )
}

export default OrderReview
