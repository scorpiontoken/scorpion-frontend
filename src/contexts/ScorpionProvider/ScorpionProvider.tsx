import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Scorpion } from '../../scorpion'

export interface ScorpionContext {
  scorpion?: typeof Scorpion
}

export const Context = createContext<ScorpionContext>({
  scorpion: undefined,
})

declare global {
  interface Window {
    scorpionsauce: any
  }
}

const ScorpionProvider: React.FC = ({ children }) => {
  const { ethereum }: { ethereum: any } = useWallet()
  const [scorpion, setScorpion] = useState<any>()

  // @ts-ignore
  window.scorpion = scorpion
  // @ts-ignore
  window.eth = ethereum

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId)
      const scorpionLib = new Scorpion(ethereum, chainId, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      })
      setScorpion(scorpionLib)
      window.scorpionsauce = scorpionLib
    }
  }, [ethereum])

  return <Context.Provider value={{ scorpion }}>{children}</Context.Provider>
}

export default ScorpionProvider
