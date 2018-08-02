import {createStackNavigator} from 'react-navigation'

import Main from './screens/Main'
import Local from './screens/Local'
import Sync from './screens/main/Sync'
import {Database} from './lib/helpers'
Database.quickStart()

const App = createStackNavigator({
  Main, Local, Sync
  // List, TakePicture, Add, Info, Main, Solo, Sync, Edit
},{
  initialRouteName : 'Main',
  headerMode: 'none',
  navigationOptions: {
      headerVisible: false,
  }
})

export default App