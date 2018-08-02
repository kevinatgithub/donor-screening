import React, {Component} from 'react'
import {View,Text} from '@shoutem/ui'
import {DropDown} from '../../lib/helpers'

export default class FormDropdown extends Component {
  render() {
    
    let { title, value, onSelect, items } = this.props;

    return (
      <View style={{flexDirection:'row',justifyContent :'flex-start', alignItems : 'center'}}>
        <Text style={{ fontSize: 17, width : 100 }}>{title} </Text>
        <DropDown value={value} onSelect={onSelect.bind(this)} items={items} />
      </View>
    );
  }
}