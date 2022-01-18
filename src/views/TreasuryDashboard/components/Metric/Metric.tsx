import { formatCurrency } from "src/helpers";
import { Metric } from "@olympusdao/component-library";
import { t } from "@lingui/macro";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import {
  useMarketCap,
  useOhmCirculatingSupply,
  useTotalSupply,
  useTreasuryMarketValue,
} from "src/hooks/useProtocolMetrics";
import { useGohmPrice, useOhmPrice } from "src/hooks/usePrices";
import { formatUnits } from "@ethersproject/units";

type MetricProps = PropsOf<typeof Metric>;

const sharedProps: MetricProps = {
  labelVariant: "h6",
  metricVariant: "h5",
};

export const MarketCap = () => {
  const { data: marketCap } = useMarketCap();

  const props: MetricProps = {
    ...sharedProps,
    label: t`Market Cap`,
  };

  if (marketCap) props.metric = formatCurrency(marketCap, 0);
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const OHMPrice = () => {
  const { data: ohmPrice } = useOhmPrice();

  const props: MetricProps = {
    ...sharedProps,
    label: t`OHM Price`,
  };

  if (ohmPrice) props.metric = formatCurrency(ohmPrice, 2);
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const CircSupply = () => {
  const { data: totalSupply } = useTotalSupply();
  const { data: circSupply } = useOhmCirculatingSupply();

  const props: MetricProps = {
    ...sharedProps,
    label: t`Circulating Supply (total)`,
  };

  if (circSupply && totalSupply) props.metric = `${circSupply.toFixed()} / ${totalSupply.toFixed()}`;
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const BackingPerOHM = () => {
  const { data: circSupply } = useOhmCirculatingSupply();
  const { data: treasuryValue } = useTreasuryMarketValue();

  const props: MetricProps = {
    ...sharedProps,
    label: t`Backing per OHM`,
  };

  if (treasuryValue && circSupply) props.metric = formatCurrency(treasuryValue / circSupply, 2);
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const CurrentIndex = () => {
  const { data: currentIndex } = useCurrentIndex();

  const props: MetricProps = {
    ...sharedProps,
    label: t`Current Index`,
    tooltip:
      "The current index tracks the amount of sOHM accumulated since the beginning of staking. Basically, how much sOHM one would have if they staked and held 1 OHM from launch.",
  };

  if (currentIndex) props.metric = `${parseFloat(formatUnits(currentIndex, 9)).toFixed(2)} sOHM`;
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const GOHMPrice = () => {
  const { data: gOhmPrice } = useGohmPrice();

  const props: MetricProps = {
    ...sharedProps,
    label: t`gOHM Price`,
    className: "wsoprice",
    tooltip: "gOHM = sOHM * index\n\nThe price of gOHM is equal to the price of OHM multiplied by the current index",
  };

  if (gOhmPrice) props.metric = formatCurrency(gOhmPrice, 2);
  else props.isLoading = true;

  return <Metric {...props} />;
};
