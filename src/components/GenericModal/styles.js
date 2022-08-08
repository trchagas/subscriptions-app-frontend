import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  buttonGroup: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  column: {
    flexDirection: 'column',
    display: 'flex',
  },
  button: {
    height: '100%',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#ff2239',
  },
  buttonSucess: {
    backgroundColor: '#3ac967',
  },
  modalView: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 10,
    marginBottom: 15,
    width: '100%',
    borderBottomColor: '#999',
    borderBottomWidth: 1,
  },
  whiteFont: {
    color: '#fff',
  },
})
