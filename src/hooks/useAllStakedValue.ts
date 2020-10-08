import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import {
  getEmperorScorpionContract,
  getWethContract,
  getFarms,
  getTotalLPWethValue,
} from '../scorpion/utils'
import useScorpion from './useScorpion'
import useBlock from './useBlock'

export interface StakedValue {
  tokenAmount: BigNumber
  wethAmount: BigNumber
  totalWethValue: BigNumber
  tokenPriceInWeth: BigNumber
  poolWeight: BigNumber
}

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const scorpion = useScorpion()
  const farms = getFarms(scorpion)
  const emperorScorpionContract = getEmperorScorpionContract(scorpion)
  const wethContact = getWethContract(scorpion)
  const block = useBlock()

  const fetchAllStakedValue = useCallback(async () => {
    const balances: Array<StakedValue> = await Promise.all(
      farms.map(
        ({
          pid,
          lpContract,
          tokenContract,
        }: {
          pid: number
          lpContract: Contract
          tokenContract: Contract
        }) =>
          getTotalLPWethValue(
            emperorScorpionContract,
            wethContact,
            lpContract,
            tokenContract,
            pid,
          ),
      ),
    )

    setBalance(balances)
  }, [account, emperorScorpionContract, scorpion])

  useEffect(() => {
    if (account && emperorScorpionContract && scorpion) {
      fetchAllStakedValue()
    }
  }, [account, block, emperorScorpionContract, setBalance, scorpion])

  return balances
}

export default useAllStakedValue