import React from 'react'
import {
  Card,
  Button,
  Title, Paragraph,
  TextInput,
  List,
  Checkbox
} from 'react-native-paper'
import {
  StyleSheet, Platform,
  Text,
} from 'react-native'
import {
  View,
  TagsInput,
  Picker
} from 'react-native-ui-lib'
import CardHeader from './CardHeader'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { dollarString } from '../config'
import {
  getSurplusForAccount,
  getAccountsList,
  getTransactionErrorMessage,
  getSurplusStringRepresentationForAccount
} from '../store'
import { colors } from '../config'

export default class SummaryCard extends React.Component {
  constructor(props) {
    super(props)
    this.defaultFormState = {
      name: "",
      amount: "",
      isExpenditure: true,
      account: null, // undefined account
      tags: []
    }
    this.state = {
      adding: false,
      form: this.defaultFormState
    }
  }
  getSurplus() {
    return getSurplusForAccount(this.props.transactions, this.props.mainAccount)
  }
  isDeficit() {
    return this.getSurplus() < 0
  }

  addTransaction() {
    const errorMessage = getTransactionErrorMessage(this.state.form)
    if(errorMessage) {
      alert(errorMessage)
      return
    }
    const transaction = {
      ...this.state.form,
      amount: Number(this.state.form.amount) * (this.state.form.isExpenditure?(-1):1),
      date: new Date().toString()
    }
    // add to the store
    this.props.addTransaction(transaction)
    // reset UI and form
    this.setState({
      // adding: false,
      form: this.defaultFormState
    })
  }
  render() {
    if(this.state.adding) {
      const { isExpenditure } = this.state.form
      return (
        <Card style={style.container}>
          <Card.Content>
            <CardHeader icon="edit" text="Add a transaction" />
            <TextInput
              label="Name"
              mode="outlined"
              value={this.state.form.name}
              onChangeText={name => this.setState({
                form: {...this.state.form, name}
              })}
              style={{margin: 8}}
            />
            <TextInput
              label="Amount"
              mode="outlined"
              keyboardType="numeric"
              value={this.state.form.amount}
              onChangeText={amount => this.setState({
                form: {...this.state.form, amount}
              })}
              style={{margin: 8}}
            />
            <Picker
              hideUnderline
              placeholder="Transaction from account"
              value={this.state.form.account}
              enableModalBlur={false}
              onChange={account => this.setState({
                form: {...this.state.form, account: account.value}
              })}
              containerStyle={{margin: 8}}
              searchPlaceholder="Select the account to use for this transactions"
              style={{
                backgroundColor: colors.surface,
                color: colors.text
              }}
              searchStyle={{
                backgroundColor: colors.surface,
                color: colors.text,
                placeholderTextColor: colors.placeholder
              }}
            >
              {
                getAccountsList(this.props.accounts)
                  .map(acc => (
                    <Picker.Item key={acc} value={acc} label={acc} />
                  ))
              }
            </Picker>

            <List.Item
              title="Is Expenditure"
              right={props => (
                <Checkbox status={isExpenditure? "checked": "unchecked"}
                  onPress={() => this.setState({form: {...this.state.form, isExpenditure: !isExpenditure}})}
                />
              )}

            />
          </Card.Content>
          <Card.Actions>
            <Button
              onPress={() => this.setState({adding: false})}
              icon="remove"
              style={style.actions}>
              Cancel
            </Button>
            <Button
              onPress={this.addTransaction.bind(this)}
              mode="contained"
              icon="add"
              style={style.actions}
            >
              Add
            </Button>
          </Card.Actions>
        </Card>
      )
    } else return (
      <Card style={style.container}>
        <Card.Content>
          <CardHeader text="Summary" icon="home" />
          <Text style={this.isDeficit()?style.deficitText:style.surplusText}>
            {getSurplusStringRepresentationForAccount(
              this.props.transactions,
              this.props.accounts,
              this.props.mainAccount
            )}
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            icon="add"
            style={style.actions}
            onPress={() => this.setState({adding: true})}
          >
            Add
          </Button>
        </Card.Actions>
      </Card>
    )
  }
}

const style = StyleSheet.create({
  container: {
    marginTop: (Platform.OS === 'ios')?52:0,
    marginBottom: 16,
  },
  actions: {
    flex: 1
  },
  surplusText: {
    fontWeight: 'bold',
    fontSize: 36,
    textAlign: 'center',
    color: "green"
  },
  deficitText: {
    fontWeight: 'bold',
    fontSize: 36,
    textAlign: 'center',
    color: "red"
  }
})
