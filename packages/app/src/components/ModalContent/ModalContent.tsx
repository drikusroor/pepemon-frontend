import React from 'react'
import styled from 'styled-components/macro'

const ModalContent: React.FC = ({ children }) => {
	return <StyledModalContent>{children}</StyledModalContent>
}

const StyledModalContent = styled.div`
	padding: ${(props) => props.theme.spacing[2]}px;
`

export default ModalContent
