import React, {Component} from 'react'
import {ImageBackground,NavigationBar,Title} from '@shoutem/ui'

export default class NavBar extends Component{

  state = {
    // uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2igYUR1h6y-X1LdSC5dmJfBM2qIPlVcDjNTuHyWjOhe3DkcvPnA'
    // uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3VWRTW1eyk6_ILX4KtD5LitW9d6pdvfKd7_KX5ClYxxUCFhgORg'
    uri : 'https://images.unsplash.com/photo-1481007553706-bde1ba8e91fd?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=caec8d3a7e2fbd72ff14891daf9df3d1&w=1000&q=80'
  }

  render(){
    return(
      <ImageBackground
        source={{uri : this.state.uri}}
        style={{ width: '100%', height: 70 }}
      >
        <NavigationBar
          styleName="clear"
          leftComponent={this.props.left}
          centerComponent={this.props.center}
          rightComponent={this.props.right}
        />
      </ImageBackground>
    )
  }
}