import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
    <StyledLink
      target="_blank"
      href="https://etherscan.io/address/0x5fc4cd40e4Dd3B8A455c4B1aEE9A73161852b5C3#code"
      >
      Scorpion Finance Token
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://etherscan.io/address/0x9F0e63066E31dE98137B9b7865B8edc4086e8E48#code"
      >
        EmperorScorpion Contract
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://etherscan.io/address/0x1585DF30a6EB34E431000c616B2D7711EbE841D5#code"
      >
        Timelock
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://info.uniswap.org/pair/0x0aa03ea5a94057e6245f2530af0faf335a8a7ad5"
      >
        Uniswap SCORP-ETH
      </StyledLink>
      <StyledLink target="_blank" href="https://discord.gg/XZuRrj8">
        Discord
      </StyledLink>
      <StyledLink target="_blank" href="https://github.com/scorpiontoken/scorpion.finance">
        Github
      </StyledLink>
      <StyledLink target="_blank" href="https://twitter.com/FinanceScorpion">
        Twitter
      </StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`

export default Nav
