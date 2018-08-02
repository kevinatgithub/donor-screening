/**
 * Database Helper File for doing sqlite transactions
 */
import SQLite from 'react-native-sqlite-storage'

import {
  create_donors,create_vdonors,create_ldonors,create_vldonors,
  drop_donors,drop_vdonors,drop_ldonors,drop_vldonors,
  create_region, create_province, create_city, create_barangay,
  drop_region, drop_province, drop_city, drop_barangay,
  
} from './schema/migrations'
import { 
  seed_donors, seed_vdonors, seed_ldonors, seed_vldonors,
  seed_region, seed_province, seed_city, seed_barangay
} from './schema/seeds'

const DATABASE_NAME = 'nbbnets'  

const DB = SQLite.openDatabase({name : DATABASE_NAME, createFromLocation : "~"+DATABASE_NAME+".db"},null,e=>alert(e))

const Database = {

  /**
   * Call this method to make sure the 
   * necessary tables are created
   */
  start(){
    Database.run(db => {
      db.executeSql(create_donors)
      db.executeSql(create_vdonors)
      db.executeSql(create_ldonors)
      db.executeSql(create_vldonors)
    })
  },
  
  /**
   * Same as start(), Call this method when testing 
   * some component without passing through Splash.js
   */
  
  quickStart(callback){

    Database.run(db => {
      db.executeSql(drop_donors)
      db.executeSql(drop_vdonors)
      db.executeSql(create_donors)
      db.executeSql(create_vdonors)
      db.executeSql(seed_donors)
      db.executeSql(seed_vdonors)
      db.executeSql(drop_region)
      db.executeSql(drop_province)
      db.executeSql(drop_city)
      db.executeSql(drop_barangay)
      db.executeSql(create_region)
      db.executeSql(create_province)
      db.executeSql(create_city)
      db.executeSql(create_barangay)
      db.executeSql(seed_region)
      db.executeSql(seed_province)
      db.executeSql(seed_city)
      db.executeSql(seed_barangay)

      
    }, () => {
      if(typeof callback == 'function'){
        callback()
      }
    })
  },

  /**
   * Helper for running SQL 
   */
  run(todo,callback){
    DB.transaction(tx => {
      todo(tx)
    }, e => alert(e), () => {
      if(typeof callback == 'function'){
        callback()
      }

    },e => alert(e.message))
  },

}

module.exports = {
  Database, DB
}