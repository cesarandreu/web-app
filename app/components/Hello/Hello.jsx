require('./Hello.css')
const React = require('react')

/**
 * A component to greet users
 */
const Hello = React.createClass({
  propTypes: {
    /**
     * Name of the user to greet
     */
    name: React.PropTypes.string
  },

  getDefaultProps () {
    return {
      name: 'World'
    }
  },

  render () {
    const {name} = this.props
    return (
      <h1 className='hello'>
        Hello {name}!
      </h1>
    )
  }
})

module.exports = Hello
