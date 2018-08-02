import React, {Component} from 'react'
import {View} from 'react-native'

export default class Show extends Component{

  render(){
    return(
      this.props.if ? 
        <View>
          {this.props.children}
        </View>: null
    )
  }
}