import { connect } from 'react-redux'
import SummaryCard from '../components/SummaryCard'
import * as Actions from '../actions'
import {
  setMainAccount,
  getMainAccount,
} from '../store'

const mapStateToProps = state => ({
  ...state,
  mainAccount: getMainAccount(state.accounts)
})

const mapDispatchToProps = dispatch => ({
  addTransaction: (transaction) => dispatch({type: Actions.ADD_TRANSACTION, transaction}),
  setMainAccount: (accounts, accountName) => dispatch({
    type: Actions.SET_ACCOUNTS,
    accounts: setMainAccount(accounts, accountName)
  })
})
export default connect(mapStateToProps, mapDispatchToProps)(SummaryCard)
