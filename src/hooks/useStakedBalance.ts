import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getStaked, getEmperorScorpionContract } from '../scorpion/utils'
import useScorpion from './useScorpion'
import useBlock from './useBlock'

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const scorpion = useScorpion()
  const emperorScorpionContract = getEmperorScorpionContract(scorpion)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(emperorScorpionContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, pid, scorpion])

  useEffect(() => {
    if (account && scorpion) {
      fetchBalance()
    }
  }, [account, pid, setBalance, block, scorpion])

  return balance
}

export default useStakedBalance
