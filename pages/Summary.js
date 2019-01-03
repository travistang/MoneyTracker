import React from 'react'
import {
  ScrollView,
  StyleSheet
} from 'react-native'
import {
  View
} from 'react-native-ui-lib'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {
  Card,
  Button,
  Title,
  Subheading,
} from 'react-native-paper'
import SummaryCard from '../containers/SummaryCard'
import TransactionRecord from '../components/TransactionRecord'
import { connect } from 'react-redux'
import CardHeader from '../components/CardHeader'
import { getSurplusStringRepresentationForAccount } from '../store'

// The UI of the summary
class SummaryPage extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (<Icon name="home" size={32} color={tintColor}/>)
  }

  constructor(props) {
    super(props)
    this.state = {

    }
  }
  getSummaryMainComponent() {
    if(this.props.transactions.length > 0){
      return (
        <ScrollView>
          {
            this.props.transactions.map(transaction => (
              <TransactionRecord
                account={this.props.getAccountByName(transaction.account)}
                transaction={transaction}

              />
            ))
          }
        </ScrollView>
      )
    } else {
      return (
        <Subheading style={{textAlign: 'center'}}> You have no transactions </Subheading>
      )
    }
  }
  render() {
    return (
      <View flex-1 style={style.container}>
        <SummaryCard />
        <Card style={style.transactionListContainer}>
          <Card.Content>
            <CardHeader icon="list" text="Transactions" />
            {this.getSummaryMainComponent()}
          </Card.Content>
        </Card>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  ...state,
  getAccountByName: (name) => ((state.accounts.filter(acc => acc.name === name))[0])
})

export default connect(mapStateToProps, null)(SummaryPage)
const style = {
  container: {
    padding: 16
  }
}
