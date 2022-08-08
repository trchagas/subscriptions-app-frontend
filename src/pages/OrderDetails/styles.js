import { StyleSheet } from 'react-native'
import { justifyContent, paddingRight } from 'styled-system'

export const buttonStyles = {
  button: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  cancelButton: {
    paddingLeft: 20,
    backgroundColor: '#ff2239',
    width: 100,
  },

  confirmButton: {
    backgroundColor: '#28a745',
    width: 100,
  },

  completeButton: {
    backgroundColor: '#28a745',
    width: 145,
  },

  editButton: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#999',
    padding: 5,
    marginLeft: 10,
    backgroundColor: '#aaa',
  },
}

export const styles = StyleSheet.create({
  paymentModal: {
    width: '100%',
    paddingBottom: 10,
    marginBottom: 10,
  },

  paymentOption: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 15,
  },

  nullCustomer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 20,
  },

  nullCustomerTxt: {
    fontSize: 18,
    fontStyle: 'italic',
  },

  view: {
    width: '100%',
    height: '100%',
    backgroundColor: '#dfdfdf',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    // borderRadius: 15,
    // height: '90%',
    // minWidth: '90%',
    height: '100%',
    minWidth: '100%',
  },

  row: {
    flexDirection: 'row',
  },

  column: {
    flexDirection: 'column',
  },

  customerReview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  reviewCounterText: {
    color: '#aaa',
    marginLeft: 10,
    fontSize: 18,
  },

  h1: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 30,
  },

  h2: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  p: {
    fontSize: 20,
  },

  addressDetails: {
    marginLeft: 10,
  },

  orderItemsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  table: {
    paddingVertical: 20,

    paddingTop: 15,
  },

  items: {
    marginLeft: 10,
  },

  total: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  hstack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  },

  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  spaceBetween: {
    flex: 1,
    justifyContent: 'space-between',
  },

  marginBottom: {
    marginBottom: 20,
  },

  bold: {
    fontWeight: 'bold',
  },

  paddingVertical: {
    paddingVertical: 15,
  },

  marginHorizontalAuto: {
    marginRight: 'auto',
    marginLeft: 'auto',
  },

  buttonGroup: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  whiteFont: {
    color: '#fff',
  },

  upper: {
    textTransform: 'uppercase',
  },

  paymentMethodHeader: {
    fontWeight: 'bold',

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

  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },

  customerReview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  reviewCounterText: {
    color: '#aaa',
    marginLeft: 10,
    fontSize: 18,
  },

  userCardCol2: {
    paddingLeft: 10,
  },

  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  userCard: {
    flexDirection: 'row',
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 20,
  },

  header: {
    fontSize: 22,

    fontWeight: 'bold',
  },
})
