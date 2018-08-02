import React,{Component} from 'react'
import {StyleSheet, Alert, Text} from 'react-native'
import ActionButton from 'react-native-action-button'
import {Icon} from '@shoutem/ui'
import {Database} from '../lib/database'
import Show from '../lib/Show'

export default class Actions extends Component{

  render(){
    
    const {donor} = this.props
    
    return(
      <ActionButton buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item buttonColor='#3498db' title="Register New Donor" onPress={() => this.props.onRegister(donor)}>
          <Icon name="md-arrow-forward" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#9b59b6' title="Update Information" onPress={() => this.props.onEdit(donor)}>
          <Icon name="md-create" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#1abc9c' title="Delete Donor" onPress={this.confirmDelete.bind(this)}>
          <Icon name="md-arrow-back" style={styles.actionButtonIcon} />
        </ActionButton.Item>

      </ActionButton>
    )
  }

  confirmDelete(){
    const {donor} = this.props
    if(donor.seqno){
      alert('You cannot delete records from NBBNETS Website')
      return
    }
    Alert.alert(
      'Delete Donor',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.deleteDonor()},
      ],
      { cancelable: false }
    )
  }

  deleteDonor(){
    const {donor} = this.props
    Database.run(db => {
      db.executeSql("DELETE FROM donors WHERE id = ?",[donor.id],(db,result) => {
        this.props.onBack()
      })
    })
  }
}


const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})