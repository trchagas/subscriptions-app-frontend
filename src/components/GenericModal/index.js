import React, { useState } from 'react'
import { Modal, Text, ActivityIndicator, View } from 'react-native'

import Button from '../../components/Button'
import { errorApi } from '../../utils/errorApi'

import { styles } from './styles'

const GenericModal = ({
  children,
  action,
  show,
  closeModal,
  title,
  showConfirm = true,
  label = 'Confirmar',
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      await action()
    } catch (err) {
      console.error(err)
      alert(errorApi(err, 'Ocorreu um erro ao finalizar a requisição.'))
    }
    setIsLoading(false)
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, styles.column]}>
          <Text style={styles.title}>{title}</Text>
          {children}
          <View style={styles.buttonGroup}>
            <Button
              onPress={closeModal}
              disabled={isLoading}
              style={[styles.button, styles.buttonClose]}
            >
              <Text style={styles.whiteFont}>Cancelar</Text>
            </Button>
            {showConfirm && (
              <Button
                onPress={handleSubmit}
                isLoading={isLoading}
                disabled={isLoading}
                style={[styles.button, styles.buttonSucess]}
              >
                <Text style={styles.whiteFont}>{label}</Text>
              </Button>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default GenericModal
