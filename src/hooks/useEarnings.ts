import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getEmperorScorpionContract } from '../scorpion/utils'
import useScorpion from './useScorpion'
import useBlock from './useBlock'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const scorpion = useScorpion()
  const emperorScorpionContract = getEmperorScorpionContract(scorpion)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(emperorScorpionContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, emperorScorpionContract, scorpion])

  useEffect(() => {
    if (account && emperorScorpionContract && scorpion) {
      fetchBalance()
    }
  }, [account, block, emperorScorpionContract, setBalance, scorpion])

  return balance
}

export default useEarnings
