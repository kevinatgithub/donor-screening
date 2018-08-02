import React, {Component} from 'react'
import {StyleSheet,View,Text} from 'react-native'

export default class Box extends Component{

  render(){
    return (
      <View style={styles.container}>
        <View style={[styles.header,{backgroundColor:colors[this.props.type]}]}>
          <Text style={{color:(this.props.type != 0 ? '#000' : '#fff')}}>{this.props.title}</Text>
        </View>
        <View style={[styles.body,{borderColor:colors[this.props.type]}]}>
          {this.props.children}
        </View>
        
      </View>
    )
  }
}
let colors = ['#1E91D6','#8FC93A','#E4CC37','#E18335']
// let colors = ['#757761','#F4E76E','#F7FE72','#8FF7A7','#51BBFE']

const styles = StyleSheet.create({
  container : {
    margin:5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: '#fff',
  },
  header : {
    height:40,
    padding:10,
  },
  body : {
    height : 'auto',
    padding:10,
    borderWidth:1,
  }
})