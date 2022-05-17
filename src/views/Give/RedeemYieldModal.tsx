import { t, Trans } from "@lingui/macro";
import { Grid, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Modal, PrimaryButton } from "@olympusdao/component-library";
import { ArrowGraphic } from "src/components/EducationCard";
import { shorten } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useWeb3Context } from "src/hooks/web3Context";

export interface RedeemSubmitCallback {
  (): void;
}

export interface RedeemCancelCallback {
  (): void;
}

type RedeemModalProps = {
  isModalOpen: boolean;
  callbackFunc: RedeemSubmitCallback;
  cancelFunc: RedeemCancelCallback;
  contract: string;
  deposit: DecimalBigNumber;
  redeemableBalance: DecimalBigNumber;
  isMutationLoading: boolean;
};

const DECIMAL_PLACES = 2;
const DECIMAL_FORMAT = { decimals: DECIMAL_PLACES, format: true };

export function RedeemYieldModal({
  isModalOpen,
  callbackFunc,
  cancelFunc,
  redeemableBalance,
  isMutationLoading,
}: RedeemModalProps) {
  const { address } = useWeb3Context();
  const theme = useTheme();
  const themedArrow =
    theme.palette.type === "dark" && theme.colors.primary[300]
      ? theme.colors.primary[300]
      : theme.palette.text.secondary;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const canSubmit = () => {
    if (!address) return false;
    if (isMutationLoading) return false;
    if (redeemableBalance.lt(new DecimalBigNumber("0"))) return false;

    return true;
  };

  /**
   * Calls the submission callback function that is provided to the component.
   */
  const handleSubmit = () => {
    callbackFunc();
  };

  return (
    <Modal open={isModalOpen} onClose={cancelFunc} headerText={t`Redeem Yield`} closePosition="left" minHeight="200px">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" className="grey-text">
                <Trans>Redeemable Yield</Trans>
              </Typography>
              <Typography variant="h6">
                {redeemableBalance.toString(DECIMAL_FORMAT)} {t` sOHM`}
              </Typography>
            </Grid>
            <Grid item sm={4}>
              <ArrowGraphic fill={themedArrow} marginTop="0px" />
            </Grid>
            <Grid item xs={12} sm={4}>
              {/* On small screens, the current and new sOHM deposit numbers are stacked and left-aligned,
                    whereas on larger screens, the numbers are on opposing sides of the box. This adjusts the
                    alignment accordingly. */}
              <Grid container direction="column" alignItems={isSmallScreen ? "flex-start" : "flex-end"}>
                <Grid item xs={12}>
                  <Typography variant="body1" className="grey-text">
                    <Trans>My Wallet Address</Trans>
                  </Typography>
                  <Typography variant="h6">{shorten(address)}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs />
            <Grid item xs={12} md={6}>
              <PrimaryButton disabled={!canSubmit()} onClick={() => handleSubmit()} fullWidth>
                {isMutationLoading
                  ? t`Redeeming ${redeemableBalance.toString(DECIMAL_FORMAT)} sOHM`
                  : t`Approve ${redeemableBalance.toString(DECIMAL_FORMAT)} sOHM`}
              </PrimaryButton>
            </Grid>
            <Grid item xs />
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
}
