import { useCallback } from 'react'

import useScorpion from './useScorpion'
import { useWallet } from 'use-wallet'

import { harvest, getEmperorScorpionContract } from '../scorpion/utils'

const useReward = (pid: number) => {
  const { account } = useWallet()
  const scorpion = useScorpion()
  const emperorScorpionContract = getEmperorScorpionContract(scorpion)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(emperorScorpionContract, pid, account)
    console.log(txHash)
    return txHash
  }, [account, pid, scorpion])

  return { onReward: handleReward }
}

export default useReward
