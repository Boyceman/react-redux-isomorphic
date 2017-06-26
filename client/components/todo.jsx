import React, { Component } from 'react'
export default class Todo extends Component {
  static needs = ['ADD_TODO']

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        'todo'
      </div>
    )
  }
}