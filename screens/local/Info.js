import React, {Component} from 'react'
import {Screen, ScrollView, Title, Icon, Text,Image, View, Button, Divider} from '@shoutem/ui'
import {Grid, Row, Col} from 'react-native-easy-grid'
import Actions from '../Actions'
import NavBar from '../NavBar'
import {Web, Database, calculateAge,loadAddress,loadPhoto} from '../../lib/helpers'

export default class Info extends Component{

  state = {
    donor : null,
    barangay : {}, city : {}, province : {}, region : {}, photo : require('../../assets/profile.png')
  }

  componentWillMount(){
    this.prepare()
  }

  componentWillReceiveProps(){
      this.prepare()
  }
  
  prepare(){
    let donor = this.props.donor
    this.setState({donor})
    loadAddress(donor,this)
    loadPhoto(donor,this)
  }


  render(){
    if(!this.state.donor){
      return <View />
    }
    const { fname, mname, lname, bdate, gender, 
    nsb, barangay, city, province, region, sync} = this.state.donor
    return (
      <View style={{height :'90%'}}>
        
        <ScrollView>
          <Image
            styleName="large-banner"
            source={this.state.photo}
          />
          <Title styleName="h-center v-center" style={{marginTop : 20}}>{fname} {mname} {lname}</Title>
          <Divider styleName="line" />
          <View style={{height: 250, marginLeft : 50, marginTop  : 20}}>
            <Grid>
              <Row>
                <Col size={0.7}><Text>Age </Text></Col>
                <Col><Text>{calculateAge(bdate)} </Text></Col>
              </Row>
              <Row>
                <Col size={0.7}><Text>Birth Date</Text></Col>
                <Col><Text>{bdate} </Text></Col>
              </Row>
              <Row>
                <Col size={0.7}><Text>Gender </Text></Col>
                <Col><Text>{gender == 'M' ? 'Male' : 'Female'}</Text></Col>
              </Row>
              <Row>
                <Col size={0.7}><Text>Barangay</Text></Col>
                <Col><Text>{this.state.barangay ? this.state.barangay.bgyname: null}</Text></Col>
              </Row>
              <Row>
                <Col size={0.7}><Text>City/Municipality</Text></Col>
                <Col><Text>{this.state.barangay ? this.state.city.cityname: null}</Text></Col>
              </Row>
              <Row>
                <Col size={0.7}><Text>Province</Text></Col>
                <Col><Text>{this.state.barangay ? this.state.province.provname: null}</Text></Col>
              </Row>
              <Row>
                <Col size={0.7}><Text>Region</Text></Col>
                <Col><Text>{this.state.barangay ? this.state.region.regname: null}</Text></Col>
              </Row>
            </Grid>
          </View>
          
          
        </ScrollView>
        
      </View>
    )
  }

  
}