import React, { useEffect, useState } from 'react'
import {
  View,
  Image,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import Layout from '../../layouts/Default'

import { useUserData } from '../../hooks/UserContext.js'

import { styles, buttonGroupStyles } from './styles'

import api from '../../services/api'
import { formatMoney } from '../../utils/format'
import Button from '../../components/Button'

import DefaultProfile from '../../assets/DefaultProfile.png'
import { Row, Table } from 'react-native-table-component'
import { errorApi } from '../../utils/errorApi'

function Dashboard({ route, navigation }) {
  const { userData } = useUserData()
  const [isLoading, setIsLoading] = useState(true)

  const [goals, setGoals] = useState([])
  const [foodwalker, setFoodwalker] = useState(null)
  const [selectedRevenue, setSelectedRevenue] = useState('Hoje')
  const [selectedGoal, setSelectedGoal] = useState('diaria')

  const [showRevenue, setShowRevenue] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const goals = await api.get('foodwalker/goals/get-active')
        const { data } = await api.get('foodwalker/dashboard')
        setFoodwalker(data.foodwalker)
        setGoals({
          diaria: goals.data.filter((goal) => goal.type === 'daily'),
          semanal: goals.data.filter((goal) => goal.type === 'weekly'),
          mensal: goals.data.filter((goal) => goal.type === 'monthly'),
        })
        setShowRevenue({
          Hoje: data.daily_revenue,
          Semana: data.weekly_revenue,
          Total: data.total_revenue,
        })
      } catch (err) {
        console.error(err)
        alert(errorApi(err, 'Ocorreu um erro ao carregar os dados do vendedor'))
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <Layout>
      <View style={[styles.view]}>
        {isLoading ? (
          <ActivityIndicator size="large" color={'#9f9f9f'} />
        ) : (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              height: '100%',
            }}
          >
            <View
              style={[
                styles.row,
                { alignItems: 'center' },
                styles.spaceBetween,
              ]}
            >
              <View style={styles.row}>
                <View style={[styles.column]}>
                  <Image
                    source={
                      userData.profile_picture
                        ? { uri: userData.profile_picture }
                        : DefaultProfile
                    }
                    style={styles.profilePicture}
                  />
                </View>
                <View
                  style={[styles.column, styles.marginLeft, styles.flexWrap]}
                >
                  <Text style={[styles.italic, styles.fontGray]}>Vendedor</Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Text style={styles.foodwalkerName}>{foodwalker.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>
                      <Text style={[styles.bold, styles.fontScore]}>
                        Pontos:{' '}
                      </Text>
                      <Text style={[styles.fontScore]}>{foodwalker.score}</Text>
                    </Text>
                    <View
                      style={[styles.column, styles.marginLeft, styles.center]}
                    >
                      <Text style={[styles.rank]}>Rank #{foodwalker.rank}</Text>
                      {/* <Text style={[styles.rank]}>Nv. Ninja</Text> */}
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <Text style={styles.header}>Faturamento</Text>
              <SafeAreaView style={buttonGroupStyles.container}>
                <View style={buttonGroupStyles.btnGroup}>
                  <Button
                    longPress={false}
                    style={[
                      buttonGroupStyles.btn,
                      selectedRevenue === 'Hoje' && buttonGroupStyles.active,
                      buttonGroupStyles.left,
                    ]}
                    onPress={() => setSelectedRevenue('Hoje')}
                  >
                    <Text
                      style={[
                        buttonGroupStyles.btnText,
                        selectedRevenue !== 'Hoje' && { color: '#000' },
                      ]}
                    >
                      Hoje
                    </Text>
                  </Button>
                  <Button
                    longPress={false}
                    style={[
                      buttonGroupStyles.btn,
                      selectedRevenue === 'Semana' && buttonGroupStyles.active,
                      buttonGroupStyles.middle,
                    ]}
                    onPress={() => setSelectedRevenue('Semana')}
                  >
                    <Text
                      style={[
                        buttonGroupStyles.btnText,
                        selectedRevenue !== 'Semana' && { color: '#000' },
                      ]}
                    >
                      Semana
                    </Text>
                  </Button>
                  <Button
                    longPress={false}
                    style={[
                      buttonGroupStyles.btn,
                      selectedRevenue === 'Total' && buttonGroupStyles.active,
                      buttonGroupStyles.right,
                    ]}
                    onPress={() => setSelectedRevenue('Total')}
                  >
                    <Text
                      style={[
                        buttonGroupStyles.btnText,
                        selectedRevenue !== 'Total' && { color: '#000' },
                      ]}
                    >
                      Total
                    </Text>
                  </Button>
                </View>
              </SafeAreaView>
              <View
                style={[
                  styles.spaceBetween,
                  styles.row,
                  styles.revenue,
                  styles.marginVertical,
                ]}
              >
                <Text style={styles.text}>Pago digitalmente:</Text>
                <Text style={styles.text}>
                  {formatMoney(showRevenue[selectedRevenue].total_digital || 0)}
                </Text>
              </View>
              <View
                style={[
                  styles.spaceBetween,
                  styles.row,
                  styles.revenue,
                  styles.marginBottom,
                ]}
              >
                <Text style={styles.text}>Pago em dinheiro:</Text>
                <Text style={styles.text}>
                  {formatMoney(showRevenue[selectedRevenue].total_money || 0)}
                </Text>
              </View>
              <View
                style={[
                  styles.spaceBetween,
                  styles.row,
                  styles.revenue,
                  styles.marginBottom,
                ]}
              >
                <Text style={styles.text}>Total vendido:</Text>
                <Text style={styles.text}>
                  {formatMoney(showRevenue[selectedRevenue].total || 0)}
                </Text>
              </View>
              <View
                style={[
                  styles.spaceBetween,
                  styles.row,
                  styles.revenue,
                  styles.marginBottom,
                ]}
              >
                <Text style={styles.text}>
                  Comissão ({foodwalker.comission}%):
                </Text>
                <Text style={styles.text}>
                  {formatMoney(showRevenue[selectedRevenue].comission || 0)}
                </Text>
              </View>
            </View>
            <Text style={styles.goalHeader}>Metas</Text>
            <SafeAreaView style={[buttonGroupStyles.container]}>
              <View style={buttonGroupStyles.btnGroup}>
                <Button
                  longPress={false}
                  style={[
                    buttonGroupStyles.btn,
                    selectedGoal === 'diaria' && buttonGroupStyles.active,
                    buttonGroupStyles.left,
                  ]}
                  onPress={() => setSelectedGoal('diaria')}
                >
                  <Text
                    style={[
                      buttonGroupStyles.btnText,
                      selectedGoal !== 'diaria' && { color: '#000' },
                    ]}
                  >
                    Diária
                  </Text>
                </Button>
                <Button
                  longPress={false}
                  style={[
                    buttonGroupStyles.btn,
                    selectedGoal === 'semanal' && buttonGroupStyles.active,
                    buttonGroupStyles.middle,
                  ]}
                  onPress={() => setSelectedGoal('semanal')}
                >
                  <Text
                    style={[
                      buttonGroupStyles.btnText,
                      selectedGoal !== 'semanal' && { color: '#000' },
                    ]}
                  >
                    Semanal
                  </Text>
                </Button>
                <Button
                  longPress={false}
                  style={[
                    buttonGroupStyles.btn,
                    selectedGoal === 'mensal' && buttonGroupStyles.active,
                    buttonGroupStyles.right,
                  ]}
                  onPress={() => setSelectedGoal('mensal')}
                >
                  <Text
                    style={[
                      buttonGroupStyles.btnText,
                      selectedGoal !== 'mensal' && { color: '#000' },
                    ]}
                  >
                    Mensal
                  </Text>
                </Button>
              </View>
            </SafeAreaView>
            <Table style={styles.marginTop}>
              <Row
                data={['Nível', 'Vendido', 'Total', '%']}
                textStyle={[
                  styles.bold,
                  { fontSize: 16, paddingHorizontal: 10, textAlign: 'center' },
                ]}
              />
              <ScrollView style={{ height: '20%' }}>
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
                      textAlign={'right'}
                    />
                  ))
                ) : (
                  <Text style={styles.emptyGoal}>
                    Não há nenhuma meta cadastrada...
                  </Text>
                )}
              </ScrollView>
            </Table>
          </View>
        )}
      </View>
    </Layout>
  )
}

export default Dashboard
