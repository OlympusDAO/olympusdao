import { t } from "@lingui/macro";
import { Metric } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatCurrency, formatNumber } from "src/helpers";
import { useGohmPrice, useOhmPrice } from "src/hooks/usePrices";
import {
  useCurrentIndex,
  useGOhmCirculatingSupply,
  useGOhmPrice as useGOhmPriceFromSubgraph,
  useGOhmTotalSupply,
  useMarketCap,
  useOhmCirculatingSupply,
  useOhmFloatingSupply,
  useOhmPrice as useOhmPriceFromSubgraph,
  useOhmTotalSupply,
  useTotalValueDeposited,
  useTreasuryLiquidBackingPerGOhmCirculating,
  useTreasuryLiquidBackingPerOhmFloating,
  useTreasuryMarketValue,
} from "src/hooks/useProtocolMetrics";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { PARAM_SUBGRAPH } from "src/views/TreasuryDashboard/components/Graph/Constants";

type MetricProps = PropsOf<typeof Metric>;
type AbstractedMetricProps = Omit<MetricProps, "metric" | "label" | "tooltip" | "isLoading">;

export const MarketCap: React.FC<AbstractedMetricProps> = props => {
  // Get the subgraphId
  const [searchParams] = useSearchParams();
  const [subgraphId, setSubgraphId] = useState<string | undefined>();
  useEffect(() => {
    setSubgraphId(searchParams.get(PARAM_SUBGRAPH) || undefined);
  }, [searchParams]);

  const { data: marketCap } = useMarketCap(subgraphId);
  const _props: MetricProps = {
    ...props,
    label: t`OHM Market Cap`,
    tooltip: t`Market capitalization is the dollar value of the outstanding OHM tokens. It is calculated here as the price of OHM multiplied by the circulating supply. 
    
    As the displayed OHM price is rounded to 2 decimal places, a manual calculation using the displayed values is likely to slightly differ from the reported market cap. The reported market cap is accurate, as it uses the unrounded price of OHM.

    Note: other sources may be inaccurate.`,
  };

  if (marketCap) _props.metric = formatCurrency(marketCap, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * same as OHMPriceFromSubgraph but uses OHM-DAI on-chain price
 */
export const OHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useOhmPrice();
  const _props: MetricProps = {
    ...props,
    label: "OHM " + t`Price`,
    tooltip: t`This price is sourced from the subgraph, so will lag the real-time market rate.`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * same as OHMPrice but uses Subgraph price
 */
export const OHMPriceFromSubgraph: React.FC<AbstractedMetricProps> = props => {
  // Get the subgraphId
  const [searchParams] = useSearchParams();
  const [subgraphId, setSubgraphId] = useState<string | undefined>();
  useEffect(() => {
    setSubgraphId(searchParams.get(PARAM_SUBGRAPH) || undefined);
  }, [searchParams]);

  const { data: ohmPrice } = useOhmPriceFromSubgraph(subgraphId);
  const _props: MetricProps = {
    ...props,
    label: "OHM " + t`Price`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * uses on-chain price
 */
export const SOHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useOhmPrice();

  const _props: MetricProps = {
    ...props,
    label: "sOHM " + t`Price`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const OhmCirculatingSupply: React.FC<AbstractedMetricProps> = props => {
  // Get the subgraphId
  const [searchParams] = useSearchParams();
  const [subgraphId, setSubgraphId] = useState<string | undefined>();
  useEffect(() => {
    setSubgraphId(searchParams.get(PARAM_SUBGRAPH) || undefined);
  }, [searchParams]);

  const { data: totalSupply } = useOhmTotalSupply(subgraphId);
  const { data: circSupply } = useOhmCirculatingSupply(subgraphId);
  const _props: MetricProps = {
    ...props,
    label: t`OHM Circulating Supply / Total`,
    tooltip: t`Circulating supply is the quantity of outstanding OHM not owned by the protocol (excluding OHM in LPs).`,
  };

  if (circSupply && totalSupply) _props.metric = `${formatNumber(circSupply)} / ${formatNumber(totalSupply)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const GOhmCirculatingSupply: React.FC<AbstractedMetricProps> = props => {
  // Get the subgraphId
  const [searchParams] = useSearchParams();
  const [subgraphId, setSubgraphId] = useState<string | undefined>();
  useEffect(() => {
    setSubgraphId(searchParams.get(PARAM_SUBGRAPH) || undefined);
  }, [searchParams]);

  const { data: totalSupply } = useGOhmTotalSupply(subgraphId);
  const { data: circSupply } = useGOhmCirculatingSupply(subgraphId);
  const _props: MetricProps = {
    ...props,
    label: t`gOHM Circulating Supply / Total`,
    tooltip: t`Circulating supply is the quantity of outstanding gOHM not owned by the protocol (excluding gOHM in LPs).`,
  };

  if (circSupply && totalSupply) _props.metric = `${formatNumber(circSupply)} / ${formatNumber(totalSupply)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const BackingPerOHM: React.FC<AbstractedMetricProps> = props => {
  // Get the subgraphId
  const [searchParams] = useSearchParams();
  const [subgraphId, setSubgraphId] = useState<string | undefined>();
  useEffect(() => {
    setSubgraphId(searchParams.get(PARAM_SUBGRAPH) || undefined);
  }, [searchParams]);

  const { data: floatingSupply } = useOhmFloatingSupply(subgraphId);
  /**
   * Liquid backing per OHM floating is used as the metric here.
   * Liquid backing does not include OHM in protocol-owned liquidity,
   * so it makes sense to do the same for the denominator, and floating supply
   * is circulating supply - OHM in liquidity.
   */
  const { data: liquidBackingPerOhmFloating } = useTreasuryLiquidBackingPerOhmFloating(subgraphId);

  // We include floating supply in the tooltip, as it is not displayed as a separate metric anywhere else
  const tooltip = t`Liquid backing is divided by floating supply of OHM to give liquid backing per OHM.
  
  Floating supply of OHM is the quantity of outstanding OHM not owned by the protocol (including OHM in LPs): ${
    floatingSupply ? formatNumber(floatingSupply) : "Loading..."
  }
  `;

  const _props: MetricProps = {
    ...props,
    label: t`Liquid Backing per OHM`,
    tooltip: tooltip,
  };

  if (liquidBackingPerOhmFloating) _props.metric = `${formatCurrency(liquidBackingPerOhmFloating, 2)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const BackingPerGOHM: React.FC<AbstractedMetricProps> = props => {
  // Get the subgraphId
  const [searchParams] = useSearchParams();
  const [subgraphId, setSubgraphId] = useState<string | undefined>();
  useEffect(() => {
    setSubgraphId(searchParams.get(PARAM_SUBGRAPH) || undefined);
  }, [searchParams]);

  const { data: circulatingSupply } = useGOhmCirculatingSupply(subgraphId);
  /**
   * Liquid backing per gOHM circulating is used as the metric here.
   * Liquid backing does not include OHM in protocol-owned liquidity,
   * so it makes sense to do the same for the denominator, and floating supply
   * is circulating supply - OHM in liquidity.
   */
  const { data: liquidBackingPerGOhmCirculating } = useTreasuryLiquidBackingPerGOhmCirculating(subgraphId);

  // We include circulating supply in the tooltip, as it is not displayed as a separate metric anywhere else
  const tooltip = t`Liquid backing is divided by circulating supply of gOHM to give liquid backing per OHM.
  
  Circulating supply of gOHM is the quantity of outstanding OHM not owned by the protocol (including OHM in LPs): ${
    circulatingSupply ? formatNumber(circulatingSupply) : "Loading..."
  }
  `;

  const _props: MetricProps = {
    ...props,
    label: t`Liquid Backing per gOHM`,
    tooltip: tooltip,
  };

  if (liquidBackingPerGOhmCirculating) _props.metric = `${formatCurrency(liquidBackingPerGOhmCirculating, 2)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const CurrentIndex: React.FC<AbstractedMetricProps> = props => {
  // Get the subgraphId
  const [searchParams] = useSearchParams();
  const [subgraphId, setSubgraphId] = useState<string | undefined>();
  useEffect(() => {
    setSubgraphId(searchParams.get(PARAM_SUBGRAPH) || undefined);
  }, [searchParams]);

  const { data: currentIndex } = useCurrentIndex(subgraphId);
  const _props: MetricProps = {
    ...props,
    label: t`Current Index`,
    tooltip: t`The current index tracks the amount of sOHM accumulated since the beginning of staking. Basically, how much sOHM one would have if they staked and held 1 OHM from launch.`,
  };

  if (currentIndex) _props.metric = `${formatNumber(currentIndex, 2)} sOHM`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * uses contract price
 */
export const GOHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: gOhmPrice } = useGohmPrice();

  const _props: MetricProps = {
    ...props,
    label: "gOHM " + t`Price`,
    tooltip:
      "gOHM = sOHM * index" +
      "\n\n" +
      t`The price of gOHM is equal to the price of OHM multiplied by the current index`,
  };

  if (gOhmPrice) _props.metric = formatCurrency(gOhmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const GOHMPriceFromSubgraph: React.FC<AbstractedMetricProps> = props => {
  // Get the subgraphId
  const [searchParams] = useSearchParams();
  const [subgraphId, setSubgraphId] = useState<string | undefined>();
  useEffect(() => {
    setSubgraphId(searchParams.get(PARAM_SUBGRAPH) || undefined);
  }, [searchParams]);

  const { data: gOhmPrice } = useGOhmPriceFromSubgraph(subgraphId);
  const _props: MetricProps = {
    ...props,
    label: "gOHM " + t`Price`,
    tooltip:
      "gOHM = sOHM * index" +
      "\n\n" +
      t`The price of gOHM is equal to the price of OHM multiplied by the current index`,
  };

  if (gOhmPrice) _props.metric = formatCurrency(gOhmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TotalValueDeposited: React.FC<AbstractedMetricProps> = props => {
  // Get the subgraphId
  const [searchParams] = useSearchParams();
  const [subgraphId, setSubgraphId] = useState<string | undefined>();
  useEffect(() => {
    setSubgraphId(searchParams.get(PARAM_SUBGRAPH) || undefined);
  }, [searchParams]);

  const { data: totalValueDeposited } = useTotalValueDeposited(subgraphId);
  const _props: MetricProps = {
    ...props,
    label: t`Total Value Deposited`,
  };

  if (totalValueDeposited) _props.metric = formatCurrency(totalValueDeposited, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const StakingAPY: React.FC<AbstractedMetricProps> = props => {
  const { data: rebaseRate } = useStakingRebaseRate();
  const _props: MetricProps = {
    ...props,
    label: t`Annualized Rebases`,
  };

  if (rebaseRate) {
    const apy = (Math.pow(1 + rebaseRate, 365 * 3) - 1) * 100;
    const formatted = formatNumber(apy, 1);

    _props.metric = `${formatted}%`;
  } else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TreasuryBalance: React.FC<AbstractedMetricProps> = props => {
  // Get the subgraphId
  const [searchParams] = useSearchParams();
  const [subgraphId, setSubgraphId] = useState<string | undefined>();
  useEffect(() => {
    setSubgraphId(searchParams.get(PARAM_SUBGRAPH) || undefined);
  }, [searchParams]);

  const { data: treasuryMarketValue } = useTreasuryMarketValue(subgraphId);
  const _props: MetricProps = {
    ...props,
    label: t`Treasury Balance`,
  };

  if (treasuryMarketValue) _props.metric = formatCurrency(treasuryMarketValue);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};
