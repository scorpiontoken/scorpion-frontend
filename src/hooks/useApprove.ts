import { useCallback } from 'react'

import useScorpion from './useScorpion'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { approve, getEmperorScorpionContract } from '../scorpion/utils'

const useApprove = (lpContract: Contract) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const scorpion = useScorpion()
  const emperorScorpionContract = getEmperorScorpionContract(scorpion)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, emperorScorpionContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, emperorScorpionContract])

  return { onApprove: handleApprove }
}

export default useApprove
