import 'normalize.css'
import './styles.css'

import debug from 'debug'
import React from 'react'
import Hello from './components/Hello'

const log = debug('app:bootstrap')

// Enable debug messages outside of production
if (process.env.NODE_ENV !== 'production') {
  debug.enable('app:*')
}

log('creating app node')
const appNode = document.createElement('div')
appNode.className = 'app'
appNode.id = 'app'

log('adding app node to body')
document.body.appendChild(appNode)

log('mounting app')
React.render(<Hello/>, appNode, () => {
  log('finished mounting app')
})
