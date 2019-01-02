import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'
import SummaryPage from '../pages/Summary'
import AccountsPage from '../pages/Accounts'
import { colors } from '../config'

export default createBottomTabNavigator({
  "Summary": SummaryPage,
  "Accounts": AccountsPage
}, {
  tabBarOptions: {
    activeTintColor: colors.primary,
    inactiveTintColor: colors.text,
    style: {
      backgroundColor: colors.surface,
    },
  }
})
