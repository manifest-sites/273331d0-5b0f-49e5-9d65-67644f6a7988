import { useState, useEffect } from 'react'
import Monetization from './components/monetization/Monetization'
import UnicornJumpGame from './components/UnicornJumpGame'

function App() {

  return (
    <Monetization>
      <UnicornJumpGame />
    </Monetization>
  )
}

export default App