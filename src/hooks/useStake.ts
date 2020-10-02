import { useCallback } from 'react'

import useScorpion from './useScorpion'
import { useWallet } from 'use-wallet'

import { stake, getEmperorScorpionContract } from '../scorpion/utils'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const scorpion = useScorpion()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(
        getEmperorScorpionContract(scorpion),
        pid,
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, pid, scorpion],
  )

  return { onStake: handleStake }
}

export default useStake
