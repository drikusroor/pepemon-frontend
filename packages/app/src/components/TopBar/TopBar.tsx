import React, { Suspense, lazy, useEffect, useState, useContext } from 'react';
import styled from 'styled-components/macro';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { useWeb3Modal, useTokenBalance } from '../../hooks';
import { getNativeBalance, getNativeToken, getBalanceNumber, formatAddress } from '../../utils';
import { getBalanceOfBatch } from '../../utils/erc1155';
import { Button, Text } from '../../components';
import { NetworkSwitch } from './components';
import { PepemonProviderContext } from '../../contexts';
import { theme } from '../../theme';
const WalletModal = lazy(() =>  import('./components/WalletModal').then((module) => ({ default: module.default })));
// import { PPMNONE_ANNIVERSARY_SET } from '../../constants/cards';
// import { cards } from '../../constants';

const TopBar: React.FC<any> = ({setChainId}) => {
	const [visibleWalletModal, setVisibleWalletModal] = useState(false);
	const [nativeBalance, setNativeBalance] = useState(new BigNumber(0));
	const [ppblzStakedAmount, setPpblzStakedAmount] = useState(0);
	const [ppdexRewards, setPpdexRewards] = useState(0);
	const [ppmnCardsOwned, setPpmnCardsOwned] = useState(0);
	const [, loadWeb3Modal] = useWeb3Modal();
	const [pepemon] = useContext(PepemonProviderContext);
	const { account, chainId, ppblzAddress, ppdexAddress, contracts, provider } = pepemon;
	const web3 = new Web3(provider);
	// define balances
	useEffect(() => {
		if (!provider) return;
		(async () => {
			const balance = new BigNumber( await getNativeBalance(provider, account) );
			setNativeBalance(balance);
		})();
	}, [chainId, provider, account]);

	const ppblzBalance = useTokenBalance(ppblzAddress);
	const ppdexBalance = useTokenBalance(ppdexAddress);

	// @dev dirty fix: set IDs from 0 to 100
	// TODO: Get all real existing IDs
	// get all tokenIds from cards
	// const tokenIds = cards.get(chainId)?.reduce(function(pv: any, cv: any) {
		// 		return pv.length ? [...pv, ...cv.cards] : [...cv.cards];
		// }, 0);
	// const batchBalanceIds = (chainId === 1 && tokenIds) ? [...tokenIds, ...PPMNONE_ANNIVERSARY_SET.cards] : tokenIds ? [...tokenIds] : [];
	const batchBalanceIds = Array.from(Array(100).keys());

	useEffect(() => {
		(async () => {
			if (!contracts.pepemonFactory) return;
			const batchBalance = await getBalanceOfBatch(contracts.pepemonFactory, account, batchBalanceIds);
			if (batchBalance) {
				// sum of all cards owned
				const sum = batchBalance.reduce((pv, cv) => parseInt(pv) + parseInt(cv), 0);
				setPpmnCardsOwned(sum);
			}
		})()
	}, [contracts.pepemonFactory, chainId, account, batchBalanceIds])

	useEffect(() => {
		setPpdexRewards(0);

		(async () => {
			if(!contracts.ppdex) return;
			// No staking on BSC
			if (chainId !== 56) {
				// Get staked PPBLZ
		        const stakeA = await contracts.ppdex.getAddressPpblzStakeAmount(account);
		        setPpblzStakedAmount(parseFloat(web3.utils.fromWei(stakeA.toString())));

				// Get PPDEX rewards
				const cRewards = (await contracts.ppdex.myRewardsBalance(account)).toString();
				setPpdexRewards(parseFloat(web3.utils.fromWei(cRewards)));
			} else {
				setPpblzStakedAmount(0);
				setPpdexRewards(0);
			}
	    })()
	}, [contracts.ppdex, setPpblzStakedAmount, chainId, account, web3.utils]);

	const totalPpblz = getBalanceNumber(ppblzBalance) + ppblzStakedAmount;
	const totalPpdex = getBalanceNumber(ppdexBalance) + ppdexRewards;


	const handleWalletButtonClick = () => {
		if (account) {
			setVisibleWalletModal(!visibleWalletModal);
		} else {
			loadWeb3Modal();
		}
	}

	return (
		<StyledTopBar {...(account && {border: true})}>
			<StyledTopBarInner>
				{ account &&
					<StyledTopBarInfo>
						<TextInfo as='div' font={theme.font.spaceMace} color={theme.color.purple[800]} style={{ borderRight: '1px solid currentColor' }}>
							<NetworkSwitch {...{appChainId: chainId, providerChainId: chainId, setChainId: setChainId}}/>
						</TextInfo>
						<TextInfo as='p' font={theme.font.spaceMace} color={theme.color.purple[800]} title='In Wallet + Staked PPBLZ'>
							{getBalanceNumber(nativeBalance).toFixed(2)} ${getNativeToken(chainId)}
						</TextInfo>
						{ppblzBalance && (
							<TextInfo as='p' font={theme.font.spaceMace} color={theme.color.purple[800]} title='In Wallet + Staked PPBLZ'>
								{totalPpblz.toFixed(2)} $PPBLZ
							</TextInfo>
						)}
						{ppblzBalance && (
							<TextInfo as='p' font={theme.font.spaceMace} color={theme.color.purple[800]} title='In Wallet + Not Claimed PPDEX'>
								{totalPpdex.toFixed(2)} $PPDEX
							</TextInfo>
						)}
						<TextInfo as='p' font={theme.font.spaceMace} color={theme.color.purple[800]}>{ppmnCardsOwned} unique card{ppmnCardsOwned !== 1 && 's'}</TextInfo>
					</StyledTopBarInfo>
				}
				<Button styling='green' title={account ? 'Your wallet' : 'Connect wallet'} onClick={handleWalletButtonClick}>{!account ? 'Connect wallet' : formatAddress(account)}</Button>
			</StyledTopBarInner>
			{ visibleWalletModal &&
				<Suspense fallback={<></>}>
					<WalletModal account={account} onDismiss={() => setVisibleWalletModal(!visibleWalletModal)}/>
				</Suspense>
			}
		</StyledTopBar>
	);
};

const StyledTopBar = styled.div<{border?: boolean}>`
	background-color: ${props => props.border && 'rgba(255, 255, 255, .6)'};
	border-radius: 10px;
	border: ${props => props.border && `1px solid ${theme.color.purple[800]}`};
	padding: .25em;
	position: absolute;
	right: 2.5em;
	top: 2em;
	z-index: 1;
`

const StyledTopBarInner = styled.div`
	align-items: center;
	display: flex;
`

const StyledTopBarInfo = styled.div`
	align-items: center;
	display: flex;
`

const TextInfo = styled(Text)`
	padding: .4em 1em;
	position: relative;
`

export default TopBar;
