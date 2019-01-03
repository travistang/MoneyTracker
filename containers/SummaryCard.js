import { connect } from 'react-redux'
import SummaryCard from '../components/SummaryCard'
import * as Actions from '../actions'
import {
  getAccountsList,
  getSurplusForAccount,
  getSurplusStringRepresentationForAccount
} from '../store'
import { mapArrayToObject } from '../utils'
const mapStateToProps = state => ({
  ...state,
  surplus: mapArrayToObject(
    getAccountsList(state.accounts),
    (acc) => getSurplusForAccount(state.transactions,acc)),

  surplusStrings: mapArrayToObject(
    getAccountsList(state.accounts),
    (acc) => getSurplusStringRepresentationForAccount(
              state.transactions,
              state.accounts,acc)
  ),
  accounts: getAccountsList(state.accounts),

})

const mapDispatchToProps = dispatch => ({
  addTransaction: (transaction) => dispatch({type: Actions.ADD_TRANSACTION, transaction}),
})
export default connect(mapStateToProps, mapDispatchToProps)(SummaryCard)
