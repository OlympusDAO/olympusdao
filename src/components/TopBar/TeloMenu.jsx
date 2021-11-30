import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { NavLink } from "react-router-dom";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as sTeloTokenImg } from "../../assets/tokens/token_sTELO.svg";
import { ReactComponent as wsTeloTokenImg } from "../../assets/tokens/token_wsTELO.svg";

//import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";

import "./telomenu.scss";
import { cusd, ceuro } from "src/helpers/AllBonds";
import { Trans } from "@lingui/macro";
import { useWeb3Context } from "../../hooks/web3Context";

import token_TELO from "src/assets/tokens/token_TELO.png";
import STeloImg from "src/assets/tokens/token_sTELO.svg";
import WsTeloImg from "src/assets/tokens/token_wsTELO.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

import { segmentUA } from "../../helpers/userAnalyticHelpers";

const addTokenToWallet = (tokenSymbol, tokenAddress, address) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    let tokenPath;
    let tokenDecimals = TOKEN_DECIMALS;
    switch (tokenSymbol) {
      case "TELO":
        tokenPath = TeloImg;
        break;
      case "33T":
        tokenPath = token33tImg;
        break;
      case "wsTELO":
        tokenPath = WsTeloImg;
        tokenDecimals = 18;
        break;
      default:
        tokenPath = STeloImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: imageURL,
          },
        },
      });
      let uaData = {
        address: address,
        type: "Add Token",
        tokenName: tokenSymbol,
      };
      segmentUA(uaData);
    } catch (error) {
      console.log(error);
    }
  }
};

function TeloMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID, address } = useWeb3Context();

  const networkID = chainID;

  const STELO_ADDRESS = addresses[networkID].STELO_ADDRESS;
  const TELO_ADDRESS = addresses[networkID].TELO_ADDRESS;
  const PT_TOKEN_ADDRESS = addresses[networkID].PT_TOKEN_ADDRESS;
  const WSTELO_ADDRESS = addresses[networkID].WSTELO_ADDRESS;
  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = "telo-popper";
  console.log(networkID, cusd);
  const cusdAddress = cusd.getAddressForReserve(networkID);
  const ceuroAddress = ceuro.getAddressForReserve(networkID);
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="telo-menu-button-hover"
    >
      <Button id="telo-menu-button" size="large" variant="contained" color="secondary" title="TELO" aria-describedby={id}>
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>TELO</Typography>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="telo-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    href={`https://app.sushi.com/swap?inputCurrency=${cusdAddress}&outputCurrency=${TELO_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        <Trans>Buy on {new String("Sushiswap")}</Trans>
                        <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>

                  <Link
                    href={`https://app.uniswap.org/#/swap?inputCurrency=${ceuroAddress}&outputCurrency=${TELO_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        <Trans>Buy on {new String("Uniswap")}</Trans>
                        <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>

                  <Link component={NavLink} to="/wrap" style={{ textDecoration: "none" }}>
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">Wrap sTELO</Typography>
                    </Button>
                  </Link>
                </Box>

                <Box component="div" className="data-links">
                  <Divider color="secondary" className="less-margin" />
                  <Link href={`https://dune.xyz/shadow/Telesto-(TELO)`} target="_blank" rel="noreferrer">
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Shadow's Dune Dashboard <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>
                </Box>

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>
                      <Trans>ADD TOKEN TO WALLET</Trans>
                    </p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      {TELO_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("TELO", TELO_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={teloTokenImg}
                            viewBox="0 0 32 32"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">TELO</Typography>
                        </Button>
                      )}
                      {STELO_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("sTELO", STELO_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={sTeloTokenImg}
                            viewBox="0 0 100 100"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">sTELO</Typography>
                        </Button>
                      )}
                      {WSTELO_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("wsTELO", WSTELO_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={wsTeloTokenImg}
                            viewBox="0 0 180 180"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">wsTELO</Typography>
                        </Button>
                      )}
                      {PT_TOKEN_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("33T", PT_TOKEN_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={t33TokenImg}
                            viewBox="0 0 1000 1000"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">33T</Typography>
                        </Button>
                      )}
                    </Box>
                  </Box>
                ) : null}

                <Divider color="secondary" />
                <Link
                  href="https://docs.telesto.world/using-the-website/unstaking_lp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="large" variant="contained" color="secondary" fullWidth>
                    <Typography align="left">
                      <Trans>Unstake Legacy LP Token</Trans>
                    </Typography>
                  </Button>
                </Link>
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default TeloMenu;
