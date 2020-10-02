import { useCallback } from 'react'

import useScorpion from './useScorpion'
import { useWallet } from 'use-wallet'

import { unstake, getEmperorScorpionContract } from '../scorpion/utils'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const scorpion = useScorpion()
  const emperorScorpionContract = getEmperorScorpionContract(scorpion)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(emperorScorpionContract, pid, amount, account)
      console.log(txHash)
    },
    [account, pid, scorpion],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
