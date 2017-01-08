import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Header from '../components/Header'
import { openSidebar, closeSidebar } from '../actions/sidebar'

const menus = [
  {name: 'Cookbook list', path: '/'},
  {name: 'Monitor', path: '/monitor'}
]

class App extends Component {

  openSidebar() {
    this.props.dispatch(openSidebar())
  }

  closeSidebar() {
    this.props.dispatch(closeSidebar())
  }

  render() {
    const { children, app } = this.props
    return (
      <div>
        <Header
          openSidebar={app.openSidebar}
          onOpenSidebar={this.openSidebar.bind(this)}
          onCloseSidebar={this.closeSidebar.bind(this)}
          menus={menus}
        />
        {children}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    app: state.app
  }
}

export default connect(
  mapStateToProps
)(App)
