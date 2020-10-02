import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

export const getEmperorScorpionAddress = (scorpion) => {
  return scorpion && scorpion.emperorScorpionAddress
}
export const getScorpionAddress = (scorpion) => {
  return scorpion && scorpion.scorpionAddress
}
export const getWethContract = (scorpion) => {
  return scorpion && scorpion.contracts && scorpion.contracts.weth
}

export const getEmperorScorpionContract = (scorpion) => {
  return scorpion && scorpion.contracts && scorpion.contracts.emperorScorpion
}
export const getScorpionContract = (scorpion) => {
  return scorpion && scorpion.contracts && scorpion.contracts.scorpion
}

export const getFarms = (scorpion) => {
  return scorpion
    ? scorpion.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          lpAddress,
          lpContract,
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          earnToken: 'scorpion',
          earnTokenAddress: scorpion.contracts.scorpion.options.address,
          icon,
        }),
      )
    : []
}

export const getPoolWeight = async (emperorScorpionContract, pid) => {
  const { allocPoint } = await emperorScorpionContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await emperorScorpionContract.methods
    .totalAllocPoint()
    .call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (emperorScorpionContract, pid, account) => {
  return emperorScorpionContract.methods.pendingScorpion(pid, account).call()
}

export const getTotalLPWethValue = async (
  emperorScorpionContract,
  wethContract,
  lpContract,
  tokenContract,
  pid,
) => {
  // Get balance of the token address
  const tokenAmountWholeLP = await tokenContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  const tokenDecimals = await tokenContract.methods.decimals().call()
  // Get the share of lpContract that emperorScorpionContract owns
  const balance = await lpContract.methods
    .balanceOf(emperorScorpionContract.options.address)
    .call()
  // Convert that into the portion of total lpContract = p1
  const totalSupply = await lpContract.methods.totalSupply().call()
  // Get total weth value for the lpContract = w1
  const lpContractWeth = await wethContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  // Return p1 * w1 * 2
  const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
  const lpWethWorth = new BigNumber(lpContractWeth)
  const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
  // Calculate
  const tokenAmount = new BigNumber(tokenAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(tokenDecimals))

  const wethAmount = new BigNumber(lpContractWeth)
    .times(portionLp)
    .div(new BigNumber(10).pow(18))
  return {
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(emperorScorpionContract, pid),
  }
}

export const approve = async (lpContract, emperorScorpionContract, account) => {
  return lpContract.methods
    .approve(emperorScorpionContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getScorpionSupply = async (scorpion) => {
  return new BigNumber(await scorpion.contracts.scorpion.methods.totalSupply().call())
}

export const stake = async (emperorScorpionContract, pid, amount, account) => {
  return emperorScorpionContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (emperorScorpionContract, pid, amount, account) => {
  return emperorScorpionContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
export const harvest = async (emperorScorpionContract, pid, account) => {
  return emperorScorpionContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (emperorScorpionContract, pid, account) => {
  try {
    const { amount } = await emperorScorpionContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (emperorScorpionContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return emperorScorpionContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}
