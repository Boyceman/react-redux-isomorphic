/**
 * Created by boyce on 17-6-24.
 */
import React, { Component } from 'react'

export default class Layout1 extends Component {
  constructor(props) {
    console.log(props)
    super(props)
  }

  render() {
    return (
      <div className="layout1">
        {this.props.children}
      </div>
    )
  }
}

Layout1.PropTypes = {}
