import React from 'react'
import { connect } from 'react-redux'

import {
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native'

import {
  View,
  Text
} from 'react-native-ui-lib'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { colors, icons } from '../config'
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
import { buildForm, getTextInputComponent } from '../utils'
import * as Actions from '../actions'

class AccountsPage extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Icon name="email" size={32} color={tintColor} />
    )
  }
  static Mode = {
    adding: "adding",
    transfer: "transfer"
  }

  constructor(props) {
    super(props)
    this.defaultFormState = {
      name: "",
      currency: ""
    }
    this.defaultTransferFormState = {
      name: "",
      from: "",
      to: "",
      amount: "",
      multiplier: "",
    }

    this.state = {
      mode: null,
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
      <Card style={style.topContainer}>
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
          <Button flex
            onPress={this.toNormalMode.bind(this)}
            icon={icons.remove}
            style={style.actions}>
            Cancel
          </Button>
          <Button flex
            onPress={this.addAccount.bind(this)}
            mode="contained"
            icon={icons.add}
            style={style.actions}
          >
            Add Account
          </Button>
        </Card.Actions>
      </Card>
    )
  }
  toAddingMode() {
    this.setState({
      mode: AccountsPage.Mode.adding
    })
  }
  toTransferMode() {
    this.setState({
      mode: AccountsPage.Mode.transfer
    })
  }
  toNormalMode() {
    this.setState({
      mode: null
    })
  }

  accountListCard() {
    return (
      <Card style={style.topContainer}>
        <Card.Content>
          <CardHeader icon="email" text="Accounts" />
          <ScrollView>
            {
              getAccountsList(this.props.accounts)
                .map(acc => this.getAccountCard(acc))
            }
          </ScrollView>
          <Card.Actions>
            <Button flex
              icon="email"
              onPress={this.toAddingMode.bind(this)}
            >
            Add Account
            </Button>

            <Button flex
              icon="refresh"
              onPress={this.toTransferMode.bind(this)}
            >
            Transfer
            </Button>
          </Card.Actions>
        </Card.Content>
      </Card>
    )
  }
  transferCard() {
    return (
      <Card style={style.topContainer}>
        <Card.Content>
          <CardHeader icon={icons.transfer} text="Transfer" />
          {buildForm(
            this,
            [
              {
                type: "text",
                label: "Name",
                fieldName: "name",
                formName: "transferForm",
              },
              {
                type: "picker",
                label: "From",
                fieldName: "from",
                choices: this.props.accounts,
                formName: "transferForm",
              },
              {
                type: "picker",
                label: "To",
                fieldName: "to",
                choices: this.props.accounts,
                formName: "transferForm",
              },
              {
                type: "number",
                label: "Amount",
                fieldName: "amount",
                formName: "transferForm",
              },
              {
                type: "number",
                label: "Exchange Rate",
                fieldName: "multiplier",
                formName: "transferForm",
              },
            ]
          )}
          <Card.Actions>
            <Button
              flex
              icon={icons.remove}
              onPress={this.toNormalMode.bind(this)}
            >
            Cancel
            </Button>

            <Button
              flex
              mode="contained"
              icon={icons.transfer}
              onPress={() => {}}
            >
            Transfer
            </Button>
          </Card.Actions>
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
        <ScrollView>
        {(() => {
            switch(this.state.mode) {
              case AccountsPage.Mode.adding:
                return this.addAccountCard()
              case AccountsPage.Mode.transfer:
                return this.transferCard()
              default:
                return this.accountListCard()
            }
          })()
        }
        </ScrollView>
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
  topContainer: {
    marginTop: (Platform.OS === 'ios')?52:0,
  },
  actions: {
    flex: 1
  }
})
