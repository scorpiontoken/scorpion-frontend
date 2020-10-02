import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import useScorpion from './useScorpion'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { getAllowance } from '../utils/erc20'
import { getEmperorScorpionContract } from '../scorpion/utils'

const useAllowance = (lpContract: Contract) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()
  const scorpion = useScorpion()
  const emperorScorpionContract = getEmperorScorpionContract(scorpion)

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      lpContract,
      emperorScorpionContract,
      account,
    )
    setAllowance(new BigNumber(allowance))
  }, [account, emperorScorpionContract, lpContract])

  useEffect(() => {
    if (account && emperorScorpionContract && lpContract) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, emperorScorpionContract, lpContract])

  return allowance
}

export default useAllowance
