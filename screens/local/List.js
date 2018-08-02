import React, {Component} from 'react'
import Drawer from 'react-native-drawer'
import Menu from '../Menu'
import {
Screen, Row, View, ListView, NavigationBar, 
Title, Icon, Caption, Divider, Subtitle, Text, Image,
TextInput, Button, TouchableOpacity
} from '@shoutem/ui'
import store from 'react-native-simple-store'
import ListRow from './ListRow'
import NavBar from '../NavBar'
import {Database} from '../../lib/helpers'
import Show from '../../lib/Show'

export default class List extends Component{

  state = {
    search : null
  }

  doSearch(){
    const {search} = this.state
    this.props.refreshList(search)
  }

  renderRow(donor){
    return (
      <ListRow donor={donor} select={this.props.select} />
    )
  }

  render(){
    
    return (
      <View>
        <View styleName="small horizontal">
          <TextInput 
          style={{width: this.state.search ? '82%' : '100%'}}
          placeholder="Search Donor Name" 
          value={this.state.search} 
          onChangeText={search=>this.setState({search})}
          onSubmitEditing={this.doSearch.bind(this)} />
          
          <Show if={this.state.search} style={{height : '100%', width:'20%'}}>
            <Button 
            style={{flex:1}}
            styleName="secondary"
            onPress={() => {this.setState({search : null}); this.props.refreshList()}}>
              <Text>Clear</Text>
            </Button>
          </Show>
        </View>
        <Divider styleName="line" />

        <ListView 
          data={this.props.donors}
          renderRow={this.renderRow.bind(this)} />
          
      </View>
    )
  }
}