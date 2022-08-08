import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },

  row: {
    flexDirection: 'row',
  },

  customerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 15,
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

  customerNameText: {
    fontSize: 16,
    marginVertical: 10,
  },

  profilePicture: {
    width: 125,
    height: 125,
    borderRadius: 100,
  },

  rateCustomerContainer: {
    backgroundColor: '#eee',
    borderRadius: 15,

    marginTop: 30,
    marginHorizontal: 20,
    padding: 20,
  },

  messageText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 15,
  },
})
