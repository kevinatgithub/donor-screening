/**
 * Helper module so that we dont need to specifically import
 * any of the helpers inside the /lib folder
 */
import ToastAndroid from 'react-native'
import {Database,DB} from './database'
import Web from './web'
import {Internet} from './Internet'
import DropDown from './DropDown'
import Address from './Address'
import store from 'react-native-simple-store'; // Version can be specified in package.json

/**
 * List of STORE KEYS, because its a good practice to maintain 
 * lists of strings as keys instead of using string itself,
 * so that we can avoid typo errors 
 */
const KEYS = {
  user : 'user',
  donors : 'donors',
}


const calculateAge = function(birthday) { // birthday is a date
    birthday = new Date(birthday)
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const loadAddress = function(addr,that){

  Database.run(db => {
    if(addr.barangay){
      db.executeSql("SELECT * FROM barangay WHERE bgycode = ?",[addr.barangay],
      (db,result) => {
        that.setState({ barangay :  result.rows.item(0) })
      })
    }

    if(addr.city){
      db.executeSql("SELECT * FROM city WHERE citycode = ?",[addr.city],
      (db,result) => {
        that.setState({ city : result.rows.item(0) })
      })
    }

    if(addr.province){
      db.executeSql("SELECT * FROM province WHERE provcode = ?",[addr.province],
      (db,result) => {
        that.setState({ province : result.rows.item(0) })
      })
    }

    if(addr.region){
      db.executeSql("SELECT * FROM region WHERE regcode = ?",[addr.region],
      (db,result) => {
        that.setState({ region : result.rows.item(0) })
      })
    }
  })
}

const currentDate = function(){
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1; //January is 0!
  let yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd
  } 

  if(mm<10) {
      mm = '0'+mm
  } 

  return yyyy + '-' + mm + '-' + dd;
}

const loadPhoto = function(donor,that){
  if(donor.sync !== null){
    Web.get('photo/'+donor.seqno,({data}) => {

      if(data){
        that.setState({photo : {uri : "data:image/png;base64,"+data}})
      }
    })
  }else{
    that.setState({photo : {uri : donor.photo}})
  }
}

/**
 * We tell Javascript what Object/Functions 
 * we can pull and use in this file
 */
module.exports = {
  Database, DB,
  KEYS,
  Web,
  Internet,
  DropDown,
  Address,
  calculateAge,
  loadAddress,
  loadPhoto,
  currentDate
}