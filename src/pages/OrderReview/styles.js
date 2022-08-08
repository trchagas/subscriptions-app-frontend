import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  row: {
    flexDirection: 'row',
  },

  header: {
    fontSize: 22,
    paddingLeft: 15,
    paddingTop: 15,
    fontWeight: 'bold',
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 20,
    marginHorizontal: 10,
  },

  userCardCol2: {
    height: 90,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: 10,
  },

  userName: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
  },

  balance: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },

  next: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: 80,
    paddingHorizontal: 15,
    display: 'flex',
  },

  nextText: {
    fontSize: 20,
  },

  marginLeft: {
    marginLeft: 5,
  },

  table: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  tableRow: { paddingTop: 5 },

  total: {
    fontWeight: 'bold',
    paddingLeft: 10,
    fontSize: 18,
  },

  bold: {
    fontWeight: 'bold',
  },

  paymentMethodHeader: {
    fontWeight: 'bold',
    paddingLeft: 10,
    fontSize: 18,
    marginRight: 20,
  },

  paymentMethodContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  paymentMethodIcon: {
    width: 20,
    height: 20,
  },

  paymentMethodText: {
    marginLeft: 20,
    fontSize: 18,
  },

  customerReview: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reviewCounterText: {
    color: '#aaa',
    marginLeft: 10,
    fontSize: 18,
  },

  nullCustomer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  nullCustomerTxt: {
    fontSize: 18,
    fontStyle: 'italic',
  },

  modal: {
    width: '100%',
    padding: 5,
    marginBottom: 15,
  },

  modalTxt: {
    fontSize: 16,
  },
})
