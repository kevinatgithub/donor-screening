import React, { Component } from 'react';
import {
  Screen,
  View,
  TextInput,
  ListView,
  Text,
  Button,
  Icon,
  Title,
  Tile,
  Subtitle,
  Caption,
  Image
} from '@shoutem/ui';
import Drawer from 'react-native-drawer';
import Menu from '../Menu';
import ProgressBar from 'ProgressBarAndroid';
import store from 'react-native-simple-store';
import { Database, KEYS, refreshListOfDonors } from '../../lib/helpers';
import NavBar from '../NavBar'
import ListRow from './ListRow';
import Solo from './Solo';
import Show from '../../lib/Show'
import _ from 'lodash';

export default class List extends Component {
  state = {
    donors : [],
    loading: false,
    name: null,
    fresh: true,
  };

  doSearch() {
    this.setState({ fresh: false });
    const { name } = this.state;
    if (!name || name == null || name == '') {
      return;
    }
    this.setState({ loading: true });

    this.search(name,donors => {
      this.setState({donors,loading : false})
    });
  }
  
  search(name, callback) {
    
    Database.run(db => {
      db.executeSql(
        'SELECT * FROM vdonors WHERE name match ?',
        [name],
        (tx, result) => {
          if(result.rows.length == 1){
            let donor = result.rows.item(0)
            this.props.selectDonor(donor)
          }else{
            let donors = [];

            var len = result.rows.length;
            for (let i = 0; i < len; i++) {
              let row = result.rows.item(i);
              donors.push(Object.assign({ key: row.id + '' }, row));
            }
            callback(donors)
          }
        }
      );
    });
  }

  render() {
    const {loading,name,fresh} = this.state
    const {donors} = this.state

    return (
      <View style={{height : '90%'}}>
        <Show if={!fresh}>
          <TextInput
            placeholder="Search Donor Name"
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
            onSubmitEditing={this.doSearch.bind(this)}
          />
        </Show>

        <Show if={loading}>
          <Tile styleName="text-centric">
            <Caption styleName="sm-gutter-bottom">PLEASE WAIT..</Caption>
          </Tile>
        </Show>

        {fresh ? 
        
            <Tile styleName="text-centric">
              <Image source={{uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGSUmHS3f1jS7KpsvGhOVhL688Zbq7nYQ75BGVTWSDwZmpbN6p'}} styleName="large-banner" />
              <TextInput
                placeholder="Tap here to Search Donor Name"
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
                onSubmitEditing={this.doSearch.bind(this)}
                style={{width : '100%', textAlign : 'center'}}
              />
              <Caption styleName="sm-gutter-bottom">
                SEARCH FOR THE DONOR USING HIS NAME IN THE FIELD ABOVE
              </Caption>
            </Tile> : null
        }

        <Show if={!loading}>

          <Show if={!fresh && !donors.length}>
            <Tile styleName="text-centric">
              <Caption styleName="sm-gutter-bottom">DONOR NOT FOUND</Caption>
            </Tile>
          </Show>

          <Show if={!fresh && donors.length}>
            <ListView
              data={donors}
              renderRow={this.renderRow.bind(this)}
            />
          </Show>

          <Show if={name}>
            <Button 
              styleName="secondary" 
              onPress={() => {this.setState({name : null, fresh : true, donors : []})}}>
              <Text>Search Another Donor</Text>
            </Button>
          </Show>

        </Show>

      </View>
    );
  }

  renderRow(item) {
    return (
      <ListRow
        donor={item}
        onselect={() => {
          this.props.selectDonor(item);
        }}
      />
    );
  }
}
