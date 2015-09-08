import React, { addons } from 'react/addons'
import expect from 'expect.js'
import Hello from './Hello'

const { describe, it } = global
const { TestUtils } = addons

/**
 * Render Hello component with param props and return the output
 */
function renderHello (props = {}) {
  const renderer = TestUtils.createRenderer()
  renderer.render(<Hello {...props}/>)
  return renderer.getRenderOutput()
}

describe('Component: Hello', () => {
  it('renders an h1 with hello className', () => {
    const { props, type } = renderHello()
    expect(props.className).to.contain('hello')
    expect(type).to.equal('h1')
  })

  it('sets default greeting to World', () => {
    const { props } = renderHello()
    expect(props.children.join('')).to.equal('Hello World!')
  })

  it('sets greeting to name value', () => {
    const { props } = renderHello({ name: 'Human' })
    expect(props.children.join('')).to.equal('Hello Human!')
  })
})
