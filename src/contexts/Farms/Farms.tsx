import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import useScorpion from '../../hooks/useScorpion'

import { bnToDec } from '../../utils'
import { getEmperorScorpionContract, getEarned } from '../../scorpion/utils'
import { getFarms } from '../../scorpion/utils'

import Context from './context'
import { Farm } from './types'

const Farms: React.FC = ({ children }) => {
  const [unharvested, setUnharvested] = useState(0)

  const scorpion = useScorpion()
  const { account } = useWallet()

  const farms = getFarms(scorpion)

  return (
    <Context.Provider
      value={{
        farms,
        unharvested,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Farms
