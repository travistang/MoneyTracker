import React from 'react'
import MainTab from './components/MainTab'
import { createAppContainer } from 'react-navigation'
import {
  Platform, StyleSheet, View,
  StatusBar
} from 'react-native'
import { Provider } from 'react-redux'

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import {ThemeManager} from 'react-native-ui-lib'

import configureStore from './store'
import * as Config from './config'
import { PersistGate } from 'redux-persist/integration/react'

const {store, persistor} = configureStore()
// import {
//   View
// } from 'react-native-ui-lib'

// prepare for navigation stuff
const AppContainer = createAppContainer(MainTab)
ThemeManager.setComponentTheme('View',(props, context) => {
  return {
    backgroundColor: Config.colors.background
  }
})
const theme = {
  ...DefaultTheme,
  roundness: 20,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    ...Config.colors,
  }
}

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <PaperProvider theme={theme}>
            <StatusBar barStyle="light-content" />

              <AppContainer />

          </PaperProvider>
        </PersistGate>
      </Provider>
    )
  }
}
const style = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios'?52:0
  }
})
