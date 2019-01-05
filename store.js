import { createStore } from 'redux'
import * as Actions from "./actions"
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import { dollarString } from './config'

const initialState = {
  transactions: [], // list of transactions
  accounts: [
    {
      name: "default",
      currency: "EUR",
    }
  ] // list of accounts
}
// reducers here, skip the files
const reducers = (state = initialState, action) => {
  switch(action.type) {
    case Actions.ADD_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.concat(action.transaction)
      }
    case Actions.ADD_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.concat(action.account)
      }
    case Actions.SET_ACCOUNTS:
      return {
        ...state,
        accounts: action.accounts
      }
    case Actions.TRANSFER:
      // create two transactions...
      const { from, to, amount, multiplier } = action

      return {

      }
    default:
      return state
  }
}

// handling dates in storage
const dateTransform = createTransform(
  (inboundState,key) => {
    return {
      ...inboundState,
      transactions: inboundState.transactions.map(t => ({...t, date: t.date.toString()}))
    }
  },
  (outboundState,key) => {
    return {
      ...outboundState,
      transactions: outboundState.transactions.map(t => ({...t, date: new Date(t.date)}))
    }
  },
  {whitelist: ['reducers']}
)
const persistedReducer = persistReducer({
  key: 'transactions',
  blacklist: ['navigation'],
  // transform: [dateTransform],
  stateReconciler: hardSet,
  // debug: true,
  storage
}, reducers)

export default function configureStore() {
  const store = createStore(persistedReducer)
  const persistor = persistStore(store)
  // persistor.purge()
  return {store, persistor}
}

// helper functions for aggregating values from state
export function getSurplusForAccount(transactions,name) {
  return transactions
    .filter(t => t.account === name)
    .reduce((a,t) => a + t.amount, 0)
}
export function getAccountByName(accounts, name) {
  return ((accounts.filter(acc => acc.name === name))[0])
}
export function getSurplusStringRepresentationForAccount(transactions, accounts, name) {
  const account = getAccountByName(accounts,name),
        { currency } = account,
        surplus = getSurplusForAccount(transactions, name)
  return dollarString(surplus, currency)
}
export function getAccountsList(accounts) {
  return accounts.map(acc => acc.name)
}

export function getAccountErrorMessage(existingAccounts, account) {
  if(!account.name.trim().length)
    return "Account name cannot be empty"
  if(existingAccounts.indexOf(account) != -1) {
    return "Account already exists"
  }

  if(!account.currency.trim().length)
    return "Currency cannot be empty"
  return null
}

export function getTransactionErrorMessage(transaction) {
  if(!transaction.name.trim().length)
    return "Transaction name cannot be empty"
  if(!transaction.amount.length)
    return "Transaction amount cannot be zero"
  if(!transaction.account || !transaction.account.trim().length)
    return "Transaction must be from an account"
  const amount = Number(transaction.amount) * (transaction.isExpenditure?(-1):1)
  if(amount == 0)
    return "Transaction amount cannot be zero"

  return null // no error
}
