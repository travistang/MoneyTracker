import React from 'react'
import { connect } from 'react-redux'

import {
  ScrollView,
  StyleSheet
} from 'react-native'

import {
  View,
  Text
} from 'react-native-ui-lib'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { colors } from '../config'
import {
  Card,
  Button,
  TextInput,
  List,
  Checkbox
} from 'react-native-paper'
import {
  getAccountsList,
  getSurplusForAccount,
  getAccountErrorMessage
} from '../store'
import { getTextInputComponent } from '../utils'
import * as Actions from '../actions'

class AccountsPage extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Icon name="email" size={32} color={tintColor} />
    )
  }
  constructor(props) {
    super(props)
    this.defaultFormState = {
      name: "",
      currency: ""
    }
    this.defaultTransferFormState = {
      name: "",
      fromAccount: "",
      toAccount: "",
      amount: "",
      multiplier: "",
    }

    this.state = {
      adding: false,
      form: this.defaultFormState,
      transferForm: this.defaultTransferFormState
    }

    this.getTextInputComponent = getTextInputComponent.bind(this,this)
  }
  getAccountCard(accountName) {
    const surplus = getSurplusForAccount(this.props.transactions, accountName)
    return (
      <List.Item
        title={accountName}
        right={props => <Text>{surplus}</Text>}
      />
    )
  }
  addAccountCard() {
    return (
      <Card>
        <Card.Content>
          <CardHeader icon="add" text="Add an account" />
        {
          this.getTextInputComponent(
            "Name",
            "name",
            "form",
            {mode: "outlined"}
          )
        }
        {
          this.getTextInputComponent(
            "Currency",
            "currency",
            "form",
            {mode: "outlined"}
          )
        }
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() => this.setState({adding: false})}
            icon="remove"
            style={style.actions}>
            Cancel
          </Button>
          <Button
            onPress={this.addAccount.bind(this)}
            mode="contained"
            icon="add"
            style={style.actions}
          >
            Add Account
          </Button>
        </Card.Actions>
      </Card>
    )
  }
  accountListCard() {
    return (
      <Card>
        <Card.Content>
          <CardHeader icon="email" text="Accounts" />
          <ScrollView>
            {
              getAccountsList(this.props.accounts)
                .map(acc => this.getAccountCard(acc))
            }
          </ScrollView>
          <Button mode="contained"
            icon="add"
            onPress={() => this.setState({adding: true})}
          >
          Add Account
          </Button>

          <Button mode="contained"
            icon="add"
          >
          Transfer
          </Button>
        </Card.Content>
      </Card>
    )
  }
  addAccount() {

    const error = getAccountErrorMessage(
      this.props.accounts,
      this.state.form)

    if(error) {
      alert(error)
      return
    }
    const account = {
      ...this.state.form,
      currency: this.state.form.currency.toUpperCase()
    }
    this.props.addAccount(account)
    this.setState({form: this.defaultFormState})
  }
  render() {
    return (
      <View flex-1 style={style.container}>
        {this.state.adding?(
          this.addAccountCard()
        ):(
          this.accountListCard()
        )
        }
      </View>

    )
  }
}
const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({
  addAccount: (account) => dispatch({
    type: Actions.ADD_ACCOUNT,
    account
  }),
  setAccount: (accounts) => dispatch({
    type: Actions.SET_ACCOUNTS,
    accounts
  })
})
export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage)
const style = StyleSheet.create({
  container: {
    padding: 16
  },
  actions: {
    flex: 1
  }
})
