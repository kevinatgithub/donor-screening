import React, { Component } from 'react';
import {} from 'react-native'
import {
  Screen, View, TextInput, Button, Text, ScrollView, 
  TouchableOpacity, NavigationBar, Title, Icon,
  DropDownMenu, ImageBackground, Tile, Overlay, Caption
} from '@shoutem/ui'
import NavBar from '../NavBar'
import Modal from 'react-native-modal'
import DatePicker from 'react-native-datepicker';
import ChangePicture from './ChangePicture'
import { Database, Address, currentDate } from '../../lib/helpers';

export default class Add extends Component {

  state = {
    fname: null, mname: null, lname: null, gender: 'M', bdate: null,
    nsb: null, barangay: null, city: null, province: null, region: null,
    selectAddress : false, address : null, 
    photo : {uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYsl9U3f4dgb7HZzJz3G_fmDFzXQeS2DG1VL2UUSyDJ_-yzjJ'},
    takePhoto : false, photoChanged : false,
    genders : [
      { key : 'M' , value: 'M', label: 'Male' },
      { key : 'F' , value: 'F', label: 'Female' },
    ]
  };

  render() {
    return (
      <ScrollView>
        <TouchableOpacity onPress={()=>this.setState({takePhoto : true})}>
          <ImageBackground
            styleName="large"
            source={this.state.photo}
          >
            <Tile>
              <Overlay>
                <Title styleName="md-gutter-bottom">Tap to Capture Donor Photo</Title>
              </Overlay>
            </Tile>
          </ImageBackground>
        </TouchableOpacity>
        
        <Modal isVisible={this.state.takePhoto}>
          <ChangePicture complete={photo => this.setState({photo, takePhoto : false, photoChanged : true})} />
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
          selectedOption={this.state.genders[0]}
          onOptionSelected={gender => this.setState({ gender })}
          titleProperty="label"
          valueProperty="value"
        />
        

        
        <View style={{flexDirection:'row',justifyContent :'space-evenly', alignItems : 'center', backgroundColor : '#fff'}}>
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

        <TouchableOpacity style={{flexDirection : 'row',height: 60,alignItems :'center',padding : 15, backgroundColor : '#fff'}}>
          <Text>Address</Text>
          <Text style={{marginLeft :40}} onPress={()=>{this.setState({selectAddress: true})}} >
            {!this.state.address ? 'Tap to select address' : this.state.address}
          </Text>
        </TouchableOpacity>

        <Modal isVisible={this.state.selectAddress}>
          <Address select={this.select.bind(this)} cancel={()=>{this.setState({selectAddress: false})}} />
        </Modal>

        <View style={{ flexDirection: 'row', justifyContent: 'center', height : 140, paddingTop : 20}}>
          <View>
            <Button styleName="secondary" onPress={this.clear.bind(this)}>
              <Text>Create Donor</Text>
            </Button>
          </View>
          <View style={{marginLeft : 20}}>
            <Button styleName="secondary" onPress={this.save.bind(this)}>
              <Text>Create Donor</Text>
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

  clear(){
    this.setState({
      fname : null, mname : null, lname : null, gender : null, bdate : null, 
      nsb : null, barangay : null, city : null, province : null, region : null
    })
  }

  save(){
    let {photo, photoChanged, fname, mname, lname, gender, bdate, nsb, barangay, city, province, region} = this.state

    if(!fname || !lname || !bdate){
      alert('Please provide Donor First Name , Last Name , Gender and Birth Day ')
      return
    }

    Database.run(db => {
      const photo = photoChanged ? photo.uri : null
      db.executeSql("INSERT INTO donors VALUES (null,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [null,null,photo,
          fname,(mname ? mname : ''),lname,gender,bdate,nsb,
          barangay ? barangay.bgycode : null,
          city ? city.citycode : null,
          province ? province.provcode : null,
          region ? region.regcode : null,
          null,null,currentDate(),null,null],
        (db,r) =>{
          Database.run(db => {
            db.executeSql("INSERT INTO vdonors VALUES (?,?,?)",[
              r.insertId, fname+' '+mname+' '+lname, null
            ])

            this.setState({fname: null, mname: null, lname: null, gender: 'M', bdate: null,
            nsb: null, barangay: null, city: null, province: null, region: null})
              this.props.onComplete()
          })
        }
      )

    })
  }
}

