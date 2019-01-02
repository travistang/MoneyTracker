import React from 'react'
import { StyleSheet } from 'react-native'
import {
  List,
  Text
} from 'react-native-paper'
import { dollarString } from '../config'
export default class TransactionRecord extends React.Component {
  isExpenditure() {
    return this.props.transaction.amount < 0
  }
  getTransactionAmountStyle(amount) {
    const loss = amount < 0
    const style = {
      color: loss?'red':((amount == 0)?'gray':'green') // 0: gray, <0: red, >0: green
    }
    return style
  }
  getLeftItem(transaction) {
    const { date } = transaction,
          dateObject = new Date(date),
          hour = dateObject.getHours(),
          minutes = dateObject.getMinutes(),
          formatNumber = (n) => n.toString().padStart(2,'0')
    return (
      <Text style={style.sideContainer}> {formatNumber(hour)}:{formatNumber(minutes)} </Text>
    )
  }
  getRightItem(transaction) {
    return (
      <Text style={{
          ...style.sideContainer,
          ...this.getTransactionAmountStyle(transaction.amount)
      }}>
        {dollarString(transaction.amount)}
      </Text>
    )
  }
  render() {
    const transaction = this.props.transaction
    return (
      <List.Item
        title={transaction.name}
        description={transaction.account}
        left={props => this.getLeftItem(transaction) }
        right={props => this.getRightItem(transaction)}
      />
    )
  }
}
const style = StyleSheet.create({
  sideContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold'
  }
})
