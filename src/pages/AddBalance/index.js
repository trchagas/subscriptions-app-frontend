import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
} from 'react-native'
import _ from 'lodash'
import { Searchbar } from 'react-native-paper'
import { Rating } from 'react-native-elements'
import CurrencyInput from 'react-native-currency-input'
import { AntDesign } from '@expo/vector-icons'
import { parseISO, format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'

import Layout from '../../layouts/Default'

import { styles } from './styles'

import api from '../../services/api'
import { formatMoney, formatPhone } from '../../utils/format'

import DefaultProfile from '../../assets/DefaultProfile.png'
import Button from '../../components/Button'
import { errorApi } from '../../utils/errorApi'

function AddBalance({ route, navigation }) {
  const { height } = Dimensions.get('window')
  const inputRef = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const [bottomLoading, setBottomLoading] = useState(false)
  const [meta, setMeta] = useState({})

  const [customersMatch, setCustomersMatch] = useState([])

  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [reason, setReason] = useState(null)
  const [reasonText, setReasonText] = useState(null)
  const [addValue, setAddValue] = useState(0)

  const reasonMap = {
    pix: 'Saldo movimentado via pix.',
    money: 'Saldo movimentado via dinheiro',
    other: reason,
  }

  function Loading() {
    if (!bottomLoading) return null
    return (
      <ActivityIndicator style={{ margin: 15 }} size="small" color={'#fff'} />
    )
  }

  function UserCard({ item }) {
    return (
      <TouchableOpacity
        style={[styles.userCard, styles.shadow]}
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
          <View style={styles.itemReview}>
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

  const loadData = useCallback(async (name) => {
    setIsLoading(true)
    try {
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
    loadData('')
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

  const handleConfirm = async () => {
    try {
      await api.post(`/foodwalker/customers/${selectedCustomer.id}/balance`, {
        value: addValue,
        reason: reasonMap[reason],
      })

      setSearchQuery('')
      handleCloseSelected()
      loadData()
    } catch (e) {
      alert(errorApi(e, 'Ocorreu um erro ao alterar o saldo desse usuário.'))
      console.error(e)
    }
  }

  const handleCloseSelected = () => {
    setAddValue(0)
    setSelectedCustomer(null)
    setReasonText('')
    setReason(null)
  }

  return (
    <Layout>
      <KeyboardAvoidingView
        style={styles.mainView}
        enabled={selectedCustomer}
        behavior="position"
      >
        {selectedCustomer ? (
          <View style={[styles.selectedUserCard, styles.shadow]}>
            <View style={styles.cardMainInfo}>
              <View>
                <Image
                  source={
                    selectedCustomer.profile_picture
                      ? { uri: selectedCustomer.profile_picture }
                      : DefaultProfile
                  }
                  style={styles.cardProfilePicture}
                />
              </View>
              <View style={styles.userCardCol2}>
                <Text style={styles.userName}>{selectedCustomer.name}</Text>
                <View style={styles.customerReview}>
                  <Rating
                    fractions={20}
                    ratingCount={5}
                    startingValue={selectedCustomer.rating}
                    readonly
                    imageSize={30}
                    showRating={false}
                  />
                  <Text style={styles.reviewCounterText}>
                    ({selectedCustomer.rating_count})
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.cardSecondaryInfo}>
              <Text style={styles.secondaryInfoTxt}>
                <Text style={{ fontWeight: 'bold' }}>Registrado em:</Text>{' '}
                {format(parseISO(selectedCustomer.created_at), 'dd/MM/yyyy', {
                  locale: pt,
                })}
              </Text>
              <Text style={styles.secondaryInfoTxt}>
                <Text style={{ fontWeight: 'bold' }}>Telefone:</Text>{' '}
                {selectedCustomer.phone
                  ? formatPhone(selectedCustomer.phone)
                  : 'Não informado'}
              </Text>
              <Text
                style={[
                  styles.secondaryInfoTxt,
                  {
                    fontSize: 20,
                    color: selectedCustomer.balance < 0 ? '#dc3545' : '#28a745',
                  },
                ]}
              >
                <Text style={{ fontWeight: 'bold', color: '#000' }}>
                  Saldo:
                </Text>{' '}
                {formatMoney(selectedCustomer.balance)}
              </Text>
            </View>
            <View style={styles.addBalance}>
              <CurrencyInput
                value={addValue}
                placeholder="R$ 0,00"
                onChangeValue={setAddValue}
                prefix="R$ "
                delimiter=","
                separator="."
                precision={2}
                style={[styles.inputContainer, { paddingHorizontal: 12 }]}
              />
              <View style={styles.btnGroup}>
                <Button
                  onPress={() => setAddValue(Number(addValue) + 5)}
                  style={[styles.inputContainer, styles.left]}
                >
                  <Text style={styles.plussBalanceTxt}>+R$ 5.00</Text>
                </Button>
                <Button
                  onPress={() => setAddValue(Number(addValue) + 10)}
                  style={[styles.inputContainer, styles.middle]}
                >
                  <Text style={styles.plussBalanceTxt}>+R$ 10.00</Text>
                </Button>
                <Button
                  onPress={() => setAddValue(Number(addValue) + 50)}
                  style={[styles.inputContainer, styles.right]}
                >
                  <Text style={styles.plussBalanceTxt}>+R$ 50.00</Text>
                </Button>
              </View>
            </View>
            <View style={styles.addReason}>
              <Text style={styles.reasonHeader}>Pagamento</Text>
              <View
                style={[
                  styles.btnGroup,
                  { width: '100%', justifyContent: 'space-around' },
                ]}
              >
                <Button
                  onPress={() => setReason('pix')}
                  style={[
                    styles.inputContainer,
                    { borderColor: reason === 'pix' ? '#000' : '#afafaf' },
                  ]}
                >
                  <Text
                    style={[
                      styles.plussBalanceTxt,
                      { color: reason === 'pix' ? '#000' : '#afafaf' },
                    ]}
                  >
                    Pix
                  </Text>
                </Button>
                <Button
                  onPress={() => setReason('money')}
                  style={[
                    styles.inputContainer,
                    {
                      borderColor: reason === 'money' ? '#000' : '#afafaf',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.plussBalanceTxt,
                      { color: reason === 'money' ? '#000' : '#afafaf' },
                    ]}
                  >
                    Dinheiro
                  </Text>
                </Button>
                <Button
                  onPress={() => setReason('text')}
                  style={[
                    styles.inputContainer,
                    { borderColor: reason === 'text' ? '#000' : '#afafaf' },
                  ]}
                >
                  <Text
                    style={[
                      styles.plussBalanceTxt,
                      { color: reason === 'text' ? '#000' : '#afafaf' },
                    ]}
                  >
                    Outro
                  </Text>
                </Button>
              </View>

              {reason === 'text' ? (
                <TextInput
                  value={reasonText}
                  multiline={true}
                  style={styles.reasonInput}
                  onChangeText={(e) => setReasonText(e)}
                />
              ) : (
                <></>
              )}
            </View>
            <Button
              disabled={!addValue || !reason}
              style={[
                styles.confirmBtn,
                {
                  backgroundColor: !addValue || !reason ? '#5bda76' : '#28a745',
                },
              ]}
              onPress={handleConfirm}
            >
              <Text
                style={{ color: !addValue || !reason ? '#fafafa' : '#fff' }}
              >
                Confirmar
              </Text>
            </Button>
            <Button style={styles.cancelBtn} onPress={handleCloseSelected}>
              <AntDesign size={20} name="close" />
            </Button>
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
                color={'#fff'}
              />
            ) : (
              <View
                style={{
                  height: height - 150,
                }}
              >
                <FlatList
                  style={styles.scrollView}
                  data={customersMatch}
                  renderItem={UserCard}
                  keyExtractor={(i) => i.id}
                  onEndReached={nextPage}
                  onEndReachedThreshold={0.05}
                  listFooterComponent={Loading}
                />
              </View>
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </Layout>
  )
}

export default AddBalance
