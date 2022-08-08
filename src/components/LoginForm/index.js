import React, { useState } from 'react'
import { Text, TextInput, KeyboardAvoidingView } from 'react-native'

import Button from '../../components/Button'

import { useAuth } from '../../hooks/AuthContext'
import { useUserData } from '../../hooks/UserContext'

import api from '../../services/api'
import { errorApi } from '../../utils/errorApi'

import { styles } from './styles'

function LoginForm() {
  const { signIn } = useAuth()
  const { loadProfile, userData } = useUserData()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const updateStatus = async () => {
    try {
      await api.patch(`/foodwalker/${userData.id}`, {
        ...userData,
        status: 'inactive',
      })
      loadProfile()
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const route = await signIn({
        email,
        password,
      })
      loadProfile()

      // history.push(route);
    } catch (err) {
      console.error(err)
      setIsLoading(false)
      alert(
        errorApi(
          err,
          'Ocorreu uma falha na autenticação. Verifique seus dados.',
        ),
      )
    } finally {
      // updateStatus()
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" style={styles.form}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu Email"
        keyboardType="email-address"
        autoComplete="email"
        value={email}
        onChangeText={(e) => setEmail(e)}
        onSubmitEditing={handleSubmit}
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua Senha"
        autoComplete="password"
        secureTextEntry={true}
        value={password}
        onChangeText={(e) => setPassword(e)}
        onSubmitEditing={handleSubmit}
      />
      {/* <Text style={styles.forgotPassword}>Esqueceu a senha?</Text> */}
      <Button
        style={styles.button}
        isLoading={isLoading}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {!isLoading && <Text style={styles.text}>Entrar</Text>}
      </Button>

      {/* <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ height: 20, marginRight: 5 }}>Lembrar-me</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#77dd77' }}
          thumbColor={switchEnabled ? '#28a745' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() =>
            setSwitchEnabled((previousState) => !previousState)
          }
          value={switchEnabled}
        />
      </View> */}
    </KeyboardAvoidingView>
  )
}

export default LoginForm
