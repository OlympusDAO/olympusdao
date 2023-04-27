import { useState } from "react";
import { TokenSupply_Filter } from "src/generated/graphql";
import {
  getLiquidBackingPerGOhmSynthetic,
  getLiquidBackingPerOhmBacked,
  getLiquidBackingPerOhmFloating,
} from "src/helpers/subgraph/TreasuryQueryHelper";
import { SUBGRAPH_URLS } from "src/helpers/SubgraphUrlHelper";
import { useCurrentIndex, useOhmPrice } from "src/hooks/useProtocolMetrics";
import { useTokenSuppliesQueries } from "src/hooks/useSubgraphTokenSupplies";
import { useTokenRecordsLatestRecord, useTreasuryLiquidValue } from "src/hooks/useTokenRecordsMetrics";
import { useOhmCirculatingSupply } from "src/hooks/useTokenSupplyMetrics";

/**
 * OHM price * circulating supply
 *
 * @param subgraphUrl
 * @returns
 */
export const useMarketCap = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null): number => {
  const ohmPriceQuery = useOhmPrice(subgraphUrls?.Ethereum);
  return useOhmCirculatingSupply(subgraphUrls, earliestDate) * (ohmPriceQuery.data || 0);
};

/**
 * Liquid backing value / OHM backed supply
 *
 * @param subgraphUrl
 * @returns react-query result wrapping a number representing the liquid backing per OHM
 */
export const useLiquidBackingPerOhmBacked = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null): number => {
  const currentIndexQuery = useCurrentIndex(subgraphUrls?.Ethereum);
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  const supplyQuery = useTokenSuppliesQueries(
    "LiquidBackingPerOhmBacked",
    subgraphUrls,
    tokenSupplyBaseFilter,
    earliestDate,
  );
  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];

  const latestDateQuery = useTokenRecordsLatestRecord(subgraphUrls?.Ethereum);
  const liquidBackingQuery = useTreasuryLiquidValue(
    !latestDateQuery.data ? undefined : latestDateQuery.data.date,
    subgraphUrls,
  );

  return getLiquidBackingPerOhmBacked(liquidBackingQuery, supplyData, currentIndexQuery.data || 0);
};

/**
 * Liquid backing value / OHM floating supply
 *
 * @param subgraphUrl
 * @returns react-query result wrapping a number representing the liquid backing per OHM
 */
export const useLiquidBackingPerOhmFloating = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null): number => {
  const currentIndexQuery = useCurrentIndex(subgraphUrls?.Ethereum);
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  const supplyQuery = useTokenSuppliesQueries(
    "LiquidBackingPerOhmFloating",
    subgraphUrls,
    tokenSupplyBaseFilter,
    earliestDate,
  );
  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];

  const latestDateQuery = useTokenRecordsLatestRecord(subgraphUrls?.Ethereum);
  const liquidBackingQuery = useTreasuryLiquidValue(
    !latestDateQuery.data ? undefined : latestDateQuery.data.date,
    subgraphUrls,
  );

  return getLiquidBackingPerOhmFloating(liquidBackingQuery, supplyData, currentIndexQuery.data || 0);
};

/**
 * Liquid backing value / gOHM synthetic supply
 *
 * @param subgraphUrl
 * @returns react-query result wrapping a number representing the liquid backing per gOHM
 */
export const useLiquidBackingPerGOhm = (subgraphUrls?: SUBGRAPH_URLS, earliestDate?: string | null): number => {
  const currentIndexQuery = useCurrentIndex(subgraphUrls?.Ethereum);
  const [tokenSupplyBaseFilter] = useState<TokenSupply_Filter>({});

  const supplyQuery = useTokenSuppliesQueries(
    "LiquidBackingPerGOhm",
    subgraphUrls,
    tokenSupplyBaseFilter,
    earliestDate,
  );
  const supplyData = supplyQuery && Array.from(supplyQuery).length > 0 ? Array.from(supplyQuery)[0][1] : [];

  const latestDateQuery = useTokenRecordsLatestRecord(subgraphUrls?.Ethereum);
  const liquidBackingQuery = useTreasuryLiquidValue(
    !latestDateQuery.data ? undefined : latestDateQuery.data.date,
    subgraphUrls,
  );

  return getLiquidBackingPerGOhmSynthetic(liquidBackingQuery, currentIndexQuery.data || 0, supplyData);
};
