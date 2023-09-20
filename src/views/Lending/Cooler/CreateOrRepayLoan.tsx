import { Box, Divider, SvgIcon } from "@mui/material";
import { Modal, OHMSwapCardProps, PrimaryButton, SwapCard, SwapCollection } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { ReactComponent as lendAndBorrowIcon } from "src/assets/icons/lendAndBorrow.svg";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { COOLER_CLEARING_HOUSE_ADDRESSES } from "src/constants/addresses";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { Cooler } from "src/typechain/Cooler";
import { useCreateCooler } from "src/views/Lending/Cooler/hooks/useCreateCooler";
import { useCreateLoan } from "src/views/Lending/Cooler/hooks/useCreateLoan";
import { useRepayLoan } from "src/views/Lending/Cooler/hooks/useRepayLoan";

export const CreateOrRepayLoan = ({
  collateralAddress,
  debtAddress,
  duration,
  interestRate,
  loanToCollateral,
  capacity,
  coolerAddress,
  factoryAddress,
  setModalOpen,
  modalOpen,
  loan,
}: {
  collateralAddress: string;
  debtAddress: string;
  interestRate: string;
  duration: string;
  loanToCollateral: string;
  capacity: string;
  coolerAddress?: string;
  factoryAddress: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
  loan?: {
    request: Cooler.RequestStructOutput;
    principal: BigNumber;
    interestDue: BigNumber;
    collateral: BigNumber;
    expiry: BigNumber;
    lender: string;
    recipient: string;
    callback: boolean;
    loanId: number;
  };
}) => {
  const createCooler = useCreateCooler();
  const createLoan = useCreateLoan();
  const networks = useTestableNetworks();
  const repayLoan = useRepayLoan();

  const maturityDate = loan ? new Date(Number(loan.expiry.toString()) * 1000) : new Date();
  maturityDate.setDate(maturityDate.getDate() + Number(duration || 0));

  const [debtAmount, setDebtAmount] = useState(new DecimalBigNumber("0"));
  const [collateralAmount, setCollateralAmount] = useState(new DecimalBigNumber("0"));
  const { data: collateralBalance } = useBalance({ [networks.MAINNET]: collateralAddress || "" })[networks.MAINNET];

  const collateralValue = Number(loanToCollateral) * Number(collateralBalance || 0);
  const maxYouCanBorrow = Math.min(Number(capacity), collateralValue);

  const paybackAmount = new DecimalBigNumber(
    loan?.principal.add(loan?.interestDue || BigNumber.from("0")) || BigNumber.from("0"),
    18,
  );
  const interestRepaid = Number(paybackAmount) <= Number(loanToCollateral);
  //if collateral minus principal is greater than interest... then calculate on collateral amount.
  const daiCard = (
    <AssetSwapCard
      assetAddress={debtAddress}
      tokenName="DAI"
      value={debtAmount.toString()}
      onChange={(e: { target: { value: DecimalBigNumber | string } }) => {
        const value = typeof e.target.value === "string" ? new DecimalBigNumber(e.target.value) : e.target.value;
        setDebtAmount(value);
        console.log(value, loanToCollateral, paybackAmount, interestRepaid, "dai");

        setCollateralAmount(
          value.div(
            loan && !interestRepaid
              ? new DecimalBigNumber(loanToCollateral).add(new DecimalBigNumber(loan.interestDue, 18))
              : new DecimalBigNumber(loanToCollateral),
          ),
        );
      }}
      loanBalance={loan?.principal.add(loan?.interestDue)}
    />
  );

  const gOHMCard = (
    <AssetSwapCard
      assetAddress={collateralAddress}
      tokenName="gOHM"
      value={collateralAmount.toString()}
      onChange={(e: { target: { value: DecimalBigNumber | string } }) => {
        const value = typeof e.target.value === "string" ? new DecimalBigNumber(e.target.value) : e.target.value;
        setCollateralAmount(value);
        console.log(value, loanToCollateral, paybackAmount, interestRepaid, "gohm");
        setDebtAmount(
          value.mul(
            loan && !interestRepaid
              ? new DecimalBigNumber(loanToCollateral).add(new DecimalBigNumber(loan.interestDue, 18))
              : new DecimalBigNumber(loanToCollateral),
          ),
        );
      }}
    />
  );
  return (
    <Modal
      maxWidth="542px"
      minHeight="200px"
      open={modalOpen}
      headerContent={
        <Box display="flex" alignItems="center" gap="6px">
          <SvgIcon component={lendAndBorrowIcon} /> <Box fontWeight="500">{loan ? "Repay" : "Borrow"} DAI</Box>
        </Box>
      }
      onClose={() => setModalOpen(false)}
    >
      <>
        <SwapCollection UpperSwapCard={loan ? daiCard : gOHMCard} LowerSwapCard={loan ? gOHMCard : daiCard} />
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Max you Can {loan ? "Repay" : "Borrow"}</Box>
          <Box fontWeight="500">{formatNumber(loan ? Number(paybackAmount.toString()) : maxYouCanBorrow, 2)} DAI</Box>
        </Box>
        <Box mt="18px" mb="21px">
          <Divider />
        </Box>
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Interest rate</Box>
          <Box fontWeight="500">{interestRate}%</Box>
        </Box>
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Maturity Date</Box>
          <Box fontWeight="500">
            {maturityDate.toLocaleDateString([], {
              month: "long",
              day: "numeric",
              year: "numeric",
            }) || ""}{" "}
            {maturityDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Loan To Value per gOHM</Box>
          <Box fontWeight="500">{formatNumber(Number(loanToCollateral), 2)} DAI</Box>
        </Box>
        {loan && (
          <>
            <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
              <Box>Principal</Box>
              <Box fontWeight="500">{formatNumber(Number(ethers.utils.formatUnits(loan.principal)), 2)} DAI</Box>
            </Box>
            <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
              <Box>Interest Due</Box>
              <Box fontWeight="500">{formatNumber(Number(ethers.utils.formatUnits(loan.interestDue)), 2)} DAI</Box>
            </Box>
          </>
        )}
        <Box mt="18px" width="100%">
          <WalletConnectedGuard fullWidth>
            {!coolerAddress ? (
              <PrimaryButton
                fullWidth
                onClick={() =>
                  createCooler.mutate({
                    collateralAddress,
                    debtAddress,
                    factoryAddress,
                  })
                }
                loading={createCooler.isLoading}
                disabled={
                  createCooler.isLoading ||
                  Number(debtAmount.toString()) > maxYouCanBorrow ||
                  Number(debtAmount.toString()) === 0
                }
              >
                {Number(debtAmount.toString()) > maxYouCanBorrow ? `Amount requested exceeds max` : `Create Cooler`}
              </PrimaryButton>
            ) : (
              <TokenAllowanceGuard
                tokenAddressMap={{ [networks.MAINNET]: loan ? debtAddress : collateralAddress }}
                spenderAddressMap={loan ? { [networks.MAINNET]: coolerAddress } : COOLER_CLEARING_HOUSE_ADDRESSES}
                isVertical
                message={
                  <>
                    First time {loan ? "repaying" : "borrowing"} with <b>{loan ? "DAI" : "gOHM"}</b>? <br /> Please
                    approve Olympus DAO to use your <b>{loan ? "DAI" : "gOHM"}</b> for borrowing.
                  </>
                }
                spendAmount={new DecimalBigNumber(collateralAmount.toString(), 18)}
              >
                <PrimaryButton
                  onClick={() => {
                    loan
                      ? repayLoan.mutate(
                          {
                            coolerAddress: coolerAddress,
                            loanId: loan.loanId,
                            amount: debtAmount,
                          },
                          {
                            onSuccess: () => {
                              setCollateralAmount(new DecimalBigNumber("0"));
                              setDebtAmount(new DecimalBigNumber("0"));
                              setModalOpen(false);
                            },
                          },
                        )
                      : coolerAddress &&
                        createLoan.mutate(
                          {
                            coolerAddress,
                            borrowAmount: debtAmount,
                          },
                          {
                            onSuccess: () => {
                              setCollateralAmount(new DecimalBigNumber("0"));
                              setDebtAmount(new DecimalBigNumber("0"));
                              setModalOpen(false);
                            },
                          },
                        );
                  }}
                  disabled={
                    (loan ? debtAmount > paybackAmount : Number(debtAmount.toString()) > maxYouCanBorrow) ||
                    Number(debtAmount.toString()) === 0 ||
                    createLoan.isLoading ||
                    repayLoan.isLoading
                  }
                  loading={createLoan.isLoading || repayLoan.isLoading}
                  fullWidth
                >
                  {loan
                    ? debtAmount > paybackAmount
                      ? `Payback Amount exceeds Loan`
                      : `Repay Loan`
                    : Number(debtAmount.toString()) > maxYouCanBorrow
                    ? `Amount requested exceeds max`
                    : `Borrow DAI & Open Position`}
                </PrimaryButton>
              </TokenAllowanceGuard>
            )}
          </WalletConnectedGuard>
        </Box>
      </>
    </Modal>
  );
};

const AssetSwapCard = ({
  assetAddress,
  tokenName,
  value,
  onChange,
  loanBalance,
}: {
  assetAddress: string;
  tokenName: OHMSwapCardProps["token"];
  value: number | string;
  onChange: any;
  loanBalance?: BigNumber;
}) => {
  const networks = useTestableNetworks();
  const { data: balance } = useBalance({ [networks.MAINNET]: assetAddress || "" })[networks.MAINNET];

  const balanceToUse = loanBalance ? new DecimalBigNumber(loanBalance, 18) : balance || new DecimalBigNumber("0");
  return (
    <SwapCard
      id={tokenName as string}
      token={tokenName}
      endString={`${loanBalance ? "Repayment" : "Balance"}: ${Number(balanceToUse?.toString() || "0").toFixed(
        4,
      )} ${tokenName}`}
      value={value}
      onChange={onChange}
      endStringOnClick={() => onChange({ target: { value: balanceToUse } })}
    />
  );
};
