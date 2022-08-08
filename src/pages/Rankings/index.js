import React, { useEffect, useState } from 'react'
import {
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native'

import Layout from '../../layouts/Default'

import { styles, buttonGroupStyles } from './styles'

import api from '../../services/api'

import DefaultProfile from '../../assets/DefaultProfile.png'
import Upload from '../../assets/upload.png'
import { errorApi } from '../../utils/errorApi'

function Rankings({ route, navigation }) {
  const [user, setUser] = useState({})
  const [foodwalkers, setFoodwalkers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const highlightColors = ['#ffd700', '#c0c0c0', '#cd7f32']
  const getHighlightColor = (rank) => {
    return rank > 3 ? '#000' : highlightColors[rank - 1]
  }

  useEffect(async () => {
    try {
      const { data } = await api.get('/foodwalker/rankings')
      setFoodwalkers(data.foodwalkers)
      setUser(data.user)
    } catch (err) {
      console.error(err)
      alert(errorApi(err, 'Ocorreu um erro ao carregar os rankings.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <Layout>
      {isLoading ? (
        <ActivityIndicator size="large" color={'#9f9f9f'} />
      ) : (
        <View style={{ width: '100%', height: '100%' }}>
          <View
            style={{
              minHeight: '20%',
              backgroundColor: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
              }}
            >
              <Image
                source={
                  user.profile_picture
                    ? { uri: user.profile_picture }
                    : DefaultProfile
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginRight: 10,
                }}
              />
              <View>
                <Text
                  style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}
                >
                  {user.name}
                </Text>
                <Text style={{ color: '#555', fontSize: 20 }}>
                  Pontos: {user.score}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 50,
                paddingRight: 20,
                color: '#000',
                borderRadius: 1000,
              }}
            >
              #{user.rank}
            </Text>
          </View>
          <ScrollView>
            <View style={{ alignItems: 'center', marginTop: 30 }}>
              {foodwalkers.map((foodwalker) => (
                <View
                  style={{
                    height: 100,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',

                    width: '95%',
                    marginBottom: 15,
                    borderRadius: 20,
                    borderWidth: foodwalker.user_id === user.user_id ? 1 : 0,
                    borderColor: getHighlightColor(foodwalker.rank),
                  }}
                  key={foodwalker.id}
                >
                  <View
                    style={{
                      height: '100%',
                      justifyContent: 'center',
                      paddingHorizontal: 18,
                      backgroundColor:
                        foodwalker.rank > 3
                          ? '#fff'
                          : getHighlightColor(foodwalker.rank),
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 40,
                        color: '#000',
                      }}
                    >
                      #{foodwalker.rank}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: 10,
                    }}
                  >
                    <Image
                      source={
                        foodwalker.profile_picture
                          ? { uri: foodwalker.profile_picture }
                          : DefaultProfile
                      }
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        marginRight: 10,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 20,
                          fontWeight: 'bold',
                        }}
                      >
                        {foodwalker.name}
                      </Text>
                      <Text style={{ color: '#555', fontSize: 18 }}>
                        Pontos: {foodwalker.score}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </Layout>
  )
}

export default Rankings
