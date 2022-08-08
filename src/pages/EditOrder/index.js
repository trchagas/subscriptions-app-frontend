import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text, ActivityIndicator, Image } from 'react-native'

import { styles, buttonStyles } from './styles'

// import { Checkbox } from 'react-native-paper'

import api from '../../services/api'

import Button from '../../components/Button'

import Layout from '../../layouts/Default'

import Food from '../../assets/food.jsx'

import { formatMoney } from '../../utils/format'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { errorApi } from '../../utils/errorApi'

function EditOrder({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(true)

  const [activeBagItems, setActiveBagItems] = useState([])
  const [activeBag, setActiveBag] = useState(true)

  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    async function loadItems() {
      setIsLoading(true)
      try {
        const { data } = await api.get('/foodwalker/bags/active-bag')
        const orderItems = route.params.items

        data.items.forEach((item) => {
          item.amount =
            orderItems.find((orderItem) => orderItem.id === item.id)?.amount ||
            0
        })

        setTotalValue(
          orderItems.reduce((currentTotal, item) => {
            return item.value * item.amount + currentTotal
          }, 0),
        )

        setActiveBagItems(data.items)
      } catch (err) {
        setActiveBag(false)
        alert(errorApi(err, 'Ocorreu um erro ao carregar a mochila ativa.'))
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [])

  const handleSubmit = async () => {
    try {
      await api.patch(`/foodwalker/orders/${route.params.id}/edit`, {
        items: activeBagItems,
      })

      navigation.navigate('Detalhes do Pedido', {
        id: route.params.id,
      })
    } catch (err) {
      console.error(err)
      alert(errorApi(err, 'Ocorreu um erro ao editar o pedido.'))
    }
  }

  return (
    <Layout>
      {isLoading ? (
        <ActivityIndicator size="large" color={'#fff'} />
      ) : (
        <>
          {activeBag ? (
            <>
              {activeBagItems.length === 0 && (
                <View style={styles.centralize}>
                  <Text style={styles.emptyMessage}>
                    Nenhum item foi registrado ainda...
                  </Text>
                </View>
              )}
              {activeBagItems.length > 0 && (
                <>
                  <ScrollView style={styles.scrollView}>
                    {activeBagItems.map((product, index) => (
                      <View
                        key={product.id}
                        style={[styles.card, styles.row, styles.shadow]}
                      >
                        <View style={styles.productImage}>
                          {product.url ? (
                            <Image
                              source={{
                                uri: product.url,
                              }}
                              style={{
                                width: 50,
                                height: 50,
                              }}
                            />
                          ) : (
                            <Food />
                          )}
                        </View>
                        <View
                          style={[
                            styles.status,
                            styles.column,
                            styles.spaceBetween,
                          ]}
                        >
                          <View style={[styles.row, styles.spaceBetween]}>
                            <Text style={[styles.fontBold, styles.fontTitle]}>
                              {product.name}
                            </Text>
                            <Text style={styles.fontBold}>
                              Preço:{' '}
                              <Text style={styles.fontNormal}>
                                {formatMoney(product.value)}
                              </Text>
                            </Text>
                          </View>
                          <View style={[styles.row, styles.spaceBetween]}>
                            <View>
                              <Text style={styles.reservedTxt}>
                                {product.reserved} Reservados
                              </Text>
                            </View>
                            <View style={styles.buttonGroup}>
                              <View>
                                <Text
                                  style={[styles.fontBold, styles.quantity]}
                                >
                                  Quantia:
                                </Text>
                              </View>
                              <Button
                                style={[
                                  buttonStyles.quantityButton,
                                  buttonStyles.removeButton,
                                ]}
                                longPress={true}
                                onPress={() => {
                                  if (product.amount - 1 >= 0) {
                                    const newBagItems = [...activeBagItems]
                                    newBagItems[index].amount -= 1
                                    setActiveBagItems(newBagItems)
                                    setTotalValue(totalValue - product.value)
                                  }
                                }}
                              >
                                <Text style={styles.whiteFont}>-</Text>
                              </Button>
                              <Text
                                style={[
                                  styles.fontNormal,
                                  styles.paddingHorizontal,
                                ]}
                              >
                                {product.amount}/{product.total}
                              </Text>
                              <Button
                                style={[
                                  buttonStyles.quantityButton,
                                  buttonStyles.incrementButton,
                                ]}
                                longPress={true}
                                onPress={() => {
                                  if (product.amount + 1 <= product.total) {
                                    const newBagItems = [...activeBagItems]
                                    newBagItems[index].amount += 1
                                    setActiveBagItems(newBagItems)
                                    setTotalValue(totalValue + product.value)
                                  }
                                }}
                              >
                                <Text style={styles.whiteFont}>+</Text>
                              </Button>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                  <View
                    style={[
                      styles.totalValueContainer,
                      styles.row,
                      styles.spaceBetween,
                    ]}
                  >
                    <Text style={styles.totalValueText}>
                      <Text style={styles.bold}>Total: </Text>
                      <Text>{formatMoney(totalValue)}</Text>
                    </Text>
                    <TouchableOpacity
                      style={buttonStyles.confirmationButton}
                      onPress={handleSubmit}
                      disabled={totalValue === 0}
                    >
                      <Text
                        style={[
                          styles.blackFont,
                          styles.totalValueText,
                          { color: totalValue === 0 ? '#a5a5a5' : '#000' },
                        ]}
                      >
                        Salvar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          ) : (
            <View style={[styles.noBagContainer, styles.shadow]}>
              <View style={styles.noBagWrapper}>
                <Text style={styles.text}>
                  Você ainda não selecionou nenhuma mochila.
                </Text>
                <Button
                  onPress={() => navigation.navigate('Estoque')}
                  style={styles.button}
                >
                  <Text style={styles.label}>Mochilas</Text>
                </Button>
              </View>
            </View>
          )}
        </>
      )}
    </Layout>
  )
}

export default EditOrder
