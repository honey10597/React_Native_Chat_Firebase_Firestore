import React, { Component } from 'react'
import {
  SafeAreaView
} from 'react-native';

import { Provider } from 'react-redux';
import store from './src/Redux/store';

import Routes from './src/Navigation/Routes'

const App = ({ }) => {
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        <Routes />
      </SafeAreaView>
    </Provider>
  )
}

export default App;