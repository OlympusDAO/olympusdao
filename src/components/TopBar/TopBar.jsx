<<<<<<< HEAD
import React, { useState } from "react";
=======
import React from 'react';
import { shorten } from '../../helpers';
import ThemeSwitcher from "../ThemeSwitch/ThemeSwitch";
>>>>>>> fixed links in bond discounts
import { Flex } from "rimble-ui";
<<<<<<< HEAD
import InfoIcon from "@material-ui/icons/Info";
import ThemeSwitcher from "../ThemeSwitch/ThemeSwitch";
=======
import { Button } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
>>>>>>> top bar buttons basic theme applied
import "./topbar.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { addresses } from "../../constants";
import { getOhmTokenImage, getSohmTokenImage } from "../../helpers";
import { useSelector } from "react-redux";

const TOKEN_DECIMALS = 9;
const SOHM_TOKEN_IMAGE = getSohmTokenImage();
const OHM_TOKEN_IMAGE = getOhmTokenImage();
const addOhmToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: tokenSymbol === "OHM" ? OHM_TOKEN_IMAGE : SOHM_TOKEN_IMAGE,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const ohmMenu = (isShown = false, theme = "light", isBigScreen = false, networkID = 1) => {
  const isEthereumAPIAvailable = window.ethereum;
  const SOHM_ADDRESS = addresses[networkID].SOHM_ADDRESS;
  const OHM_ADDRESS = addresses[networkID].OHM_ADDRESS;
  return isShown ? (
    <div className="ohm-card add-ohm-wallet" style={{ right: isBigScreen ? "13vw" : "200px" }}>
      <div className="ohm-menu-container">
        <div style={{ marginBottom: "5px" }}>
          <a
            style={{ fontFamily: "Square", color: theme === "light" ? "black" : "white" }}
            href={`https://app.sushi.com/swap?inputCurrency=${addresses[networkID].RESERVES.DAI}&outputCurrency=${OHM_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
          >
            Buy on Sushiswap{" "}
          </a>
          <i className="fa fa-external-link-alt" />
        </div>
        <div>
          <a
            style={{ fontFamily: "Square", color: theme === "light" ? "black" : "white" }}
            href={`https://app.uniswap.org/#/swap?inputCurrency=${addresses[networkID].RESERVES.FRAX}&outputCurrency=${OHM_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
          >
            Buy on Uniswap{" "}
          </a>
          <i className="fa fa-external-link-alt" />
        </div>
      </div>

      {isEthereumAPIAvailable ? (
        <>
          <hr style={{ color: "grey", margin: "0px" }} />
          <div className="ohm-menu-container">
            <p className="add-token-title">ADD TOKEN TO WALLET</p>
            <div className="ohm-token-name" onClick={addOhmToWallet("OHM", OHM_ADDRESS)}>
              <p>OHM</p>
            </div>
            <div className="ohm-token-name" onClick={addOhmToWallet("sOHM", SOHM_ADDRESS)}>
              <p>sOHM</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  ) : null;
};

<<<<<<< HEAD
function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, theme, toggleTheme }) {
  const [showOhmMenu, setShowOhmMenu] = useState(false);
  const isBigScreen = useMediaQuery("(min-width: 2350px)");
  const networkID = useSelector(state => {
    return (state.app && state.app.networkID) || 1;
  });
=======
function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, address, theme, toggleTheme}) {
	const isVerySmallScreen = useMediaQuery("(max-width: 649px)");
	const isUltraSmallScreen = useMediaQuery("(max-width: 495px)");
>>>>>>> dashboard tiles use graph queries from app state

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
<<<<<<< HEAD
        <button
          type="button"
          className="btn top-bar-button btn-overwrite-primer m-2"
          onClick={logoutOfWeb3Modal}
          key={1}
        >
          Disconnect
        </button>,
      );
    } else {
      modalButtons.push(
        <button type="button" className="btn top-bar-button btn-overwrite-primer m-2" onClick={loadWeb3Modal} key={2}>
          Connect Wallet
        </button>,
=======
        	<Button 
						type="button" 
						variant="contained"
						color="primary"
						className={`btn top-bar-button btn-overwrite-primer m-2`} 
						onClick={logoutOfWeb3Modal} 
						key={1}>
						Disconnect
				</Button>,
      );
    } else {
      modalButtons.push(
        <Button variant="contained" color="secondary" type="button" className={`btn top-bar-button btn-overwrite-primer m-2`} onClick={loadWeb3Modal} key={2}>Connect Wallet</Button>,
>>>>>>> top bar buttons basic theme applied
      );
    }
  }

  return (
<<<<<<< HEAD
    <div className="dapp-topbar">
      {ohmMenu(showOhmMenu, theme, isBigScreen, networkID)}
      <Flex className="dapp-topbar-items">
        <>
          <button
            id="get-ohm"
            className="get-ohm-button btn btn-overwrite-primer m-2 top-bar-button"
            title="Get OHM"
            onClick={() => setShowOhmMenu(!showOhmMenu)}
          >
            <div style={{ paddingTop: "5px" }}>
              <InfoIcon style={{ marginBottom: "5px" }} fontSize="small" /> <span>OHM</span>
            </div>
          </button>
        </>

        <div className="wallet-menu" id="wallet-menu">
          {modalButtons}
        </div>

        <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
      </Flex>
=======
    <div className={`dapp-topbar`}>
			<Flex className="dapp-topbar-items">		
				{!(address && isUltraSmallScreen) &&  
						<ThemeSwitcher 
							theme={theme}
							toggleTheme={toggleTheme} 
						/>
				}
				
				{!isVerySmallScreen && 
					<Button
						id="get-ohm"
						className="get-ohm-button m-2 top-bar-button"
						variant="contained"
						color="secondary"
						title="Get OHM"
					>		
						<a href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899" target="_blank">
							Get OHM
						</a>
					</Button>
				}
				
				<div className="wallet-menu" id="wallet-menu">
					{modalButtons}
					{address && <button type="button" className={`btn top-bar-button btn-overwrite-primer m-2`}>
						<a href={`https://etherscan.io/address/${address}`} target="_blank" className="ml-2">
							{shorten(address)}
						</a>
					</button>
					}
				</div>
			</Flex>
>>>>>>> top bar buttons basic theme applied
    </div>
  );
}

export default TopBar;
