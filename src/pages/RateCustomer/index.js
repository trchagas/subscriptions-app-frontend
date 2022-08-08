import React, { useState } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'

import Layout from '../../layouts/Default'

import { AntDesign } from '@expo/vector-icons'

import { Rating, AirbnbRating } from 'react-native-elements'

import { styles } from './styles'

import DefaultProfile from '../../assets/DefaultProfile.png'
import api from '../../services/api'
import { errorApi } from '../../utils/errorApi'

function RateCustomer({ route, navigation }) {
  const customer = route.params.customer
  const order_id = route.params.order.id

  const [rating, setRating] = useState(3)

  const handleFinish = async () => {
    try {
      await api.post(`/foodwalker/orders/${order_id}/rate`, { rating })

      navigation.popToTop()
    } catch (e) {
      console.error(e)
      alert(errorApi(e, 'Ocorreu um erro ao avaliar o cliente.'))
    }
  }

  return (
    <Layout>
      <View style={styles.view}>
        <View style={styles.customerContainer}>
          <Image
            source={
              customer.profile_picture
                ? { uri: customer.profile_picture }
                : DefaultProfile
            }
            style={styles.profilePicture}
          />
          <Text style={styles.customerNameText}>{customer.name}</Text>
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

          <View style={styles.rateCustomerContainer}>
            <Text style={styles.messageText}>
              Cordialidade é uma via de mão dupla, como foi seu cliente?
            </Text>
            <View>
              <AirbnbRating
                defaultRating={rating}
                reviews={['Péssimo', 'Ruim', 'Médio', 'Bom', 'Excelente']}
                size={30}
                onFinishRating={(e) => setRating(e)}
                reviewSize={20}
              />
            </View>
          </View>
        </View>
        <View style={[styles.next]}>
          <TouchableOpacity
            onPress={handleFinish}
            disabled={0}
            style={styles.row}
          >
            <Text
              style={[styles.nextText, { color: 1 === 0 ? '#a5a5a5' : '#000' }]}
            >
              Finalizar
            </Text>
            <AntDesign
              style={styles.marginLeft}
              size={25}
              name="right"
              color={1 === 0 ? '#a5a5a5' : '#000'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  )
}

export default RateCustomer
