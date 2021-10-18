import React, { useState } from 'react';
import { Link, Redirect, useParams } from "react-router-dom";
import { StyledLinkTitle } from '../../../components';
import { StyledStoreWrapper, StyledStoreHeader, StyledStoreBody, StoreCardsCollection, StoreCardsAside, StorePacksAside, StorePacksCollection } from '../components';

const StoreCard : React.FC<any> = () => {
	const [selectedCard, setSelectedCard] = useState(null);
	const [selectedPack, setSelectedPack] = useState(null);

	const routerParams : any = useParams();

	if (!routerParams.storeState) return <Redirect to="/store/cards"/>

	const storeWidth = () =>{
		if ((selectedCard && routerParams.storeState === "cards") ||
		(selectedPack && routerParams.storeState === "boosterpacks")) return "66%";
		return "100%";
	}

	return (
		<div style={{display: 'flex'}}>
			<StyledStoreWrapper style={{ width: storeWidth() }}>
				<StyledStoreHeader>
					<div style={{display: 'flex'}}>
						<StyledLinkTitle isInactive={routerParams.storeState !== "cards"}>
							<Link to={`/store/cards`}>Cards</Link>
						</StyledLinkTitle>
						<StyledLinkTitle isInactive={routerParams.storeState !== "boosterpacks"}>
							<Link to={`/store/boosterpacks`}>Boosterpacks</Link>
						</StyledLinkTitle>
					</div>
				</StyledStoreHeader>
				<StyledStoreBody>
					{routerParams.storeState === "cards" &&
						<StoreCardsCollection setSelectedCard={setSelectedCard} selectedCard={selectedCard}/>
					}
					{routerParams.storeState === "boosterpacks" &&
						<StorePacksCollection setSelectedPack={setSelectedPack} selectedPack={selectedPack}/>
					}
				</StyledStoreBody>
			</StyledStoreWrapper>
			{ (selectedCard && routerParams.storeState === "cards") && <StoreCardsAside setSelectedCard={setSelectedCard} selectedCard={selectedCard}/> }
			{ (selectedPack && routerParams.storeState === "boosterpacks") && <StorePacksAside setSelectedPack={setSelectedPack} selectedPack={selectedPack}/> }
		</div>
	)
}

export default StoreCard;
