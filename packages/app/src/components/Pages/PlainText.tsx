import React from 'react';
import styled from 'styled-components/macro';
import { theme } from '../../theme';

const PlainText: React.FC<any> = ({children}) => {

	return (
		<StyledPlainText>
			{children}
		</StyledPlainText>
	)
}

const StyledPlainText = styled.div`
	background-color: ${theme.color.white};
	border-radius: ${theme.borderRadius}px;
	color: ${theme.color.headers};
	font-family: ${theme.font.inter};
	font-weight: normal;
	padding: 1.5em 2em 2em;
`

export default PlainText
