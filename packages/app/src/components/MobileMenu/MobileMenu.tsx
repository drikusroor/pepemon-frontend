import React from 'react'
import styled, { keyframes } from 'styled-components/macro'

import { NavLink } from 'react-router-dom'

interface MobileMenuProps {
  onDismiss: () => void
  visible?: boolean
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onDismiss, visible }) => {
  if (visible) {
    return (
      <StyledMobileMenuWrapper>
        <StyledBackdrop onClick={onDismiss} />
        <StyledMobileMenu>
          <StyledLink exact activeClassName="active" to="/" onClick={onDismiss}>
            Home
          </StyledLink>
          <StyledLink
            exact
            activeClassName="active"
            to="/staking"
            onClick={onDismiss}
          >
            Staking
          </StyledLink>
          <StyledLink
              exact
              activeClassName="active"
              to="/store"
              onClick={onDismiss}
          >
              Store
          </StyledLink>
          {/*<StyledLink*/}
          {/*    exact*/}
          {/*    activeClassName="active"*/}
          {/*    to="/christmas"*/}
          {/*    onClick={onDismiss}*/}
          {/*>*/}
          {/*    Christmas*/}
          {/*</StyledLink>*/}
        </StyledMobileMenu>
      </StyledMobileMenuWrapper>
    )
  }
  return null
}

const StyledBackdrop = styled.div`

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const StyledMobileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column-revers;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
`

const slideIn = keyframes`
  0% {
    transform: translateX(0)
  }
  100% {
    transform: translateX(-100%);
  }
`

const StyledMobileMenu = styled.div`
  animation: ${slideIn} 0.3s forwards ease-out;

  display: flex;
  flex: 1;
  flex-direction: column-revers;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 100%;
  bottom: 0;
  width: calc(100% - 48px);
`

const StyledLink = styled(NavLink)`
  box-sizing: border-box;

  font-size: 24px;
  font-weight: 700;
  padding: ${(props) => props.theme.spacing[3]}px
    ${(props) => props.theme.spacing[4]}px;
  text-align: center;
  text-decoration: none;
  width: 100%;
  &:hover {

  }
  &.active {

  }
`

export default MobileMenu
