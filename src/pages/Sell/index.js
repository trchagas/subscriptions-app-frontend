import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text, ActivityIndicator, Image } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { styles, buttonStyles } from './styles'

import api from '../../services/api'

import Button from '../../components/Button'

import Layout from '../../layouts/Default'

import Food from '../../assets/food.jsx'

import { formatMoney } from '../../utils/format'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { errorApi } from '../../utils/errorApi'

function Sell({ navigation }) {
  const [isLoading, setIsLoading] = useState(true)

  const [bagItems, setBagItems] = useState([])
  const [activeBag, setActiveBag] = useState(true)

  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    setTotalValue(
      bagItems.reduce(
        (total, item) => total + parseInt(item.amount) * item.value,
        0,
      ),
    )
  }, [bagItems])

  useEffect(() => {
    async function loadItems() {
      setIsLoading(true)
      try {
        const { data } = await api.get('/foodwalker/bags/active-bag')

        data.items.forEach((item) => {
          item.amount = 0
        })

        setBagItems(data.items)
      } catch (err) {
        setActiveBag(false)
        console.error(err)
        alert(
          errorApi(
            err,
            'Ocorreu um erro ao carregar as informações da mochila.',
          ),
        )
      } finally {
        setIsLoading(false)
      }
    }
    loadItems()
  }, [])

  return (
    <Layout>
      {isLoading ? (
        <ActivityIndicator size="large" color={'#fff'} />
      ) : (
        <>
          {activeBag ? (
            <>
              {bagItems.length === 0 && (
                <View>
                  <Text style={styles.emptyMessage}>
                    Nenhum item foi registrado ainda...
                  </Text>
                </View>
              )}
              {bagItems.length > 0 && (
                <>
                  <ScrollView style={styles.scrollView}>
                    {bagItems.map((product, index) => (
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
                                      const newBagItems = [...bagItems]
                                      newBagItems[index].amount -= 1
                                      setBagItems(newBagItems)
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
                                      const newBagItems = [...bagItems]
                                      newBagItems[index].amount += 1
                                      setBagItems(newBagItems)
                                    }
                                  }}
                                >
                                  <Text style={styles.whiteFont}>+</Text>
                                </Button>
                              </View>
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
                      onPress={() => {
                        navigation.navigate('Cadastro e Pagamento', {
                          items: bagItems.filter((item) => item.amount > 0),
                        })
                      }}
                      disabled={totalValue === 0}
                    >
                      <Text
                        style={[
                          styles.blackFont,
                          styles.totalValueText,
                          { color: totalValue === 0 ? '#a5a5a5' : '#000' },
                        ]}
                      >
                        Seguinte
                      </Text>
                      <AntDesign
                        style={styles.marginLeft}
                        size={25}
                        name="right"
                        color={totalValue === 0 ? '#a5a5a5' : '#000'}
                      />
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

export default Sell
