import {NetInfo} from 'react-native'

let cbOk, cbNot = null;

const Internet = {
  
  watch(ok,not){
    cbOk = ok;
    cbNot = not;
    NetInfo.addEventListener(
      'connectionChange',
      Internet.handleFirstConnectivityChange
    );
  },

  doCBOK(){
    if(typeof cbOk == 'function'){
      cbOk()
    }
  },

  doCBNOT(){
    if(typeof cbNot == 'function'){
      cbNot()
    }
  },

  handleFirstConnectivityChange(net){
    if(net.isConnected){
      Internet.doCBOK()
      // if(net.type == 'wifi' || net.type == 'cellular'){
      //   Internet.doCBOK()
      // }else{
      //   Internet.doCBNOT()
      // }
    }else{
      Internet.doCBNOT()
    }
  }
}

module.exports = {
  Internet
}