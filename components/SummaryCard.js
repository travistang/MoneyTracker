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
  ScrollView,
  Dimensions
} from 'react-native'
import {
  View,
  TagsInput,
  Picker
} from 'react-native-ui-lib'
import Carousel from 'react-native-snap-carousel'

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
  renderAccountSurplusComponent({item,index}) {
    const acc = item // alias
    const surplus = this.props.surplus[acc]
    const isDeficit = surplus < 0
    return (
      <View style={style.accountSurplusContainer}>
        <Text style={style.accountNameText}>
          {acc}
        </Text>
        <Text style={isDeficit?style.deficitText:style.surplusText}>
          {this.props.surplusStrings[acc]}
        </Text>
      </View>
    )
  }
  render() {
    const carouselWidth = Dimensions.get('window').width - 16 * 2 - 8 * 2
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
                this.props.accounts
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
          <Carousel
            loop
            data={this.props.accounts}
            renderItem={this.renderAccountSurplusComponent.bind(this)}
            itemWidth={carouselWidth}
            sliderWidth={carouselWidth}
          />
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
  },
  accountNameText: {
    color: colors.text,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  accountSurplusContainer: {
    backgroundColor: colors.surface,
    width: Dimensions.get('window').width - 16 * 2 - 16*2
  }
})
