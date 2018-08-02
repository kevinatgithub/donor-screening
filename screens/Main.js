import React, {Component} from 'react'
import {Icon,Title,Text} from '@shoutem/ui'
import Drawer from 'react-native-drawer'
import Menu from './Menu'
import NavBar from './NavBar'
import Actions from './Actions'
import Show from '../lib/Show'
import List from './main/List'
import Solo from './main/Solo'
import Add from './local/Add'
import Edit from './local/Edit'
import {Database} from '../lib/database'

export default class Main extends Component{

  state = {
    mode : 'LIST', donors : [], current : null
  }

  

  selectDonor(donor){
    Database.run(db => {
      db.executeSql("SELECT * FROM donors WHERE id = ? ",[donor.id],(db,result) => {
        this.setState({mode : 'SOLO', current : result.rows.item(0)})
      })
    })
  }

  render(){
    const {mode, current} = this.state
    return(
      <Drawer type="overlay"  ref={(ref) => this._drawer = ref} 
      content={<Menu navigate={this.props.navigation.navigate} close={() => {this._drawer.close()}} />} >
        <Show if={mode == 'LIST'}>
          <NavBar 
            left={<Icon name="sidebar" onPress={() => { this._drawer.open(); }} />}
            center={<Title>Donor Verifier</Title>}
            right={<Icon name="add-friend" onPress={() => {this.props.navigation.navigate('TakePicture')}} />}
          />
          <List selectDonor={this.selectDonor.bind(this)} donors={this.state.donors} />
        </Show>

        <Show if={mode == 'SOLO' && current}>
          <NavBar
            left={<Icon name="sidebar" onPress={() => this.setState({mode : 'LIST'}) } /> }
            center={<Title>Donor Information</Title>}
          />

          <Solo donor={current} />
          <Actions 
            donor={this.state.current} 
            onEdit={donor => this.setState({current : donor, mode:'EDIT'})}
            onRegister={donor => this.setState({mode:'ADD'})}
            onBack={()=>{this.setState({mode : 'LIST'})}}
             />
        </Show>

        <Show if={mode == 'ADD'}>
          <NavBar
            left={<Icon name="left-arrow" onPress={()=>{this.setState({mode:'LIST'})}} />}
            center={<Title>Register Donor</Title>} 
          />
          <Add onComplete={()=>{this.setState({mode: 'LIST'})}}/>
        </Show>

        <Show if={mode == 'EDIT'}>
          <NavBar
            left={<Icon name="left-arrow" 
            onPress={()=>{this.setState({mode:'Info'})}} />}
            center={<Title>Update Donor</Title>} 
          />
          <Edit 
            donor={this.state.current}
            onComplete={()=>{this.setState({mode: 'LIST'})}}
            onCancel={()=>{this.setState({mode: 'LIST'})}}
            />
        </Show>
      </Drawer>
    )
  }
}