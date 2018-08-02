import React, {Component} from 'react'
import {Picker} from 'react-native'

export default class DropDown extends Component{

  state = {
    options : []
  }

  componentWillMount(){
    let options = []
    this.props.items.map(item => {
      options.push(item)
    })
    
    this.setState({options})
  }

  render(){
    let {value,onSelect} = this.props
    let {options} = this.state

    return (
      <Picker
        style={{width: 200, height: 44, marginTop:10, marginBottom:10}} itemStyle={{height: 44}}
        selectedValue={value}
        onValueChange={onSelect.bind(this)}>
        {options.map((option,i) => {
          return <Picker.Item key={i} label={option.label} value={option.value} />
        })}
      </Picker>
    )
  }
}