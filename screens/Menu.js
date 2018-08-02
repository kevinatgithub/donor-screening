import React, {Component} from 'react'
import {TouchableOpacity} from 'react-native'
import {
  Screen, View, ImageBackground, Tile, Overlay, 
  Title, Caption, Text, ListView, Row, Divider, 
  Icon, Button} from '@shoutem/ui'
import Store from 'react-native-simple-store'

export default class Menu extends Component{

  doLogout(){
    Store.remove('user')
    this.props.navigate('Login')
  }

  state = {
    links : [
      {key : 'Main', title : 'Verifier', to : 'Main'},
      {key : 'Local', title : 'Local List', to : 'Local'},
      {key : 'Sync', title : 'Sync with Server', to : 'Sync'},
      {key : 'Logout', title : 'Logout', to : 'List'},
    ]
  }

  render(){

    return (
      <Screen>

        <ImageBackground
          styleName="large"
          source={{uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3VWRTW1eyk6_ILX4KtD5LitW9d6pdvfKd7_KX5ClYxxUCFhgORg'}}
        >
          <Tile>
            <Overlay>
              <Title styleName="md-gutter-bottom">Donor Screening App</Title>
              <Caption>National Blood Bank Network System</Caption>
            </Overlay>
          </Tile>
        </ImageBackground>

        <ListView
        data={this.state.links}
        renderRow={this.renderRow.bind(this)} />

        <Button styleName="secondary" onPress={this.close.bind(this)}>
          <Text>Back</Text>
        </Button>
      </Screen>
    )
  }

  renderRow(link){
    return (
      <TouchableOpacity onPress={()=>{this.navigate(link.to)}}>
        <Row styleName="small">
            <Text>{link.title}</Text>
            <Icon styleName="disclosure" name="right-arrow" />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    )
  }

  navigate(route){
    const {navigate} = this.props
    navigate(route)
    this.close()
  }

  close(){
    if(typeof this.props.close == 'function'){
      this.props.close()
    }
  }
}