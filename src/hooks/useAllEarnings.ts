import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getEmperorScorpionContract, getFarms } from '../scorpion/utils'
import useScorpion from './useScorpion'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const scorpion = useScorpion()
  const farms = getFarms(scorpion)
  const emperorScorpionContract = getEmperorScorpionContract(scorpion)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      farms.map(({ pid }: { pid: number }) =>
        getEarned(emperorScorpionContract, pid, account),
      ),
    )
    setBalance(balances)
  }, [account, emperorScorpionContract, scorpion])

  useEffect(() => {
    if (account && emperorScorpionContract && scorpion) {
      fetchAllBalances()
    }
  }, [account, block, emperorScorpionContract, setBalance, scorpion])

  return balances
}

export default useAllEarnings
