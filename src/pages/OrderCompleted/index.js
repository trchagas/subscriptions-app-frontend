import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'

import Layout from '../../layouts/Default'
import { styles, buttonStyles } from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons'
import LottieView from 'lottie-react-native'

import { Table, Row } from 'react-native-table-component'

import Button from '../../components/Button'

import Checkmark from '../../assets/lottieAssets/checkmark.json'
import { formatMoney } from '../../utils/format'
import api from '../../services/api'
import { errorApi } from '../../utils/errorApi'

function OrderCompleted({ navigation, route }) {
  const { customer } = route.params
  const { score, old_score, total, id } = route.params.order

  const [goals, setGoals] = useState({
    diaria: [],
    semanal: [],
    mensal: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGoal, setSelectedGoal] = useState('diaria')

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await api.get('/foodwalker/goals/get-active')
        setGoals({
          diaria: data.filter((goal) => goal.type === 'daily'),
          semanal: data.filter((goal) => goal.type === 'weekly'),
          mensal: data.filter((goal) => goal.type === 'monthly'),
        })
      } catch (e) {
        console.error(e)
        alert(errorApi(e, 'Ocorreu um erro ao carregar as metas.'))
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <Layout>
      <View style={styles.view}>
        {/* {!isLoading && ( */}
        <View style={styles.checkmarkContainer}>
          <LottieView
            source={Checkmark}
            autoPlay
            style={styles.checkmark}
            loop={false}
          />
        </View>
        <View style={[styles.row, styles.marginVertical]}>
          <Text style={styles.h2}>Valor do pedido: </Text>
          <Text style={styles.valueText}>{formatMoney(total)}</Text>
        </View>

        <View style={{ paddingHorizontal: 15, flex: 2 }}>
          <Text style={styles.h2}>Metas em andamento:</Text>

          <SafeAreaView style={buttonStyles.container}>
            <View style={buttonStyles.btnGroup}>
              <Button
                longPress={false}
                style={[
                  buttonStyles.btn,
                  selectedGoal === 'diaria' && buttonStyles.active,
                  buttonStyles.left,
                ]}
                onPress={() => setSelectedGoal('diaria')}
              >
                <Text
                  style={[
                    buttonStyles.btnText,
                    selectedGoal !== 'diaria' && { color: '#000' },
                  ]}
                >
                  Diária
                </Text>
              </Button>
              <Button
                longPress={false}
                style={[
                  buttonStyles.btn,
                  selectedGoal === 'semanal' && buttonStyles.active,
                  buttonStyles.middle,
                ]}
                onPress={() => setSelectedGoal('semanal')}
              >
                <Text
                  style={[
                    buttonStyles.btnText,
                    selectedGoal !== 'semanal' && { color: '#000' },
                  ]}
                >
                  Semanal
                </Text>
              </Button>
              <Button
                longPress={false}
                style={[
                  buttonStyles.btn,
                  selectedGoal === 'mensal' && buttonStyles.active,
                  buttonStyles.right,
                ]}
                onPress={() => setSelectedGoal('mensal')}
              >
                <Text
                  style={[
                    buttonStyles.btnText,
                    selectedGoal !== 'mensal' && { color: '#000' },
                  ]}
                >
                  Mensal
                </Text>
              </Button>
            </View>
          </SafeAreaView>
          <Table style={{ marginTop: 10 }}>
            <Row
              data={['Nível', 'Vendido', 'Total', '%']}
              textStyle={[
                styles.bold,
                { fontSize: 16, paddingHorizontal: 10, textAlign: 'center' },
              ]}
            />
            <ScrollView style={{ height: '60%' }}>
              {isLoading ? (
                <ActivityIndicator
                  style={{ margin: 15 }}
                  size="large"
                  color={'#aaa'}
                />
              ) : (
                <>
                  {goals[selectedGoal].length > 0 ? (
                    goals[selectedGoal].map((goal, index) => (
                      <Row
                        key={index}
                        data={[
                          goal.name,
                          formatMoney(goal.current_value),
                          formatMoney(goal.total_value),
                          parseFloat(
                            (goal.current_value / goal.total_value) * 100,
                          ).toFixed(2) + '%',
                        ]}
                        style={[
                          styles.goal,
                          {
                            backgroundColor:
                              goal.total_value - goal.current_value <= 0
                                ? '#28a745'
                                : '#dc3545',
                          },
                        ]}
                        textStyle={[styles.text, { textAlign: 'center' }]}
                      />
                    ))
                  ) : (
                    <Text style={styles.emptyGoal}>
                      Não há nenhuma meta cadastrada...
                    </Text>
                  )}
                </>
              )}
            </ScrollView>
          </Table>
        </View>
        <View>
          <View style={[styles.scoreRow]}>
            <Text style={styles.h2}>Pontuação atual: </Text>
            <Text style={styles.valueText}>{old_score}</Text>
          </View>
          <View style={[styles.scoreRow]}>
            <Text style={styles.h2}>Pontuação do pedido: </Text>
            <Text style={styles.valueText}>{score}</Text>
          </View>
          <View style={[styles.scoreRow]}>
            <Text style={styles.h2}>Total: </Text>
            <Text style={[styles.valueText, styles.bold]}>
              {Number(old_score) + Number(score)}
            </Text>
          </View>
        </View>
        <View style={[styles.next]}>
          <TouchableOpacity
            onPress={() =>
              customer
                ? navigation.navigate('Avaliar Cliente', {
                    customer,
                    order: { id },
                  })
                : navigation.navigate('Inicio')
            }
            disabled={0}
            style={styles.row}
          >
            <Text
              style={[styles.nextText, { color: 1 === 0 ? '#a5a5a5' : '#000' }]}
            >
              {customer ? 'Seguinte' : 'Finalizar Pedido'}
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

export default OrderCompleted
