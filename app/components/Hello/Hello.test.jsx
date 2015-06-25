import React, { addons } from 'react/addons'
import expect from 'expect.js'
import Hello from './Hello'

const { describe, it } = global
const { TestUtils } = addons

describe('Component: Hello', () => {
  it('has hello class', () => {
    const hello = TestUtils.renderIntoDocument(<Hello/>)
    const helloNode = React.findDOMNode(hello)
    expect(helloNode.classList.contains('hello')).to.equal(true)
  })

  it('sets default greeting to World', () => {
    const hello = TestUtils.renderIntoDocument(<Hello/>)
    const helloNode = React.findDOMNode(hello)
    expect(helloNode.textContent).to.equal('Hello World!')
  })

  it('sets greeting to name value', () => {
    const hello = TestUtils.renderIntoDocument(<Hello name='Human'/>)
    const helloNode = React.findDOMNode(hello)
    expect(helloNode.textContent).to.equal('Hello Human!')
  })
})
