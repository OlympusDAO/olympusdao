import "src/components/Migration/MigrationModal.scss";

import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch } from "react-redux";
import { InfoTooltip, Modal, Tab, Tabs } from "src/components/library";
import { trim } from "src/helpers";
import { useMigrationData } from "src/helpers/Migration";
import { changeMigrationApproval, migrateSingle, TokenType } from "src/slices/MigrateThunk";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { AppDispatch } from "src/store";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";

function MigrationModalSingle({ open, handleClose }: { open: boolean; handleClose: any }) {
  const dispatch: AppDispatch = useDispatch();

  const isMobileScreen = useMediaQuery("(max-width: 513px)");

  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();

  let rows = [];
  const onSeekApproval = (token: string) => {
    if (!signer) throw new Error("No signer");
    dispatch(
      changeMigrationApproval({
        address,
        networkID: chain.id,
        provider,
        signer,
        token: token.toLowerCase(),
        displayName: token,
        insertName: true,
      }),
    );
  };

  const {
    view,
    changeView,
    currentOhmBalance,
    currentSOhmBalance,
    currentWSOhmBalance,
    wsOhmPrice,
    gOHMPrice,
    ohmFullApproval,
    sOhmFullApproval,
    wsOhmFullApproval,
    ohmAsgOHM,
    sOHMAsgOHM,
    ohmInUSD,
    sOhmInUSD,
    wsOhmInUSD,
    isGOHM,
    targetAsset,
    targetMultiplier,
    oldAssetsDetected,
    pendingTransactions,
  } = useMigrationData();

  const onMigrate = (type: number, amount: string) => {
    if (!signer) throw new Error("No signer");
    dispatch(migrateSingle({ provider, address, signer, networkID: chain.id, gOHM: isGOHM, type, amount }));
  };

  rows = [
    {
      initialAsset: "OHM",
      initialBalance: currentOhmBalance,
      targetAsset: targetAsset,
      targetBalance: ohmAsgOHM * targetMultiplier,
      fullApproval: ohmFullApproval,
      usdBalance: ohmInUSD,
      type: TokenType.UNSTAKED,
      display: gOHMPrice! * ohmAsgOHM > 10,
    },
    {
      initialAsset: "sOHM",
      initialBalance: currentSOhmBalance,
      targetAsset: targetAsset,
      targetBalance: sOHMAsgOHM * targetMultiplier,
      fullApproval: sOhmFullApproval,
      usdBalance: sOhmInUSD,
      type: TokenType.STAKED,
      display: gOHMPrice! * sOHMAsgOHM > 10,
    },
    {
      initialAsset: "wsOHM",
      initialBalance: currentWSOhmBalance,
      targetAsset: targetAsset,
      targetBalance: +currentWSOhmBalance * targetMultiplier,
      fullApproval: wsOhmFullApproval,
      usdBalance: wsOhmInUSD,
      type: TokenType.WRAPPED,
      display: wsOhmPrice * +currentWSOhmBalance > 10,
    },
  ];

  return (
    <div>
      <Modal
        aria-labelledby="migration-modal-title"
        aria-describedby="migration-modal-description"
        open={open}
        minHeight={"200px"}
        closePosition={"left"}
        onClose={handleClose}
        closeAfterTransition
        headerText={!oldAssetsDetected ? `Migration complete` : `You have assets ready to migrate to v2`}
      >
        <>
          {!oldAssetsDetected ? null : (
            <Box paddingTop={isMobileScreen ? 2 : 4} paddingBottom={isMobileScreen ? 2 : 0}>
              <Typography id="migration-modal-description" variant="body2" className={isMobileScreen ? `mobile` : ``}>
                {`Olympus v2 introduces upgrades to on-chain governance and bonds to enhance decentralization and immutability.`}{" "}
                <a
                  href="https://docs.olympusdao.finance/main/basics/migration"
                  target="_blank"
                  color="inherit"
                  rel="noopener noreferrer"
                  className="docs-link"
                >
                  <u>Learn More</u>
                </a>
              </Typography>
            </Box>
          )}
          <Box display="flex" justifyContent="center" marginTop={1}>
            <Typography variant="h5" color="textSecondary">
              Migration Output
            </Typography>
          </Box>

          <Tabs
            centered
            value={view}
            textColor="primary"
            indicatorColor="primary"
            onChange={changeView}
            aria-label="payout token tabs"
            className="payout-token-tabs"
          >
            <Tab aria-label="payout-sohm-button" label="sOHM" className="payout-token-tab" />
            <Tab aria-label="payout-sohm-button" label="gOHM" className="payout-token-tab" />
          </Tabs>
          {isMobileScreen ? (
            <Box id="mobile-container-migration">
              {rows
                .filter(asset => +asset.initialBalance > 0 && asset.display)
                .map(row => (
                  <Box style={{ margin: "20px 0px 20px 0px" }}>
                    <Typography
                      id="m-asset-row"
                      style={{ margin: "10px 0px 10px 0px", fontWeight: 500 }}
                    >{`${row.initialAsset} -> ${row.targetAsset}`}</Typography>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      <Typography>
                        {trim(+row.initialBalance, 4)} {row.initialAsset}
                      </Typography>
                      <Typography>{`(${row.usdBalance})`}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" style={{ margin: "10px 0px 10px 0px" }}>
                      {!oldAssetsDetected ? (
                        <Typography align="center" sx={{ color: "#00EE00" }}>
                          Migrated
                        </Typography>
                      ) : row.fullApproval ? (
                        <Button
                          variant="outlined"
                          onClick={() => onMigrate(row.type, row.initialBalance)}
                          disabled={isPendingTxn(pendingTransactions, `migrate_${row.type}_tokens`)}
                        >
                          <Typography>
                            {txnButtonText(pendingTransactions, `migrate_${row.type}_tokens`, `Migrate`)}
                          </Typography>
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={() => onSeekApproval(row.initialAsset)}
                          disabled={isPendingTxn(
                            pendingTransactions,
                            `approve_migration_${row.initialAsset.toLowerCase()}`,
                          )}
                        >
                          <Typography>
                            {txnButtonText(
                              pendingTransactions,
                              `approve_migration_${row.initialAsset.toLowerCase()}`,
                              `Approve`,
                            )}
                          </Typography>
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow style={{ verticalAlign: "top" }}>
                  <TableCell align="center">
                    <Typography>Asset</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Box display="flex">
                      <Box display="inline-flex">
                        <Typography>Pre-migration</Typography>
                        <InfoTooltip
                          message={`This is the current balance of v1 assets in your wallet.`}
                          children={undefined}
                        ></InfoTooltip>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Box display="flex" flexDirection="column">
                      <Box display="inline-flex">
                        <Typography>Post-migration</Typography>
                        <InfoTooltip
                          message={`This is the equivalent amount of gOHM you will have in your wallet once migration is complete.`}
                          children={undefined}
                        ></InfoTooltip>
                      </Box>
                    </Box>
                    <Box display="inline-flex">
                      <Typography variant="body2">(includes rebase rewards)</Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box display="inline-flex">{/* <Typography>Migration Completion Status</Typography> */}</Box>
                  </TableCell>

                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .filter(asset => +asset.initialBalance > 0 && asset.display)
                  .map(row => (
                    <TableRow key={row.initialAsset}>
                      <TableCell component="th" scope="row">
                        <Typography>{`${row.initialAsset} -> ${row.targetAsset}`}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>
                          {trim(+row.initialBalance, 4)} {row.initialAsset}
                          <Typography style={{ marginTop: "10px" }}>{`(${row.usdBalance})`}</Typography>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>
                          {trim(row.targetBalance, 4)} {row.targetAsset}
                          <Typography style={{ marginTop: "10px" }}>{`(${row.usdBalance})`}</Typography>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        {!oldAssetsDetected ? (
                          <Typography align="center" sx={{ color: "#00EE00" }}>
                            Migrated
                          </Typography>
                        ) : row.fullApproval ? (
                          <Button
                            variant="outlined"
                            onClick={() => onMigrate(row.type, row.initialBalance)}
                            disabled={isPendingTxn(pendingTransactions, `migrate_${row.type}_tokens`)}
                          >
                            <Typography>
                              {txnButtonText(pendingTransactions, `migrate_${row.type}_tokens`, `Migrate`)}
                            </Typography>
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            onClick={() => onSeekApproval(row.initialAsset)}
                            disabled={isPendingTxn(
                              pendingTransactions,
                              `approve_migration_${row.initialAsset.toLowerCase()}`,
                            )}
                          >
                            <Typography>
                              {txnButtonText(
                                pendingTransactions,
                                `approve_migration_${row.initialAsset.toLowerCase()}`,
                                `Approve`,
                              )}
                            </Typography>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}

          <div className="help-text">
            <em>
              <Typography variant="body2" style={isMobileScreen ? { lineHeight: "1em" } : {}}>
                Each asset type requires two transactions. First Approve, then Migrate each asset. Amounts less than
                than 10$ are ignored.
              </Typography>
            </em>
          </div>
        </>
      </Modal>
    </div>
  );
}

export default MigrationModalSingle;
