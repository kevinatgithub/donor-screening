import React, { Component } from 'react';
import {
  Screen, View, TextInput, Button, Text, 
  ScrollView, TouchableOpacity, NavigationBar, Title, Icon,
  DropDownMenu, ImageBackground, Tile, Overlay, Caption
} from '@shoutem/ui'
import Modal from 'react-native-modal'
import ChangePicture from './ChangePicture'
import DatePicker from 'react-native-datepicker';
import NavBar from '../NavBar'
import { Database, Address, loadPhoto } from '../../lib/helpers';

export default class Add extends Component {

  state = {
    id : null, fname: null, mname: null, lname: null, gender: 'M', bdate: null,
    nsb: null, barangay: {}, city: {}, province: {}, region: {},
    selectAddress : false, address : null, photo : require('../../assets/profile.png'),
    genders : [
      { key : 'M' , value: 'M', label: 'Male' },
      { key : 'F' , value: 'F', label: 'Female' },
    ], updatePhoto : false, photoChanged : false
  };

  componentWillMount(){
    this.prepare()
  }

  componentWillReceiveProps(){
    this.prepare()
  }


  prepare(){
    let donor = this.props.donor
    let {id,fname,mname,lname,gender,bdate,nsb,region,province,city,barangay} = donor
    this.setState({id,fname,mname,lname,gender,bdate,nsb})
    loadPhoto(donor,this)

    Database.run(db => {
        db.executeSql('SELECT * FROM region WHERE regcode = ?',[region],
          (db,result) => this.setState({region : result.rows.item(0)})
        )
        db.executeSql('SELECT * FROM province WHERE provcode = ?',[province],
          (db,result) => this.setState({province : result.rows.item(0)})
        )
        db.executeSql('SELECT * FROM city WHERE citycode = ?',[city],
          (db,result) => this.setState({city : result.rows.item(0)})
        )
        db.executeSql('SELECT * FROM barangay WHERE bgycode = ?',[barangay],
          (db,result) => this.setState({barangay : result.rows.item(0)})
        )
      },() => {
        const {region,province,city,barangay} = this.state
        const address = (barangay ? barangay.bgyname : null) +', '+
                        (city ? city.cityname : null) +', '+
                        (province ? province.provname : null)+', '+
                        (region ? region.regname : null)

        this.setState({address})
    })

  }

  render() {
     const selectedGender = this.state.gender == 'M' ? this.state.genders[0] : this.state.genders[1];

    return (
      <ScrollView>

        <TouchableOpacity
          onPress={()=>{this.setState({updatePhoto : true})}} >

          <ImageBackground
            styleName="large"
            source={this.state.photo} 
          >
            <Tile>
              <Overlay>
                <Title styleName="md-gutter-bottom">Tap here to Change</Title>
              </Overlay>
            </Tile>
          </ImageBackground>
          
        </TouchableOpacity>

        <Modal isVisible={this.state.updatePhoto}>
          <ChangePicture complete={photo => this.setState({photo,updatePhoto : false, photoChanged : true})} />
        </Modal>

        <TextInput
          placeholder="First Name"
          value={this.state.fname}
          onChangeText={fname => this.setState({ fname })} 
        />

        <TextInput
          placeholder="Middle Name"
          value={this.state.mname}
          onChangeText={mname => this.setState({ mname })} 
        />

        <TextInput
          placeholder="Last Name"
          value={this.state.lname}
          onChangeText={lname => this.setState({ lname })} 
        />
        
        <DropDownMenu
          styleName="horizontal"
          options={this.state.genders}
          selectedOption={selectedGender ? selectedGender : this.state.genders[0]}
          onOptionSelected={gender => this.setState({ gender : gender.value })}
          titleProperty="label"
          valueProperty="value"
        />
        
        <View style={{flexDirection:'row',justifyContent :'space-evenly', alignItems : 'center'}}>
          <Text style={{ fontSize: 17, width : 100 }}>Birth Date</Text>
          <DatePicker
            date={this.state.bdate}
            placeholder="Date of Birth"
            format="YYYY-MM-DD"
            onDateChange={bdate => {
              this.setState({ bdate });
            }}
          />
        </View>

        <TextInput
          placeholder="No./ St./ Block"
          value={this.state.nsb}
          onChangeText={nsb => this.setState({ nsb })} 
        />

        <TouchableOpacity style={{flexDirection : 'row',height: 60,alignItems :'center',margin :5, padding : 5}}>
          <Text>Address</Text>
          <Text style={{marginLeft :40}} onPress={()=>{this.setState({selectAddress: true})}} >
            {!this.state.address ? 'Tap to select address' : this.state.address}
          </Text>
        </TouchableOpacity>

        <Modal isVisible={this.state.selectAddress}>
          <Address select={this.select.bind(this)} cancel={()=>{this.setState({selectAddress: false})}} />
        </Modal>

        <View style={{ flexDirection: 'row', justifyContent: 'center', height : 140, marginTop: 20 }}>
          <View>
            <Button styleName="secondary" onPress={() => {this.props.onCancel()}}>
              <Text>Cancel</Text>
            </Button>
          </View>
          <View style={{marginLeft : 20}}>
            <Button styleName="secondary" onPress={this.save.bind(this)}>
              <Text>Update Donor</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  select(addr){
    const {region,province,city,barangay} = addr
    const address = barangay.bgyname + 
                    ', ' + (city ? city.cityname : null) + 
                    ', ' + (province ? province.provname : null) + 
                    ', ' + (region ? region.regname : null)
    this.setState({address,region,province,city,barangay,selectAddress : false})
  }

  save(){
    let {id, fname, mname, lname, gender, bdate, nsb, barangay, city, province, region, photo, photoChanged} = this.state

    Database.run(db => {
      let params = [fname,mname,lname,gender,bdate,
          nsb,
          barangay ? barangay.bgycode : null,
          city ? city.citycode : null,
          province ? province.provcode : null,
          region ? region.regcode : null]
      let changes = [
        'fname = ?','mname = ?','lname = ?','gender = ?','bdate = ?',
        'nsb = ?','barangay = ?','city = ?','province = ?','region = ?',
      ]
      
      if(photoChanged){
        changes.push('photo = ?')
        params.push(photo.uri)
      }
      params.push(id)
      db.executeSql(`
        UPDATE donors SET 
        `+changes.join(',')+` , sync = null
        WHERE id = ?
      `,
        params
      )

      db.executeSql("UPDATE vdonors SET name = ? WHERE id = ?",[
        fname+' '+mname+' '+lname, id
      ])


      this.props.onComplete()
      

    })
  }
}

