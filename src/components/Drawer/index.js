import React, { useLayoutEffect, useState } from 'react'
import { View, Text, Image, ActivityIndicator } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { Menu } from 'react-native-paper'

import { Ionicons, MaterialIcons } from '@expo/vector-icons'

import { styles } from './styles'

import { useAuth } from '../../hooks/AuthContext'
import { useUserData } from '../../hooks/UserContext'

import DefaultProfile from '../../assets/DefaultProfile.png'
import api from '../../services/api'

import FoodWalkerStatus from '../../utils/foodWalkerStatus'
import { errorApi } from '../../utils/errorApi'

import ArrowDown from '../../assets/arrowdown.jsx'

function DrawerComponent(props) {
  const { loadProfile, userData } = useUserData()
  const { signOut } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  useLayoutEffect(() => {
    async function loadData() {
      try {
        await loadProfile()
      } catch (err) {
        console.error(err)
        signOut()
        alert(errorApi(err, 'Ocorreu um erro ao carregar o Drawer.'))
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const updateStatus = async (status) => {
    try {
      await api.patch('/foodwalker/status', {
        status,
      })
      loadProfile()
      setShowMenu(false)
    } catch (e) {
      alert(errorApi(e, 'Ocorreu um erro ao atualizar o Status.'))
    }
  }

  return (
    <View style={styles.drawerContent}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={styles.row}>
              <Image
                source={
                  userData.profile_picture
                    ? { uri: userData.profile_picture }
                    : DefaultProfile
                }
                style={{
                  borderRadius: 50,
                  width: 50,
                  height: 50,
                }}
              />
              <View style={styles.name}>
                {!isLoading ? (
                  <View>
                    <Text style={styles.title}>{userData.name}</Text>
                    <View style={styles.row}>
                      <Menu
                        style={{ marginTop: -20 }}
                        visible={showMenu}
                        onDismiss={() => setShowMenu(false)}
                        anchor={
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                            onTouchEnd={() => setShowMenu(true)}
                          >
                            <Text style={styles.caption}>Status: </Text>
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                marginBottom: 2,
                                backgroundColor:
                                  FoodWalkerStatus[userData?.status]?.['color'],
                              }}
                            ></View>
                            <Text style={[styles.caption, { marginRight: 5 }]}>
                              {' '}
                              {FoodWalkerStatus[userData?.status]?.['label']}
                            </Text>
                            <ArrowDown />
                          </View>
                        }
                      >
                        <Menu.Item
                          onPress={() => {
                            userData.hasActiveBag
                              ? updateStatus('active')
                              : alert(
                                  'Para ficar ativo é necessário possuir uma mochila ativa.',
                                )
                            setShowMenu(false)
                          }}
                          title="Ativo"
                        />
                        <Menu.Item
                          onPress={() => {
                            updateStatus('inactive')
                          }}
                          title="Inativo"
                        />
                      </Menu>
                    </View>
                  </View>
                ) : (
                  <ActivityIndicator />
                )}
              </View>
            </View>
          </View>
          <View style={styles.drawerSection}>
            <DrawerItem
              icon={() => (
                <Ionicons name="home-outline" color={'#999'} size={30} />
              )}
              onPress={() => {
                props.navigation.navigate('Inicio')
              }}
              label="Início"
            />
            <DrawerItem
              icon={() => (
                <Ionicons name="person-outline" color={'#999'} size={30} />
              )}
              label="Perfil"
              onPress={() => {
                props.navigation.navigate('Perfil')
              }}
            />
            <DrawerItem
              icon={() => (
                <MaterialIcons
                  name="electric-scooter"
                  color={'#999'}
                  size={30}
                />
              )}
              label="Área do Vendedor"
              onPress={() => {
                props.navigation.navigate('Área do Vendedor')
              }}
            />
            <DrawerItem
              icon={() => (
                <MaterialIcons name="attach-money" color={'#999'} size={30} />
              )}
              label="Saldo"
              onPress={() => {
                props.navigation.navigate('Adicionar Saldo')
              }}
            />
            <DrawerItem
              icon={() => (
                <Ionicons name="trophy-outline" color={'#999'} size={30} />
              )}
              label="Rankings"
              onPress={() => {
                props.navigation.navigate('Rankings')
              }}
            />
            <DrawerItem
              icon={() => (
                <Ionicons name="fast-food-outline" color={'#999'} size={30} />
              )}
              label="Pedidos"
              onPress={() => {
                props.navigation.navigate('Pedidos')
              }}
            />
            <DrawerItem
              icon={() => (
                <Ionicons name="cart-outline" color={'#999'} size={30} />
              )}
              label="Venda"
              onPress={() => {
                props.navigation.navigate('Venda')
              }}
            />
            <DrawerItem
              icon={() => (
                <Ionicons name="briefcase-outline" color={'#999'} size={30} />
              )}
              label="Estoque"
              onPress={() => {
                props.navigation.navigate('Estoque')
              }}
            />
            {/* <DrawerItem
              icon={() => (
                <Icon name="trophy-variant-outline" color={'#999'} size={30} />
              )}
              label="Metas"
              onPress={() => {
                props.navigation.navigate('Metas')
              }}
            /> */}
            {/* <DrawerItem
              icon={() => (
                <Ionicons name="help-buoy-outline" color={'#999'} size={30} />
              )}
              label="Suporte"
              onPress={() => {}}
            /> */}
          </View>
        </View>
      </DrawerContentScrollView>
      {/* <View
        style={{
          height: '30%',
          borderTopWidth: 1,
          borderBottomWidth: 1,
          paddingTop: 10,
          borderColor: '#f4f4f4',
        }}
      >
        <Goal label="Meta Diária: R$500 / R$525" progress={0.9} />
        <Goal label="Meta Semanal: R$1000 / R$1100" progress={0.85} />
      </View> */}
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={() => (
            <Ionicons name="log-out-outline" color={'#999'} size={30} />
          )}
          label="Sair"
          onPress={() => {
            signOut()
          }}
        />
      </View>
    </View>
  )
}

export default DrawerComponent
