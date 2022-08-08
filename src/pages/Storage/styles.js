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
    borderRadius: 0,
    borderTopRightRadius: 45,
    borderBottomRightRadius: 45,
  },
  removeButton: {
    borderRadius: 0,
    borderTopLeftRadius: 45,
    borderBottomLeftRadius: 45,
    backgroundColor: '#ff2239',
  },
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
  refreshButton: {
    backgroundColor: '#28a745',
    borderRadius: 45,
    position: 'absolute',
    width: 50,
    height: 50,
    top: 20,
    left: 20,
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
    width: 65,
    height: 40,
    borderRadius: 15,
    paddingHorizontal: 5,
  },
})

export const styles = StyleSheet.create({
  centralize: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessageContainer: {
    backgroundColor: '#fff',
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '80%',
    height: '20%',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },

  emptyMessageWrapper: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  buttonArea: {
    width: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    color: '#0f0f0f',
  },
  end: {
    justifyContent: 'flex-end',
    width: '100%',
  },
  start: {
    justifyContent: 'flex-start',
    width: '100%',
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
  scrollView: {
    width: '90%',
    marginTop: 20,
    marginBottom: 80,
  },
  modalScrollView: {
    width: '90%',
    marginBottom: 15,
  },
  fontBold: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  fontItalic: {
    fontStyle: 'italic',
    fontSize: 12,
  },
  fontNormal: {
    fontWeight: 'normal',
    fontSize: 14,
  },
  fontTitle: {
    fontSize: 16,
  },
  spaceAround: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: 110,
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
    shadowRadius: 3.5,
    elevation: 5,
  },

  paddingHorizontal: {
    paddingHorizontal: 5,
  },
})
