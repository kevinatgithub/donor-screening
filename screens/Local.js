import React, {Component} from 'react'
import {Icon,Title,Text} from '@shoutem/ui'
import Drawer from 'react-native-drawer'
import Menu from './Menu'
import NavBar from './NavBar'
import Actions from './Actions'
import List from './local/List'
import Add from './local/Add'
import Info from './local/Info'
import Edit from './local/Edit'
import Show from '../lib/Show'
import {Database} from '../lib/database'

export default class Local extends Component{

  state = {
    mode : 'LIST', donors : [], current : null
  }

  componentWillMount(){
    this.refreshList()
  }

  refreshList(search, callback){
    this.setState({donors : []})
    let param = search ? [search] : []
    let query = search ? 
      'SELECT * FROM vdonors WHERE name MATCH ? AND seqno IS NULL  ORDER BY name': 
      'SELECT * FROM vdonors WHERE seqno IS NULL ORDER BY name'
    Database.run(db => {
      db.executeSql(query,param,(db,result) => {
        let donors = []
        for(var i = 0 ; i< result.rows.length; i++){
          donors.push(Object.assign({key:i+''},result.rows.item(i)))
        }
        this.setState({donors})
      })
    })
  }

  render(){
    const {mode,current} = this.state
    return(
      <Drawer type="overlay"  ref={(ref) => this._drawer = ref} 
      content={<Menu navigate={this.props.navigation.navigate} close={() => {this._drawer.close()}} />} >
      
        <Show if={mode == 'LIST'}>
          <NavBar
            left={<Icon name="sidebar" onPress={()=>{this._drawer.open()}} />}
            center={<Title>Local List</Title>} 
            right={<Icon name="plus-button" onPress={()=>{this.setState({mode : 'ADD'})}} />}
          />
          <List 
            select={donor => this.setState({current : donor, mode : 'INFO'})} 
            donors={this.state.donors} 
            refreshList={this.refreshList.bind(this)} />
        </Show>

        <Show if={mode == 'INFO' && current}>
          <NavBar
            left={<Icon name="left-arrow" onPress={()=>{this.setState({mode:'LIST'})}} />}
            center={<Title>Donor Details</Title>} 
            right={<Icon name="edit" onPress={()=>{this.props.navigation.navigate('Edit',{donor : this.state.donor})}} />}
            styleName="inline"
          />
          <Info donor={this.state.current} navigation={this.props.navigation} />
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
          <Add onComplete={()=>{this.refreshList(); this.setState({mode: 'LIST'})}}/>
        </Show>

        <Show if={mode == 'EDIT'}>
          <NavBar
            left={<Icon name="left-arrow" 
            onPress={()=>{this.setState({mode:'Info'})}} />}
            center={<Title>Update Donor</Title>} 
          />
          <Edit 
            donor={this.state.current}
            onComplete={()=>{this.refreshList(); this.setState({mode: 'LIST'})}}
            onCancel={()=>{this.refreshList(); this.setState({mode: 'LIST'})}}
            />
        </Show>
        
      </Drawer>
    )
  }
}