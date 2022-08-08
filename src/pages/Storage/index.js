import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native'
import { AntDesign, SimpleLineIcons, MaterialIcons } from '@expo/vector-icons'
import { buttonStyles, styles } from './styles'

import { Checkbox } from 'react-native-paper'

import api from '../../services/api'

import GenericModal from '../../components/GenericModal'
import Button from '../../components/Button'

import Layout from '../../layouts/Default'

import Food from '../../assets/food.jsx'
import Refresh from '../../assets/refresh.jsx'

import { formatMoney } from '../../utils/format'

import { useUserData } from '../../hooks/UserContext'
import { errorApi } from '../../utils/errorApi'

function Storage({ navigation }) {
  const { loadProfile, userData } = useUserData()

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showBagModal, setShowBagModal] = useState(false)

  const [showSave, setShowSave] = useState(false)

  const [activeBag, setActiveBag] = useState(null)
  const [activeBagItems, setActiveBagItems] = useState([])
  const [bags, setBags] = useState([])
  const [items, setItems] = useState([])
  const [showAddItems, setShowAddItems] = useState([])
  const [initialBagItems, setInitialBagItems] = useState([])

  useLayoutEffect(() => {
    async function loadData() {
      try {
        const bagsData = await api.get('/foodwalker/bags')
        const dataItems = await api.get('/foodwalker/items')

        setItems(dataItems.data)
        setBags(bagsData.data.bags)
        setActiveBag(bagsData.data.active_bag)
      } catch (err) {
        console.error(err)
        alert(errorApi(err, 'Ocorreu um erro ao carregar as informações.'))
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    loadItems()
  }, [activeBag])

  const loadItems = async () => {
    setIsLoading(true)
    try {
      if (activeBag) {
        const { data } = await api.get(`/foodwalker/bags/${activeBag.id}`)

        const newShowAddItems = items.filter(
          (item) => !data.items.find((bag) => bag.id === item.id),
        )
        newShowAddItems.forEach((item) => {
          item.add = false
          item.total = 1
        })
        setShowAddItems(newShowAddItems)

        setActiveBagItems(data.items)
        setInitialBagItems(data.items)
        await loadProfile()
      }
    } catch (err) {
      console.error(err)
      alert(errorApi(err, 'Ocorreu um erro ao carregar os itens.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeBag = async (bag) => {
    if (bag.id !== activeBag?.id) {
      setIsLoading(true)
      setActiveBag(bag)
      setShowSave(false)
      await api.patch('foodwalker/bags/active-bag', { bag_id: bag.id })
    }
    setShowBagModal(false)
  }

  const handleSubmit = async () => {
    setIsLoadingSubmit(true)
    try {
      const requestData = []
      for (const item of activeBagItems) {
        const action = initialBagItems.find((bag) => bag.id === item.id)
          ? 'update'
          : 'store'
        requestData.push({
          action,
          ...item,
        })
      }
      for (const item of initialBagItems) {
        if (!activeBagItems.find((bag) => bag.id === item.id))
          requestData.push({
            action: 'delete',
            ...item,
          })
      }
      await api.put(`/foodwalker/bags/${activeBag.id}/items`, {
        items: requestData,
      })
      // navigation.navigate('Inicio')
      const bagsCopy = [...bags]
      const newBag = bagsCopy.find((bag) => bag.id === activeBag.id)
      newBag.amount = activeBagItems.length

      setBags(bagsCopy)
      setInitialBagItems(activeBagItems)
      setShowSave(false)
    } catch (e) {
      console.error(e)
      alert(errorApi(e, 'Ocorreu um erro ao salvar a mochila.'))
    }
    setIsLoadingSubmit(false)
  }

  const updateShowAddItems = (bag) => {
    const newShowAddItems = items.filter(
      (item) => !bag.find((bag) => bag.id === item.id),
    )
    newShowAddItems.forEach((item) => {
      item.add = false
      item.total = 1
    })

    setShowAddItems(newShowAddItems)
  }

  const handleCloseModal = () => {
    updateShowAddItems(activeBagItems)
    setShowAddModal(false)
  }

  const handleSubmitModal = () => {
    const filterItems = showAddItems.filter((item) => item.add)

    if (filterItems.length === 0) {
      updateShowAddItems(activeBagItems)
      setShowAddModal(false)
      return
    }
    if (!showSave) setShowSave(true)

    const addBagItems = filterItems.map((item) => {
      item.reserved =
        initialBagItems.find((bagItem) => bagItem.id === item.id)?.reserved || 0
      item.default = item.total
      return item
    })

    const newBagItems = [...activeBagItems].concat(addBagItems)

    updateShowAddItems(newBagItems)
    setActiveBagItems(newBagItems)
    setShowAddModal(false)
  }

  return (
    <Layout>
      {isLoading ? (
        <View style={styles.centralize}>
          <ActivityIndicator size="large" color={'#fff'} />
        </View>
      ) : !activeBag ? (
        <View style={[styles.emptyMessageContainer, styles.shadow]}>
          <View style={styles.emptyMessageWrapper}>
            <Text style={styles.emptyMessage}>
              Nenhuma mochila foi selecionada ainda...
            </Text>
            <Button
              style={buttonStyles.selectButton}
              onPress={() => setShowBagModal(true)}
            >
              <Text style={styles.label}>Selecionar</Text>
            </Button>
          </View>
        </View>
      ) : (
        <>
          {activeBagItems.length === 0 && (
            <View style={styles.centralize}>
              <Text style={styles.emptyMessage}>
                Nenhum item foi registrado ainda...
              </Text>
            </View>
          )}
          {activeBagItems.length > 0 && (
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
                    style={[styles.status, styles.column, styles.spaceBetween]}
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
                      <View
                        style={[styles.row, styles.start, styles.spaceBetween]}
                      >
                        <View>
                          <Text style={styles.fontItalic}>
                            {product.reserved} Reservados
                          </Text>
                          <View style={styles.row}>
                            <Text style={[styles.fontBold, styles.quantity]}>
                              Quantia:
                            </Text>
                            <Text
                              style={[
                                styles.fontNormal,
                                styles.paddingHorizontal,
                              ]}
                            >
                              {product.total}/{product.default}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.row}>
                          <Button
                            style={[
                              buttonStyles.quantityButton,
                              buttonStyles.removeButton,
                            ]}
                            longPress={true}
                            onPress={() => {
                              if (!showSave) setShowSave(true)
                              const newItems = [...activeBagItems]
                              if (newItems[index].total - 1 >= 0)
                                newItems[index].total -= 1
                              setActiveBagItems(newItems)
                            }}
                          >
                            <Text style={styles.whiteFont}>-</Text>
                          </Button>
                          <Button
                            style={[
                              buttonStyles.quantityButton,
                              buttonStyles.incrementButton,
                            ]}
                            longPress={true}
                            onPress={() => {
                              if (!showSave) setShowSave(true)
                              const newItems = [...activeBagItems]
                              newItems[index].total += 1
                              setActiveBagItems(newItems)
                            }}
                          >
                            <Text style={styles.whiteFont}>+</Text>
                          </Button>
                        </View>
                        <View>
                          <SimpleLineIcons
                            name="trash"
                            size={25}
                            onPress={() => {
                              if (!showSave) setShowSave(true)
                              const newItems = activeBagItems.filter(
                                (_, iter) => index !== iter,
                              )
                              setActiveBagItems(newItems)
                              updateShowAddItems(newItems)
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
          <Button
            style={[buttonStyles.bagButton, styles.shadow]}
            onPress={() => setShowBagModal(true)}
          >
            <MaterialIcons name="backpack" size={30} />
          </Button>
          {activeBag && (
            <>
              <Button
                onPress={() => {
                  setShowAddModal(true)
                }}
                style={[buttonStyles.addButton, styles.shadow]}
              >
                <AntDesign
                  style={buttonStyles.buttonImage}
                  name="plus"
                  size={30}
                  color="black"
                />
              </Button>
              <Button
                onPress={() => {
                  const newBagItems = [...activeBagItems]
                  newBagItems.forEach((item) => (item.total = item.default))
                  setActiveBagItems(newBagItems)
                  setShowSave(true)
                }}
                style={[buttonStyles.refreshButton, styles.shadow]}
              >
                <Refresh />
              </Button>
            </>
          )}

          {showSave && (
            <Button
              style={[buttonStyles.saveButton, styles.shadow]}
              isLoading={isLoadingSubmit}
              onPress={handleSubmit}
            >
              Salvar
            </Button>
          )}
          <GenericModal
            title="Items"
            label="Adicionar"
            show={showAddModal}
            action={handleSubmitModal}
            closeModal={handleCloseModal}
          >
            <ScrollView style={styles.modalScrollView}>
              {showAddItems.length === 0 && (
                <Text style={{ textAlign: 'center' }}>
                  Não há itens para adicionar à mochila...
                </Text>
              )}
              {showAddItems.length > 0 &&
                showAddItems.map((item, index) => (
                  <View
                    key={item.id}
                    style={[styles.shadow, styles.itemCard, styles.row]}
                  >
                    <View
                      style={[
                        styles.status,
                        styles.column,
                        styles.spaceBetween,
                      ]}
                    >
                      <View style={[styles.row, styles.spaceBetween]}>
                        <Text style={[styles.fontBold, styles.fontNormal]}>
                          {item.name}
                        </Text>
                        <Text style={styles.fontBold}>
                          Preço:{' '}
                          <Text style={styles.fontNormal}>
                            {formatMoney(item.value)}
                          </Text>
                        </Text>
                      </View>
                      <View style={[styles.row, styles.spaceBetween]}>
                        <Text style={styles.fontBold}>Quantia Total:</Text>
                        <Text style={styles.fontNormal}>{item.total}</Text>
                        <View style={[styles.row]}>
                          <Button
                            style={[
                              buttonStyles.quantityButton,
                              buttonStyles.removeButton,
                            ]}
                            longPress={true}
                            onPress={() => {
                              const newShowAddItems = [...showAddItems]
                              newShowAddItems[index].total = Math.max(
                                1,
                                newShowAddItems[index].total - 1,
                              )
                              setShowAddItems(newShowAddItems)
                              if (!showAddItems[index].add) {
                                const newShowAddItems = [...showAddItems]
                                newShowAddItems[index].add = true
                                setShowAddItems(newShowAddItems)
                              }
                            }}
                          >
                            <Text style={styles.whiteFont}>-</Text>
                          </Button>
                          <Button
                            style={[
                              buttonStyles.quantityButton,
                              buttonStyles.incrementButton,
                            ]}
                            longPress={true}
                            onPress={() => {
                              const newShowAddItems = [...showAddItems]
                              newShowAddItems[index].total =
                                newShowAddItems[index].total + 1
                              setShowAddItems(newShowAddItems)
                              if (!showAddItems[index].add) {
                                const newShowAddItems = [...showAddItems]
                                newShowAddItems[index].add = true
                                setShowAddItems(newShowAddItems)
                              }
                            }}
                          >
                            <Text style={styles.whiteFont}>+</Text>
                          </Button>
                        </View>
                        <Checkbox
                          color="#28a745"
                          status={item.add ? 'checked' : 'unchecked'}
                          onPress={() => {
                            const newShowAddItems = [...showAddItems]
                            newShowAddItems[index].add =
                              !newShowAddItems[index].add
                            setShowAddItems(newShowAddItems)
                          }}
                        />
                      </View>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </GenericModal>
        </>
      )}
      <GenericModal
        title="Selecionar Mochila"
        show={showBagModal}
        showConfirm={false}
        closeModal={() => setShowBagModal(false)}
      >
        {bags.length ? (
          <ScrollView style={styles.scrollView}>
            {bags.map((bag) => (
              <View
                key={bag.id}
                style={[styles.bagCard, styles.row, styles.shadow]}
              >
                <View style={[styles.column, styles.contentArea]}>
                  <View
                    style={[styles.row, styles.spaceBetween, styles.bagInfo]}
                  >
                    <Text style={[styles.bagName]}>{bag.name} </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={[styles.column, styles.italic]}>
                      {bag.description}
                    </Text>
                  </View>
                </View>
                <View style={[styles.columnSpaceBetween]}>
                  <Text style={[styles.bagSize]}>Items: {bag.amount}</Text>
                  <Button
                    style={buttonStyles.activeButton}
                    onPress={() => handleChangeBag(bag)}
                  >
                    <Text style={styles.whiteFont}>Ativar</Text>
                  </Button>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View>
            <Text
              style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 30 }}
            >
              Nenhuma mochila foi encontrada.
            </Text>
          </View>
        )}
      </GenericModal>
    </Layout>
  )
}

export default Storage
