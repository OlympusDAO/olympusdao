import {
  Box,
  Grid,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { OHMTokenProps, PrimaryButton, SecondaryButton, Token } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { BorrowRate, OutstandingPrincipal, WeeklyCapacityRemaining } from "src/views/Lending/Cooler/dashboard/Metrics";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerForWallet } from "src/views/Lending/Cooler/hooks/useGetCoolerForWallet";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";
import { CreateOrRepayLoan } from "src/views/Lending/Cooler/positions/CreateOrRepayLoan";
import { ExtendLoan } from "src/views/Lending/Cooler/positions/ExtendLoan";
import { useAccount } from "wagmi";

export const CoolerPositions = () => {
  const { address } = useAccount();
  const [currentClearingHouse, setCurrentClearingHouse] = useState<"v1" | "v2" | "v3">("v3");
  // Get clearing house data for all versions
  const clearingHouses = {
    v1: useGetClearingHouse({ clearingHouse: "clearingHouseV1" }).data,
    v2: useGetClearingHouse({ clearingHouse: "clearingHouseV2" }).data,
    v3: useGetClearingHouse({ clearingHouse: "clearingHouseV3" }).data,
  };

  const [createLoanModalOpen, setCreateLoanModalOpen] = useState(false);
  const { data: loansV1, isFetched: isFetchedLoansV1 } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouses.v1?.factory,
    collateralAddress: clearingHouses.v1?.collateralAddress,
    debtAddress: clearingHouses.v1?.debtAddress,
  });

  const { data: coolerAddressV1 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouses.v1?.factory,
    collateralAddress: clearingHouses.v1?.collateralAddress,
    debtAddress: clearingHouses.v1?.debtAddress,
    clearingHouseVersion: "clearingHouseV1",
  });

  const { data: loansV2, isFetched: isFetchedLoansV2 } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouses.v2?.factory,
    collateralAddress: clearingHouses.v2?.collateralAddress,
    debtAddress: clearingHouses.v2?.debtAddress,
  });

  const { data: coolerAddressV2 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouses.v2?.factory,
    collateralAddress: clearingHouses.v2?.collateralAddress,
    debtAddress: clearingHouses.v2?.debtAddress,
    clearingHouseVersion: "clearingHouseV2",
  });

  const { data: loansV3, isFetched: isFetchedLoansV3 } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouses.v3?.factory,
    collateralAddress: clearingHouses.v3?.collateralAddress,
    debtAddress: clearingHouses.v3?.debtAddress,
  });

  const { data: coolerAddressV3 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouses.v3?.factory,
    collateralAddress: clearingHouses.v3?.collateralAddress,
    debtAddress: clearingHouses.v3?.debtAddress,
    clearingHouseVersion: "clearingHouseV3",
  });

  // Organize version data
  const versionData = {
    v1: {
      loans: { data: loansV1, isFetched: isFetchedLoansV1 },
      coolerAddress: { data: coolerAddressV1 },
    },
    v2: {
      loans: { data: loansV2, isFetched: isFetchedLoansV2 },
      coolerAddress: { data: coolerAddressV2 },
    },
    v3: {
      loans: { data: loansV3, isFetched: isFetchedLoansV3 },
      coolerAddress: { data: coolerAddressV3 },
    },
  };

  const currentData = versionData[currentClearingHouse];
  const coolerAddress = currentData.coolerAddress.data;
  const clearingHouse = clearingHouses[currentClearingHouse];
  const loans = currentData.loans.data;
  const isFetchedLoans = currentData.loans.isFetched;

  const [extendLoan, setExtendLoan] = useState<any>(null);
  const [repayLoan, setRepayLoan] = useState<any>(null);
  const theme = useTheme();

  // Update the clearing house version when the data is available
  useEffect(() => {
    if (clearingHouses.v3?.isActive && clearingHouses.v3?.capacity.gt(0)) {
      setCurrentClearingHouse("v3");
    } else if (clearingHouses.v2?.isActive && clearingHouses.v2?.capacity.gt(0)) {
      setCurrentClearingHouse("v2");
    }
  }, [clearingHouses.v2, clearingHouses.v3]);

  return (
    <div id="cooler-positions">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <WeeklyCapacityRemaining capacity={clearingHouse?.capacity} reserveAsset={clearingHouse?.debtAssetName} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <BorrowRate />
        </Grid>
        <Grid item xs={12} sm={4}>
          <OutstandingPrincipal />
        </Grid>
      </Grid>
      {([(loansV1 || []).length > 0, (loansV2 || []).length > 0, (loansV3 || []).length > 0].filter(Boolean).length >
        1 ||
        (clearingHouses.v3?.isActive &&
          clearingHouses.v3?.capacity.gt(0) &&
          ((loansV1 && loansV1.length > 0) || (loansV2 && loansV2.length > 0)))) && (
        <Box display="flex" mt="16px" justifyContent="right" gap="4px">
          <Select
            value={currentClearingHouse}
            label="ClearingHouse"
            onChange={e => {
              setCurrentClearingHouse(e.target.value as "v1" | "v2" | "v3");
            }}
            sx={{
              width: "200px",
              height: "44px",
              backgroundColor: theme.colors.gray[700],
              border: "none",
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            {loansV1 && loansV1.length > 0 && <MenuItem value="v1">ClearingHouse V1</MenuItem>}
            {((loansV2 && loansV2.length > 0) ||
              (clearingHouses.v2?.capacity.gt(0) && clearingHouses.v2?.isActive)) && (
              <MenuItem value="v2">ClearingHouse V2</MenuItem>
            )}
            {((loansV3 && loansV3.length > 0) ||
              (clearingHouses.v3?.capacity.gt(0) && clearingHouses.v3?.isActive)) && (
              <MenuItem value="v3">ClearingHouse V3</MenuItem>
            )}
          </Select>
        </Box>
      )}

      <Box mb="21px" mt="66px">
        <Typography variant="h1">Your Positions</Typography>
        <div>Borrow from the Olympus Treasury against your gOHM</div>
      </Box>

      {!address && (
        <Box display="flex" justifyContent="center">
          <Typography variant="h4">Please connect your wallet in order to view your positions</Typography>
        </Box>
      )}

      {address && !isFetchedLoans && (
        <Box display="flex" justifyContent="center">
          <Skeleton variant="rectangular" width="100%" height={100} />
        </Box>
      )}

      {loans && loans.length == 0 && isFetchedLoans && (
        <Box display="flex" justifyContent="center">
          <Box textAlign="center">
            <Box fontWeight={700}>You currently have no Cooler loans</Box>
            {clearingHouse?.isActive && clearingHouse.capacity.gt(0) && (
              <>
                <Box pt="9px">Borrow against gOHM at a fixed rate and maturity</Box>
                <Box mt="21px">
                  <PrimaryButton
                    onClick={() => {
                      setRepayLoan(undefined);
                      setCreateLoanModalOpen(true);
                    }}
                  >
                    Borrow {clearingHouse?.debtAssetName} & Open Position
                  </PrimaryButton>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}

      {coolerAddress && (
        <>
          {loans && loans.length > 0 && (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: "15px", padding: "9px" }}>Collateral</TableCell>
                      <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                        Interest Rate
                      </TableCell>
                      <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                        Repayment
                      </TableCell>
                      <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                        Maturity Date
                      </TableCell>
                      <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loans?.map((loan, index) => {
                      const principalAndInterest = loan.principal.add(loan.interestDue || 0) || 0;
                      return (
                        <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell component="th" scope="row" sx={{ padding: "9px" }}>
                            <Box display="flex" alignItems="center" gap="3px">
                              {loan.collateral &&
                                Number(ethers.utils.formatUnits(loan.collateral.toString())).toFixed(4)}{" "}
                              gOHM <Token name="gOHM" style={{ fontSize: "21px" }} />
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ padding: "9px" }}>
                            {loan.request?.interest && (
                              <Box>{Number(ethers.utils.formatUnits(loan.request.interest.toString())) * 100}%</Box>
                            )}
                          </TableCell>
                          <TableCell align="right" sx={{ padding: "9px" }}>
                            {principalAndInterest && (
                              <Box display="flex" justifyContent="end" alignItems={"center"} gap="3px">
                                {Number(ethers.utils.formatUnits(principalAndInterest.toString())).toFixed(2)}{" "}
                                {loan.debtAssetName}{" "}
                                <Token
                                  name={loan.debtAssetName as OHMTokenProps["name"]}
                                  style={{ fontSize: "21px" }}
                                />
                              </Box>
                            )}
                          </TableCell>
                          <TableCell align="right" sx={{ padding: "9px" }}>
                            {loan.expiry && (
                              <Box>
                                {new Date(Number(loan.expiry.toString()) * 1000).toLocaleString([], {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }) || ""}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell align="right" sx={{ padding: "9px" }}>
                            <Box display="flex">
                              <SecondaryButton
                                onClick={() => {
                                  setRepayLoan(loan);
                                  setCreateLoanModalOpen(true);
                                }}
                              >
                                Repay
                              </SecondaryButton>
                              <PrimaryButton onClick={() => setExtendLoan(loan)}>Extend</PrimaryButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {clearingHouse?.isActive && clearingHouse.capacity.gt(0) && (
                <Box display="flex" justifyContent={"center"} gap="4px">
                  <PrimaryButton
                    onClick={() => {
                      setRepayLoan(undefined);
                      setCreateLoanModalOpen(true);
                    }}
                  >
                    Borrow {clearingHouse.debtAssetName} & Open Position
                  </PrimaryButton>
                </Box>
              )}
            </>
          )}
        </>
      )}

      {clearingHouse && (
        <>
          {extendLoan && (
            <ExtendLoan
              loan={extendLoan}
              setLoan={setExtendLoan}
              loanToCollateral={clearingHouse.loanToCollateral}
              interestRate={clearingHouse.interestRate}
              duration={clearingHouse.duration}
              coolerAddress={coolerAddress}
              debtAddress={clearingHouse.debtAddress}
              clearingHouseAddress={clearingHouse.clearingHouseAddress}
              debtAssetName={clearingHouse.debtAssetName}
            />
          )}
          <CreateOrRepayLoan
            collateralAddress={clearingHouse.collateralAddress}
            debtAddress={clearingHouse.debtAddress}
            interestRate={clearingHouse.interestRate}
            loanToCollateral={clearingHouse.loanToCollateral}
            duration={clearingHouse.duration}
            coolerAddress={coolerAddress}
            factoryAddress={clearingHouse.factory}
            capacity={ethers.utils.formatUnits(clearingHouse?.capacity || "0")}
            setModalOpen={setCreateLoanModalOpen}
            modalOpen={createLoanModalOpen}
            loan={repayLoan}
            clearingHouseAddress={clearingHouse.clearingHouseAddress}
            debtAssetName={clearingHouse.debtAssetName}
          />
        </>
      )}
    </div>
  );
};
