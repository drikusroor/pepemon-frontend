import React, { useState, useRef, useContext } from "react";
import styled from "styled-components/macro";
import { useLocation } from "react-router-dom";
import { up_down_arrows_dark } from "../../../assets";
import { chains } from "../../../constants";
import { PepemonProviderContext } from "../../../contexts";
import { UnhandledError } from "../../../components";
import { theme } from "../../../theme";
import { useOutsideClick } from "../../../hooks";

const NetworkSwitch: React.FC<any> = () => {
	const [chainsListActive, setChainsListActive] = useState(false);
	const [unhandledError, setUnhandledError] = useState({errCode: null, errMsg: ''})
	const networkSwitchRef = useRef(null);
	useOutsideClick(networkSwitchRef, () => {
		if (chainsListActive) {
			setChainsListActive(false);
		}
	})

	const { pathname } = useLocation();

	const isSupportedChain = (chainId: number) => {
		if (pathname.startsWith("/store")) {
			return (chainId === 1 || chainId === 4 || chainId === 56);
		}
		return (chainId === 1 || chainId === 4);
	}

	const [pepemon] = useContext(PepemonProviderContext);
	const { chainId } = pepemon;

	const handleChainSwitch = async (chain) => {
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chain.chainId }],
			});
		} catch (switchError: any) {
			// This error code indicates that the chain has not been added to MetaMask.
			if (switchError.code === 4902) {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [{
							chainId: chain.chainId,
							chainName: chain.chainName,
							nativeCurrency: chain.nativeCurrency,
							rpcUrls: chain.rpcUrls,
							blockExplorerUrls: chain.blockExplorerUrls,
						}]
					});
				} catch (addError: any) {
					console.log(addError);

					// handle "add" error
					setUnhandledError({
						errCode: addError.code,
						errMsg: addError.message
					})
				}
			}
			// handle other "switch" errors
			else {
				setUnhandledError({
					errCode: switchError.code,
					errMsg: switchError.message
				})
			}
		}
		setChainsListActive(false);
	}

	const supportedChains = chains.filter(chain => isSupportedChain(parseInt(chain.chainId)));
	const [currentChain] = chains.filter(chain => (parseInt(chain.chainId) === chainId) && chain.chainName);

	return (
		<>
			<ChainsListButton onClick={() => setChainsListActive(!chainsListActive)}>
				{ currentChain ? currentChain.name : 'Not connected' }
				<img alt="change network" src={up_down_arrows_dark} style={{ width: ".5em", marginLeft: ".8em" }}/>
			</ChainsListButton>
			<ChainsList isOpen={chainsListActive} ref={networkSwitchRef}>
				{ supportedChains.map((chain, key) => {
					return (
						<li key={key}>
							<ChainsListButton disabled={parseInt(chain.chainId) === chainId} aria-label={`change to ${chain.name}`}
								onClick={() => handleChainSwitch(chain)}>
								{chain.name}
							</ChainsListButton>
						</li>
					)
				})}
			</ChainsList>
			{ unhandledError.errCode &&
				<UnhandledError
					errCode={unhandledError.errCode}
					errMsg={unhandledError.errMsg}
					onDismiss={() => setUnhandledError({errCode: null, errMsg: ''})}/>
			}
		</>
	)
}

const ChainsListButton = styled.button`
	background-color: transparent;
	border: none;
	color: currentColor;
	cursor: pointer;
	font-size: inherit;
	font-weight: inherit;

	&:focus-visible {
		outline: none;
		box-shadow: 0px 0px 10px 5px ${theme.color.purple[600]};
	}
`

const ChainsList = styled.ul<{isOpen?: boolean}>`
	background-color: rgba(255, 255, 255, .6);
	border-radius: 10px;
	border: 1px solid ${theme.color.purple[800]};
	display: ${props => !props.isOpen && "none"};
	left: 0;
	list-style-type: none;
	overflow: hidden;
	padding: .25em;
	position: absolute;

	li {
		&:not(:last-child) {
			margin-bottom: .1em;
		}
	}

	${ChainsListButton} {
		border-radius: 10px;
		padding: .4em .9em;
		text-align: left;
		transition: all .4s;
		width: 100%;

		&:hover {
			background-image: linear-gradient(to bottom,#aa6cd6 -100%,#713aac);
			color: ${theme.color.white};
		}
	}
`

export default NetworkSwitch;
