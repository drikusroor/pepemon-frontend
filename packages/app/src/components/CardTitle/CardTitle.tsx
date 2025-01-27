import React from 'react'
import styled from 'styled-components/macro'

interface CardTitleProps {
  text?: string
}

const CardTitle: React.FC<CardTitleProps> = ({ text }) => (
  <StyledCardTitle>{text}</StyledCardTitle>
)

const StyledCardTitle = styled.div`

  font-size: 18px;
  font-weight: 700;
  padding: ${(props) => props.theme.spacing[4]}px;
  text-align: center;
`

export default CardTitle
