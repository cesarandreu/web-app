import cn from './Hello.css'
import React, { Component, PropTypes } from 'react'

/**
 * A component to greet users
 */
export default class Hello extends Component {
  static propTypes = {
    /**
     * Name of the user to greet
     */
    name: PropTypes.string
  }

  static defaultProps = {
    name: 'World'
  }

  render () {
    const {name} = this.props
    return (
      <h1 className={cn.greeting}>
        Hello {name}!
      </h1>
    )
  }
}
