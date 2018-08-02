import React, {Component} from 'react'
import {TouchableOpacity,Row, Image,View,Subtitle} from '@shoutem/ui'
import {Database, loadPhoto, calculateAge} from '../../lib/helpers'

export default class ListRow extends Component{
  state = {
    donor : null
  }

  componentWillMount(){
    this.prepare()
  }

  componentWillReceiveProps(){
    this.prepare()
  }

  prepare(){
    let {donor} = this.props
    
    Database.run(db => {
      db.executeSql("SELECT * FROM donors WHERE id = ?",[donor.id],(db,result) => {
        donor = result.rows.item(0)
        this.setState({donor})
      })
    })
  }

  render(){
    let {select} = this.props
    let {donor} = this.state
    if(!donor){
      return <View />
    }
    
    return(
      <TouchableOpacity onPress={() => {select(donor)}}>
        <Row styleName="small">
          <Imahe donor={this.state.donor}  />
          <View styleName="vertical">
            <Subtitle>{this.props.donor.name}</Subtitle>
          </View>
        </Row>
      </TouchableOpacity>
    )
  }
}

class Imahe extends Component{

  state = {
    photo : require('../../assets/profile.png')
  }

  componentWillMount(){
    let {donor} = this.props
    loadPhoto(donor,this)
  }

  componentWillReceiveProps(){
    let {donor} = this.props
    loadPhoto(donor,this)
  }

  render(){

    return <Image
            styleName="small rounded-corners"
            source={this.state.photo}
          />
  }
}