import React, {Component} from 'react'
import {StyleSheet, View, Text, Image,} from 'react-native'
import {Screen, ScrollView, Title, Icon, ListView, Divider} from '@shoutem/ui'
import NavBar from '../NavBar'
import {Grid,Row,Col} from 'react-native-easy-grid'
import Show from '../../lib/Show'
import Actions from '../Actions'
import {Web, Database, loadAddress} from '../../lib/helpers'

export default class Solo extends Component{

  state = {
    photo : require('../../assets/profile.png'), donor : {}, donations : [],
    barangay : {}, city : {}, province : {}, region : {}
  }

  componentWillMount(){
    let {donor} = this.props
    
    Web.get('photo/'+donor.seqno,({data}) => {
      if(data){
        this.setState({photo : {uri : "data:image/png;base64,"+data}})
      }
    })

    Database.run(db => {
      db.executeSql("SELECT * FROM donors WHERE id = ?",[donor.id],(db,result) => {
        donor = result.rows.item(0)
        this.setState({donor})
        loadAddress(donor,this)
      })
    })
  }

  listRow(donation){
    return (
      <Row>
        <Col>
          <Text style={styles.detailText}>{donation.date}</Text>
        </Col>
        <Col>
          <Text style={[styles.detailText,{ marginLeft : 40}]}>{donation.facility}</Text>
        </Col>
      </Row>
    )
  }

  render(){
    const {donor , donor : {
      donor_id,seqno,fname,mname,lname,bdate,gender,donation_stat, no_st_blk
      }, barangay, city, province, region} = this.state
    return (
      <View style={{height : '90%'}}>
        
        <ScrollView>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={this.state.photo}
            />
          </View>
          <View style={styles.content}>
            <Divider stylName="line" />
            <Text style={styles.donorName}>{fname} {mname} {lname} , 40</Text>
            <Divider stylName="line" />
            <Grid>
              <Row>
                <Col size={0.5}><Text style={styles.detailText}>Donation Status</Text></Col>
                <Col>
                  {donation_stat == 'Y' ?
                    <Text style={{color : '#297373'}}>May Donate</Text> : 
                    <Text style={{color : '#FF8552'}}>Can not Donate</Text> 
                  }
                </Col>
              </Row>
              <Row>
                <Col size={0.5}><Text style={styles.detailText}>Donor ID</Text></Col>
                <Col><Text style={styles.detailText}>{donor_id}</Text></Col>
              </Row>
              <Row>
                <Col size={0.5}><Text style={styles.detailText}>Date of Birth</Text></Col>
                <Col><Text style={styles.detailText}>{bdate}</Text></Col>
              </Row>
              <Row>
                <Col size={0.5}><Text style={styles.detailText}>Gender</Text></Col>
                <Col><Text style={styles.detailText}>{gender == 'M' ? 'Male' : 'Female'}</Text></Col>
              </Row>
              <Row>
                <Col size={0.5}><Text style={styles.detailText}>Contact No.</Text></Col>
                <Col><Text style={styles.detailText}>09776771561</Text></Col>
              </Row>
              <Row>
                <Col size={0.5}><Text style={styles.detailText}>No./St./Block</Text></Col>
                <Col><Text style={styles.detailText}>{no_st_blk}</Text></Col>
              </Row>
              <Row>
                <Col size={0.5}><Text style={styles.detailText}>Baranday</Text></Col>
                <Col><Text style={styles.detailText}>{barangay.bgyname}</Text></Col>
              </Row>
              <Row>
                <Col size={0.5}><Text style={styles.detailText}>City/Municipality</Text></Col>
                <Col><Text style={styles.detailText}>{city.cityname}</Text></Col>
              </Row>
              <Row>
                <Col size={0.5}><Text style={styles.detailText}>Province</Text></Col>
                <Col><Text style={styles.detailText}>{province.provname}</Text></Col>
              </Row>
              <Row>
                <Col size={0.5}><Text style={styles.detailText}>Region</Text></Col>
                <Col><Text style={styles.detailText}>{region.regname}</Text></Col>
              </Row>
              
              <Row style={{paddingTop : 20, paddingBottom : 20}}>
                <Col>
                  <Show if={seqno}>
                    <Text>Locally Created</Text>
                  </Show>                
                </Col>
              </Row>
              
            </Grid>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageContainer : {
    width : '100%',
    height : 250,
    alignItems : 'center',
    backgroundColor : '#000'
  },
  donorName : {
    fontSize : 15, 
    fontWeight : 'bold', 
    color : '#404040', 
    marginTop:-5
  },
  detailText : {
    color : '#404040'
  },
  image : {
    width : 250,
    height : 250,
  },
  content : {
    padding : 10,
    paddingLeft : 20,
    height : 250,
    backgroundColor : '#f1f1f1'
  },
})