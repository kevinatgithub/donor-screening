import React, {Component} from 'react'
import {TouchableOpacity} from 'react-native'
import {Screen, View, ListView, Row, Subtitle, Divider, Text, TextInput, Icon, Button} from '@shoutem/ui'
import {Database} from './database'

export default class Address extends Component{

  state = {
    keyword : null, loading : false, results : [], fresh : true
  }

  componentWillMount(){
    Database.quickStart()
  }


  process(){
    const {keyword} = this.state
    if(!keyword){
      return
    }
    this.setState({loading : true, fresh : false})
    Database.run(db=>{
      db.executeSql("SELECT * FROM barangay WHERE bgyname like ?",['%'+keyword+'%'],(db,res) => {
        let results = []
        for(var i = 0; i < res.rows.length; i++){
          results.push(Object.assign({key : i+''},res.rows.item(i)))
        }
        this.setState({results, loading : false})
      })
    })
  }

  render(){
    const {fresh,loading, keyword, results} = this.state
    const {select} = this.props

    const resultUI = <ListView 
          data={results} 
          renderRow={this.renderRow.bind(this)} />

    const ui = !fresh && !loading && !results.length ? <Text style={{height : '90%'}}>Address not found</Text> : resultUI

    return (
      <Screen>
        <TextInput 
        value={keyword} 
        onChangeText={keyword=>this.setState({keyword})}
        onSubmitEditing={this.process.bind(this)}
        placeholder="Enter Barangay Name" />
        
        {this.state.loading ? <Text>Please wait..</Text> : ui}
        <Button styleName="secondary" onPress={()=>{this.props.cancel()}}><Text>Cancel</Text></Button>
      </Screen>
    )
  }

  renderRow(item){
    return <Item item={item} select={this.props.select} />
  }
}

class Item extends Component{

  state = {
    barangay : {}, city : {}, province : {}, region : {}
  }

  componentWillMount(){
    const {item} = this.props

    this.setState({barangay : item})

    Database.run(db=>{

      if(item.citycode){
        db.executeSql('SELECT * FROM city WHERE citycode = ?',[item.citycode],(db,result) => {
          let city = null
          for(var i = 0; i< result.rows.length; i++){
            city = result.rows.item(i)
          }
          this.setState({city})
        })
      }

      if(item.provcode){
        db.executeSql('SELECT * FROM province WHERE provcode = ?',[item.provcode],(db,result) => {
          let province = null
          for(var i = 0; i< result.rows.length; i++){
            province = result.rows.item(i)
          }
          this.setState({province})
        })
      }

      if(item.regcode){
        db.executeSql('SELECT * FROM region WHERE regcode = ?',[item.regcode],(db,result) => {
          let region = null
          for(var i = 0; i< result.rows.length; i++){
            region = result.rows.item(i)
          }
          this.setState({region})
        })
      }
    })
  }

  render(){
    let {barangay,city,province,region} = this.state

        // <Text>{JSON.stringify(this.state)}</Text>
    return(
      <TouchableOpacity 
      onPress={() => this.props.select({region,province,city,barangay})}>
        <Row styleName="small">
          <Subtitle>
            {barangay.bgyname}, {city ? city.cityname : null}, 
            {province ? province.provname : null}, {region ? region.regname : null}
          </Subtitle>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    )
  }
}