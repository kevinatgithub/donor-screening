import React, {Component} from 'react'
import {Row, View, TouchableOpacity, Text, Image,Subtitle, Caption, Divider} from '@shoutem/ui'
import {Web,Database,calculateAge,loadPhoto} from '../../lib/helpers'


export default class ListRow extends Component{

  state = {
    donor : null
  }

  componentWillMount(){
    Database.run(db => {
      db.executeSql("SELECT * FROM donors WHERE id = ?",[this.props.donor.id],(db, result) => {
        let donor = result.rows.item(0)
        this.setState({donor})
        
      })
    })
  }
  

  render(){
    const {donor} = this.state

    if(!this.state.donor){
      return null
    }

    return (
      <TouchableOpacity onPress={() => {this.props.onselect(donor)}}>
        <Row>
          <Imahe
            donor={this.state.donor}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>
              {donor.fname ? donor.fname.toUpperCase() + ' ' : ' '} 
              {donor.mname ? donor.mname.toUpperCase() + ' ' : ' '} 
              {donor.lname ? donor.lname.toUpperCase() : ' '}
            </Subtitle>
            <Caption>{calculateAge(donor.bdate)}, {donor.gender == 'M' ? 'Male' : 'Female'}</Caption>
            {donor.donation_stat == 'N' ? 
              <Text style={{fontSize:10, color:'#E94F37'}}>Can not Donate</Text> :
              <Text style={{fontSize:10, color:'#76B041'}}>May Donate</Text>
            }
          </View>
        </Row>
        <Divider styleName="line" />
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

  render(){

    return <Image
            styleName="small rounded-corners"
            source={this.state.photo}
          />
  }
}