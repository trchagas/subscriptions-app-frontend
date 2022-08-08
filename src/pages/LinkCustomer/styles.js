import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },

  header: {
    fontSize: 22,
    paddingLeft: 15,
    paddingVertical: 15,
    fontWeight: 'bold',
  },

  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
    paddingLeft: 15,
  },

  radioButtonText: {
    fontSize: 18,
  },

  searchBar: {
    marginHorizontal: 20,
  },

  mainView: {
    width: '100%',
    backgroundColor: '#fff',
  },

  scrollView: {
    maxHeight: 150,
    marginHorizontal: 20,
  },

  userCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
    borderRadius: 15,
    padding: 10,
    marginTop: 10,
  },

  selectedUserCard: {
    marginHorizontal: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
    borderRadius: 15,
    padding: 10,
  },

  userCardCol2: {
    paddingLeft: 10,
  },

  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },

  next: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#fff',
    //borderTopWidth: 1,
    //borderTopColor: '#a5a5a5',
    width: '100%',
    height: 80,
    paddingHorizontal: 15,
    display: 'flex',
  },

  nextText: {
    fontSize: 20,
    color: '#fff',
  },

  marginLeft: {
    marginLeft: 5,
  },

  paymentContainer: {
    marginTop: 15,
  },

  paymentMethod: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 15,
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
    marginBottom: 10,
  },

  reviewCounterText: {
    color: '#aaa',
    marginLeft: 10,
    fontSize: 18,
  },

  cancelBtn: {
    marginLeft: 'auto',
    marginRight: 10,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#FE5767',
  },
})
