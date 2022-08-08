import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native'
import _ from 'lodash'

import Layout from '../../layouts/Default'
import { RadioButton, Searchbar } from 'react-native-paper'
import { AntDesign } from '@expo/vector-icons'

import { styles } from './styles'

import api from '../../services/api'

import { Rating } from 'react-native-elements'

import DefaultProfile from '../../assets/DefaultProfile.png'
import { Money, Pix, Balance, Card } from '../../utils/paymentMethods'
import { errorApi } from '../../utils/errorApi'

function LinkCustomer({ route, navigation }) {
  const inputRef = useRef()
  const [signedCustomer, setSignedCustomer] = useState(false)
  const [payment, setPayment] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [bottomLoading, setBottomLoading] = useState(false)
  const [meta, setMeta] = useState({})

  const [customersMatch, setCustomersMatch] = useState([])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  function Loading() {
    if (!bottomLoading) return null
    return (
      <ActivityIndicator
        style={{ margin: 15 }}
        size="large"
        color={'#afafaf'}
      />
    )
  }

  function UserCard({ item }) {
    return (
      <TouchableOpacity
        style={styles.userCard}
        key={item.id}
        onPress={() => setSelectedCustomer(item)}
      >
        <View>
          <Image
            source={
              item.profile_picture
                ? { uri: item.profile_picture }
                : DefaultProfile
            }
            style={styles.profilePicture}
          />
        </View>
        <View style={styles.userCardCol2}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.customerReview}>
            <Rating
              fractions={20}
              ratingCount={5}
              startingValue={item.rating}
              readonly
              imageSize={25}
              showRating={false}
            />
            <Text style={styles.reviewCounterText}>({item.rating_count})</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  // useEffect(() => {
  const loadData = useCallback(async (name) => {
    try {
      setIsLoading(true)
      const { data } = await api.get(`/foodwalker/customers?name=${name}`)
      setCustomersMatch(data.data)
      setMeta({
        lastPage: data.lastPage,
        page: data.page,
        perPage: data.perPage,
        total: data.total,
      })
    } catch (e) {
      console.error(e)
      alert(errorApi(e, 'Ocorreu um erro ao carregar os usuários cadastrados.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // initialize debounce function to search once user has stopped typing every half second
    inputRef.current = _.debounce(loadData, 1000)
  }, [])

  const handleChangeQuery = (e) => {
    setSearchQuery(e)
    inputRef.current(e)
  }

  const nextPage = useCallback(async () => {
    if (meta.page >= meta.lastPage || bottomLoading || isLoading) return

    setBottomLoading(true)
    try {
      const query = searchQuery === '' ? '' : `&name=${searchQuery}`
      const { data } = await api.get(
        `/foodwalker/customers?page=${meta.page + 1}${query}`,
      )

      setCustomersMatch((c) => [...c, ...data.data])
      setMeta({
        lastPage: data.lastPage,
        page: data.page,
        perPage: data.perPage,
        total: data.total,
      })
    } catch (e) {
      alert(errorApi(e, 'Ocorreu um erro ao carregar os usuários cadastrados.'))
      console.error(e)
    } finally {
      setBottomLoading(false)
    }
  }, [meta, searchQuery, bottomLoading, isLoading])

  return (
    <Layout>
      <ScrollView style={styles.mainView}>
        <View>
          <Text style={styles.header}>Associar Cliente</Text>
          <View style={styles.radioButton}>
            <RadioButton
              value="true"
              status={signedCustomer ? 'checked' : 'unchecked'}
              onPress={() => setSignedCustomer(true)}
              color="#2b67ed"
            />
            <Text style={styles.radioButtonText}>Cliente já cadastrado</Text>
          </View>
          {signedCustomer && (
            <>
              {selectedCustomer ? (
                <View
                  style={styles.selectedUserCard}
                  key={selectedCustomer.id}
                  onPress={() => setSelectedCustomer(selectedCustomer)}
                >
                  <View>
                    <Image
                      source={
                        selectedCustomer.profile_picture
                          ? { uri: selectedCustomer.profile_picture }
                          : DefaultProfile
                      }
                      style={[styles.profilePicture]}
                    />
                  </View>
                  <View style={styles.userCardCol2}>
                    <Text style={styles.userName}>{selectedCustomer.name}</Text>
                    <View style={styles.customerReview}>
                      <Rating
                        fractions={10}
                        startingValue={selectedCustomer.rating}
                        readonly
                        imageSize={25}
                        showRating={false}
                      />
                      <Text style={styles.reviewCounterText}>
                        ({selectedCustomer.rating_count})
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setSearchQuery('')
                      setSelectedCustomer(null)
                    }}
                  >
                    <AntDesign size={20} name="close" />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.searchBar}>
                    <Searchbar
                      placeholder="Buscar"
                      onChangeText={handleChangeQuery}
                      value={searchQuery}
                      style={{
                        borderWidth: 1,
                        borderColor: '#aaa',
                        shadowColor: '#fff',
                      }}
                    />
                  </View>
                  {isLoading ? (
                    <ActivityIndicator
                      style={{ margin: 15 }}
                      size="large"
                      color={'#afafaf'}
                    />
                  ) : (
                    <FlatList
                      style={styles.scrollView}
                      data={customersMatch}
                      renderItem={UserCard}
                      keyExtractor={(i) => i.id}
                      onEndReached={nextPage}
                      onEndReachedThreshold={0.05}
                      listFooterComponent={Loading}
                      nestedScrollEnabled
                    />
                  )}
                </>
              )}
            </>
          )}
          <View style={styles.radioButton}>
            <RadioButton
              value="false"
              status={!signedCustomer ? 'checked' : 'unchecked'}
              onPress={() => {
                setSignedCustomer(false)
                if (payment === 'balance') setPayment(null)
              }}
              color="#2b67ed"
            />
            <Text style={styles.radioButtonText}>Cliente anônimo</Text>
          </View>
          <View style={styles.paymentContainer}>
            <Text style={styles.header}>Forma de Pagamento</Text>
            <TouchableOpacity
              onPress={() => setPayment('money')}
              style={[
                styles.paymentMethod,
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
                {
                  borderColor: payment === 'card' ? '#289d8c' : '#ccc',
                },
              ]}
            >
              <Image source={Card} style={[styles.paymentMethodIcon]} />
              <Text style={styles.paymentMethodText}>Cartão</Text>
            </TouchableOpacity>

            {signedCustomer ? (
              <TouchableOpacity
                onPress={() => setPayment('balance')}
                style={[
                  styles.paymentMethod,
                  {
                    borderColor: payment === 'balance' ? '#289d8c' : '#ccc',
                  },
                ]}
              >
                <Image source={Balance} style={[styles.paymentMethodIcon]} />
                <Text style={styles.paymentMethodText}>Saldo</Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.next}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Revisão do Pedido', {
              payment,
              customer: selectedCustomer,
              items: route.params.items,
            })
          }}
          disabled={!payment || (!selectedCustomer && signedCustomer)}
          style={styles.row}
        >
          <Text
            style={[
              styles.nextText,
              {
                color:
                  !payment || (!selectedCustomer && signedCustomer)
                    ? '#a5a5a5'
                    : '#000',
              },
            ]}
          >
            Seguinte
          </Text>
          <AntDesign
            style={styles.marginLeft}
            size={25}
            name="right"
            color={
              !payment || (!selectedCustomer && signedCustomer)
                ? '#a5a5a5'
                : '#000'
            }
          />
        </TouchableOpacity>
      </View>
    </Layout>
  )
}

export default LinkCustomer
