import { StyleSheet } from 'react-native'

export const buttonStyles = StyleSheet.create({
  quantityButton: {
    height: 30,
    width: 30,
  },
  selectButton: {
    margin: 20,
    height: 40,
    width: 100,
    borderRadius: 30,
    backgroundColor: '#28a745',
  },
  incrementButton: {
    backgroundColor: '#3ac967',
  },
  removeButton: {
    backgroundColor: '#ff2239',
  },
  deleteButton: { marginTop: -5 },
  bagButton: {
    backgroundColor: '#28a745',
    borderRadius: 45,
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 20,
    left: 20,
  },
  addButton: {
    backgroundColor: '#28a745',
    borderRadius: 45,
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 20,
    right: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    position: 'absolute',
    width: 120,
    height: 40,
    borderRadius: 15,
    bottom: 25,
  },
  buttonImage: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  activeButton: {
    backgroundColor: '#28a745',
    width: 50,
    height: 40,
    borderRadius: 15,
    paddingHorizontal: 5,
  },

  confirmationButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 40,
    borderRadius: 15,
    paddingHorizontal: 5,
  },
})

export const styles = StyleSheet.create({
  reservedTxt: {
    fontSize: 14,
    fontStyle: 'italic',
  },

  noBagContainer: {
    backgroundColor: '#fff',
    width: '80%',
    height: '15%',
    borderRadius: 10,
  },

  noBagWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  button: {
    backgroundColor: '#28a745',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 30,
  },

  label: {
    color: '#fff',
  },

  text: {
    textAlign: 'center',
    fontSize: 15,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },

  scrollView: {
    width: '90%',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: 120,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
  },

  emptyMessageContainer: {
    backgroundColor: '#fff',
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '80%',
    height: '15%',
    borderRadius: 10,
  },

  emptyMessageWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  emptyMessage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bagCard: {
    backgroundColor: '#efefef',
    alignItems: 'center',
    width: '100%',
    height: 100,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  bagInfo: {
    width: '80%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  bagName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  bagSize: {
    fontWeight: '100',
    fontSize: 12,
  },
  contentArea: {
    flex: 2,
    height: '100%',
    display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },
  buttonArea: {
    width: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  end: {
    justifyContent: 'flex-end',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between',
    color: '#0f0f0f',
  },
  columnSpaceBetween: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#0f0f0f',
    width: 50,
    height: '100%',
  },
  left: {
    marginLeft: 'auto',
  },
  label: {
    color: '#fff',
  },
  scrollView: { width: '90%', marginVertical: 20 },
  modalScrollView: {
    width: '90%',
    marginBottom: 15,
  },
  fontBold: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  fontNormal: {
    fontWeight: 'normal',
    fontSize: 14,
  },
  spaceAround: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  quantity: {
    paddingRight: 10,
  },
  card: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: 120,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
  },
  itemCard: {
    backgroundColor: '#dfdfdf',
    alignItems: 'center',
    width: '100%',
    height: 100,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  status: {
    height: '100%',
    flex: 2,
  },
  productImage: {
    width: '20%',
  },
  whiteFont: {
    color: '#fff',
  },
  blackFont: {
    color: '#000',
  },
  fontTitle: {
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  counterValue: {
    paddingRight: 3,
  },

  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.5,
    elevation: 5,
  },
  paddingHorizontal: {
    paddingHorizontal: 5,
  },

  totalValueContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: 80,
    paddingHorizontal: 15,
  },

  totalValueText: {
    fontSize: 20,
  },

  bold: {
    fontWeight: 'bold',
  },

  marginLeft: {
    marginLeft: 5,
  },
})
