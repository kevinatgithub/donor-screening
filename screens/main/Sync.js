import React, {Component} from 'react'
import {Screen, NavigationBar, Icon, View, Tile, Overlay, Caption, Title, Subtitle, Text, Button} from '@shoutem/ui'
import Drawer from 'react-native-drawer'
import Menu from '../Menu'
import { Col, Row, Grid } from "react-native-easy-grid"
import ProgressBar from 'ProgressBarAndroid'
import {Web, Internet, Database, DB} from '../../lib/helpers'
import NavBar from '../NavBar'
import store from 'react-native-simple-store'

export default class Sync extends Component{

  state = {
    connected : true,
    loading : false,
    count : 0,
    lastUpdate : 'NEVER',
    serverCount : 0,
    perBatch : 100,
    progress : 0,
    progressCompute : 0,
    rounds : 0
  }

  componentDidMount(){
    
    Internet.watch(() => this.setState({connected : true}), () => this.setState({connected:false}))

    store.get('lastupdate').then(lastUpdate => {
      if(lastUpdate){
        this.setState({lastUpdate})
      }
    })
  }

  syncNow(){

    this.setState({loading:true,progress:0,serverCount:0})

    Web.get('regions',({data}) => {
      data.map(region => {
        Database.run(db => {
          db.executeSql('INSERT INTO region VALUES (null,?,?)',[region.regcode,region.regname])
        })
      })      
    })

    Web.get('provinces',({data}) => {
      data.map(({regcode,provcode,provname}) => {
        Database.run(db => {
          db.executeSql('INSERT INTO province VALUES (null,?,?,?)',
          [regcode,provcode,provname])
        })
      })      
    })

    Web.get('cities',({data}) => {
      data.map(({regcode,provcode,citycode,cityname}) => {
        Database.run(db => {
          db.executeSql('INSERT INTO city VALUES (null,?,?,?,?)',
          [regcode,provcode,citycode,cityname])
        })
      })      
    })

    Web.get('barangays',({data}) => {

      data.map(({regcode,provcode,citycode,bgycode,bgyname}) => {
        Database.run(db => {
          db.executeSql('INSERT INTO barangay VALUES (null,?,?,?,?,?)',
          [regcode,provcode,citycode,bgycode,bgyname])
        })
      })      
      
    })
    Web.get('checkupdates/count',serverCount => {
      serverCount = serverCount.data
      if(serverCount == 0){
        return;
      }

      let rounds = Math.ceil(serverCount/this.state.perBatch)
      this.setState({serverCount,rounds})

      for(var i = 0; i < rounds; i++){
      
        Web.get('checkupdates/'+this.state.perBatch+'?page='+(i+1),({data}) => {
          
          data.map(row => {
            DB.transaction(tx => {
              tx.executeSql('INSERT INTO vdonors VALUES (?,?)',[row.seqno,row.fname +' '+row.mname +' '+row.lname])
              let params = []
              params.push(row.seqno)
              params.push(row.donor_id)
              params.push(row.fname)
              params.push(row.mname)
              params.push(row.lname)
              params.push(row.gender)
              params.push(row.bdate)
              params.push(row.home_no_st_blk)
              params.push(row.home_brgy)
              params.push(row.home_citymun)
              params.push(row.home_prov)
              params.push(row.home_region)
              params.push(row.donation_stat)
              params.push(null)
              params.push('2018-01-01')
              tx.executeSql('INSERT INTO donors VALUES (null,?,?,null,?,?,?,?,?,?,?,?,?,?,?,?,null,null,?)',params)
            },e=>alert(e.message))
          })
          this.progressIncress()
        })
      }

      this.setState({loading:false})
    })
  }

  progressIncress(){
    
    let {progress,rounds} = this.state
    progress++

    let progressCompute = progress/rounds
    // if(progressCompute >= 1){
    //   this.lastUpdate()
    // }
    this.setState({progress,progressCompute})
  }

  prepareQuery(data){
    let bigQueryArray = [], params = [], bigQueryArray2 = [], params2 = []
        data.forEach(row => {
          bigQueryArray.push("(null,?,?,?,?,?,?,?,?)")
          bigQueryArray2.push("(?,?)")
          params.push(row.seqno)
          params.push(row.donor_id)
          params.push(row.donor_name)
          params.push(row.gender)
          params.push(row.bdate)
          params.push(row.donation_stat)
          params.push(row.address)
          params.push(null)

          params2.push(row.seqno)
          params2.push(row.donor_name)
        })

        let bigQuery = bigQueryArray.join(','), bigQuery2 = bigQueryArray2.join(',')
        return {bigQuery,bigQuery2,params,params2}
  }

  render(){
    let display = null

    if(!this.state.loading){
      display = (
        <Tile styleName="text-centric">
            <Title styleName="sm-gutter-bottom">Please update your app regularly or before every MBD</Title>
              <ProgressBar
                indeterminate={false} 
                progress={this.state.progressCompute} 
                styleAttr={'Horizontal'}
                style={{width:300,margin:10}} />
                {this.state.progress ? <Text>
                {Math.round(this.state.progressCompute*100)} % </Text> : null}
            {this.state.connected ? 
            <Button styleName="secondary" onPress={() => {this.syncNow()}}><Text>Sync Now</Text></Button> :
            <Text>Check Internet Connection</Text>}
          </Tile>
      )

    }else{
      display = (
        <Tile styleName="text-centric">
          <Title styleName="sm-gutter-bottom">Sync with server starting..</Title>
          <ProgressBar />
        </Tile>
      )

    }

    return (
      <Drawer ref={(ref) => this._drawer = ref} 
        content={<Menu navigate={this.props.navigation.navigate} close={() => {this._drawer.close()}} />} >
        <Screen>
          <NavBar
            left={<Icon name="sidebar" onPress={()=>{this._drawer.open()}} />}
            center={<Title>Sync with Server</Title>} 
          />
          {display}
        </Screen>
      </Drawer>
    )
  }
}