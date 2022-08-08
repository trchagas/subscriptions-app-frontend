import React, { useEffect, useState } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
  TextInput,
} from 'react-native'
import {
  requestMediaLibraryPermissionsAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from 'expo-image-picker'
import { parseISO, format, isValid, isBefore, parse } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'

import Layout from '../../layouts/Default'

import { useUserData } from '../../hooks/UserContext'
import { styles, buttonStyles } from './styles'

import api from '../../services/api'
import Button from '../../components/Button'
import Profile from '../../assets/DefaultProfile.png'

import { Entypo } from '@expo/vector-icons'
import { formatDate, formatPhone } from '../../utils/format'
import { errorApi } from '../../utils/errorApi'

function Dashboard({ navigation }) {
  const { loadProfile } = useUserData()

  const [user, setUser] = useState({})
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [editMode, setEditMode] = useState(false)

  const [birth, setBirth] = useState(null)
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [phone, setPhone] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await api.get('/foodwalker')
        setImage(data.profile_picture)
        setUser(data)
        const birth = format(parseISO(data.birth), 'dd/MM/yyyy', {
          locale: pt,
        })
        setBirth(birth)
        setName(data.name)
        setEmail(data.email)
        setPhone(data.phone)
      } catch (err) {
        console.error(err)
        alert(errorApi(e, 'Ocorreu um erro ao carregar os dados do vendedor'))
      } finally {
        setIsLoading(false)
      }
    }
    async function ImagePermission() {
      if (Platform.OS !== 'web') {
        const { status } = await requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    }

    loadData()
    ImagePermission()
  }, [])

  const uploadImage = async (image) => {
    try {
      const filename = image.uri.split('/').pop()

      // Infer the type of the image
      const match = /\.(\w+)$/.exec(filename)
      const type = match ? `image/${match[1]}` : `image`

      // Upload the image using the fetch and FormData APIs
      const formData = new FormData()
      formData.append(
        'profile_picture',
        {
          uri: image.uri,
          type,
          name: filename,
        },
        filename,
      )

      await api.post('/user/profile-pictures', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      loadProfile()
    } catch (e) {
      console.error(e)
      setImage(null)
      alert(errorApi(e, 'Ocorreu um erro ao salvar a foto de perfil...'))
    }
  }

  const pickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      setImage(result.uri)
      await uploadImage(result)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const now = new Date()

    const parsedDate = parse(birth, 'P', now, { locale: pt })
    if (!(isValid(parsedDate) && isBefore(parsedDate, now))) {
      alert('Data de nascimento inválida')
      return
    }

    setIsLoading(true)

    try {
      const newUserData = {
        ...user,
        name,
        email,
        phone,
        birth: birth.split('/').reverse().join('-'),
      }
      await api.put(`/foodwalker/${user.id}`, newUserData)

      setUser(newUserData)
      setEditMode(false)
      loadProfile()
    } catch (err) {
      alert(errorApi(err, 'Ocorreu um erro ao salvar as informações.'))
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    setUser(user)
    const birth = format(parseISO(user.birth), 'dd/MM/yyyy', {
      locale: pt,
    })
    setBirth(birth)
    setName(user.name)
    setEmail(user.email)
    setPhone(user.phone)
  }

  return (
    <Layout>
      <View style={[styles.main]}>
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#aaa" />
          </View>
        ) : (
          <>
            <View style={styles.nameInfo}>
              <View style={[styles.row]}>
                <View>
                  <Image
                    source={image ? { uri: image } : Profile}
                    style={[styles.profilePicture]}
                  />
                  <TouchableOpacity
                    style={styles.changeProfilePictureIcon}
                    onPress={pickImage}
                  >
                    <Entypo name="upload" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text
                  style={[styles.italic, styles.fontGray, styles.marginTop]}
                >
                  Vendedor
                </Text>
                {editMode ? (
                  <TextInput
                    style={styles.foodwalkerNameInput}
                    placeholder="Nome"
                    autoComplete="name"
                    value={name}
                    onChangeText={(e) => setName(e)}
                    onSubmitEditing={handleSubmit}
                  />
                ) : (
                  <Text style={styles.foodwalkerName}>{user.name}</Text>
                )}
              </View>
            </View>
            <View style={styles.containerInfo}>
              {!editMode ? (
                <>
                  <View>
                    <View style={[styles.userInfo]}>
                      <Entypo name="cake" color="#888" size={20} />
                      <Text style={[styles.fontSizeText, styles.fontGray]}>
                        {'  ' +
                          format(parseISO(user.birth), 'dd/MM/yyyy', {
                            locale: pt,
                          })}
                      </Text>
                    </View>
                    <View style={[styles.userInfo]}>
                      <Entypo name="mail" color="#888" size={20} />
                      <Text style={[styles.fontSizeText, styles.fontGray]}>
                        {'  ' + user.email}
                      </Text>
                    </View>
                    <View style={[styles.userInfo]}>
                      <Entypo name="phone" color="#888" size={20} />
                      <Text style={[styles.fontSizeText, styles.fontGray]}>
                        {'  ' + formatPhone(user.phone)}
                      </Text>
                    </View>
                  </View>
                  <Button
                    style={buttonStyles.editButton}
                    onPress={() => setEditMode(true)}
                  >
                    <Text style={buttonStyles.editBtnText}>Editar</Text>
                  </Button>
                </>
              ) : (
                <>
                  <View style={styles.form}>
                    <TextInput
                      style={styles.input}
                      placeholder="Aniversário"
                      autoComplete="birthdate-full"
                      value={formatDate(birth)}
                      onChangeText={(e) => setBirth(e)}
                      onSubmitEditing={handleSubmit}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChangeText={(e) => setEmail(e)}
                      onSubmitEditing={handleSubmit}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Telefone"
                      autoComplete="tel"
                      value={formatPhone(phone)}
                      onChangeText={(e) => setPhone(e)}
                      onSubmitEditing={handleSubmit}
                    />
                  </View>
                  <View style={buttonStyles.btnGroup}>
                    <Button
                      style={buttonStyles.cancelBtn}
                      onPress={handleCancel}
                    >
                      <Text style={buttonStyles.cancelBtnText}>Cancelar</Text>
                    </Button>
                    <Button
                      style={buttonStyles.editButton}
                      onPress={handleSubmit}
                    >
                      <Text style={buttonStyles.editBtnText}>Salvar</Text>
                    </Button>
                  </View>
                </>
              )}
            </View>
          </>
        )}
      </View>
    </Layout>
  )
}

export default Dashboard
