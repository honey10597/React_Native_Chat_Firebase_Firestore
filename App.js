import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView
} from 'react-native'

import Routes from './src/Navigation/Routes'

const App = ({ }) => {
  return (
    <SafeAreaView style={{flex:1}}>
      <Routes />
    </SafeAreaView>
  )
}

export default App;