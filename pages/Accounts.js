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
  getMainAccount,
  getAccountErrorMessage
} from '../store'
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
      isMain: false,
      currency: ""
    }

    this.state = {
      adding: false,
      form: this.defaultFormState
    }
  }
  getAccountCard(accountName) {
    const surplus = getSurplusForAccount(this.props.transactions, accountName)
    const isMain = getMainAccount(this.props.accounts) === accountName
    return (
      <List.Item
        title={accountName}
        left={props => <Text>{surplus}</Text>}
        right={props => <Text>{isMain?"Main":""}</Text>}
      />
    )
  }
  addAccountCard() {
    const {isMain} = this.state.form
    return (
      <Card>
        <Card.Content>
          <CardHeader icon="add" text="Add an account" />
          <TextInput label="Name"
            mode="outlined"
            value={this.state.form.name}
            onChangeText={name => this.setState({
              form: {...this.state.form, name}
            })}
            style={{margin: 8}}
          />
        <TextInput label="Currency"
            mode="outlined"
            value={this.state.form.currency}
            onChangeText={currency => this.setState({
              form: {...this.state.form, currency}
            })}
            style={{margin: 8}}
        />
        <List.Item
          title="Is main account"
          right={props => (
            <Checkbox status={isMain? "checked": "unchecked"}
              onPress={() => this.setState({form: {...this.state.form, isMain: !isMain}})}
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