import { format } from "date-fns";
import { CSSProperties, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CategoricalChartFunc, CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { formatCurrency, trim } from "src/helpers";
import { getFloat } from "src/helpers/NumberHelper";
import { getMaximumValue } from "src/helpers/ProtocolMetricsHelper";
import { ChartCard, DEFAULT_HEIGHT } from "src/views/TreasuryDashboard/components/Graph/ChartCard";

import { ChartType, DataFormat } from "./Constants";
import CustomTooltip from "./CustomTooltip";
import ExpandedChart from "./ExpandedChart";
import {
  getAreaColor,
  getDataIntersections,
  getDataWithRange,
  getIntersectionColor,
  RANGE_KEY,
} from "./IntersectionHelper";

const TICK_COUNT = 3;
const TICK_COUNT_EXPANDED = 5;
const XAXIS_PADDING_RIGHT = 30;
const TICK_INTERVAL_XAXIS = 10;
const LINE_STROKE_WIDTH = 3;

export const formatCurrencyTick = (value: unknown): string => {
  const valueNum: number = getFloat(value);

  if (!valueNum) return "";

  if (valueNum > 1000000) {
    return `${formatCurrency(valueNum / 1000000)}M`;
  }

  if (valueNum > 1000) {
    return `${formatCurrency(valueNum / 1000)}k`;
  }

  return formatCurrency(valueNum, 2);
};

export const formatPercentTick = (value: unknown): string => {
  const valueNum: number = getFloat(value);

  if (!valueNum) return "";

  return trim(valueNum, 2) + "%";
};

export const formatDateMonthTick = (value: unknown): string => {
  const valueNum: number = getFloat(value);

  if (!valueNum) return "";

  return format(new Date(valueNum * 1000), "MMM dd");
};

const getTickFormatter = (dataFormat: DataFormat, value: unknown): string => {
  if (dataFormat == DataFormat.Currency) return formatCurrencyTick(value);

  if (dataFormat == DataFormat.Percentage) return formatPercentTick(value);

  if (dataFormat == DataFormat.DateMonth) return formatDateMonthTick(value);

  return "";
};

const renderAreaChart = (
  data: any[],
  dataKeys: string[],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: Map<string, CSSProperties>,
  categories: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => (
  <AreaChart data={data} margin={margin} onMouseMove={onMouseMove}>
    <defs>
      <linearGradient id={`color-${dataKeys[0]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stroke[0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stroke[0][1]} stopOpacity={0.9} />
      </linearGradient>
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickLine={false}
      tick={tickStyle}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      reversed={true}
      padding={{ right: XAXIS_PADDING_RIGHT }}
    />
    <YAxis
      tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
      axisLine={false}
      tickLine={false}
      tick={tickStyle}
      width={dataFormat == DataFormat.Percentage ? 33 : 55}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[0, maximumYValue]}
      dx={3}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          categories={categories}
          dataFormat={dataFormat}
          dataKey={dataKeys}
          displayTotal={displayTooltipTotal}
        />
      }
    />
    <Area dataKey={dataKeys[0]} stroke="none" fill={`url(#color-${dataKeys[0]})`} fillOpacity={1} />
  </AreaChart>
);

const getValidCSSSelector = (value: string): string => {
  return value.replaceAll(" ", "-");
};

const renderStackedAreaChart = (
  data: any[],
  dataKeys: string[],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: Map<string, CSSProperties>,
  categories: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => (
  <AreaChart data={data} margin={margin} onMouseMove={onMouseMove}>
    <defs>
      {dataKeys.map((value: string, index: number) => {
        return (
          <linearGradient id={`color-${getValidCSSSelector(value)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke[index]} stopOpacity={1} />
            <stop offset="100%" stopColor={stroke[index]} stopOpacity={0.2} />
          </linearGradient>
        );
      })}
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={TICK_INTERVAL_XAXIS}
      axisLine={false}
      tick={tickStyle}
      tickLine={false}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      reversed={true}
      padding={{ right: XAXIS_PADDING_RIGHT }}
    />
    <YAxis
      axisLine={false}
      width={dataFormat == DataFormat.Percentage ? 33 : 55}
      tick={tickStyle}
      tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
      tickLine={false}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[0, maximumYValue]}
      allowDataOverflow={false}
    />
    <Tooltip
      formatter={(value: string) => trim(parseFloat(value), 2)}
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          categories={categories}
          dataFormat={dataFormat}
          dataKey={dataKeys}
          displayTotal={displayTooltipTotal}
        />
      }
    />
    {dataKeys.map((value: string, index: number) => {
      return (
        <Area
          dataKey={value}
          stroke={stroke ? stroke[index] : "none"}
          fill={`url(#color-${getValidCSSSelector(value)})`}
          fillOpacity={1}
          stackId="1"
        />
      );
    })}
  </AreaChart>
);

/**
 * Renders a composed (area & line) chart.
 *
 *
 * @param data
 * @param dataKeys string array with all of the dataKeys that should be rendered
 * @param stroke
 * @param dataFormat
 * @param bulletpointColors
 * @param categories
 * @param isExpanded
 * @param margin
 * @param tickStyle
 * @param maximumYValue
 * @param displayTooltipTotal
 * @param composedLineDataKeys optional string array with the dataKeys that should be rendered as lines
 * @returns
 */
const renderComposedChart = (
  data: any[],
  dataKeys: string[],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: Map<string, CSSProperties>,
  categories: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  displayTooltipTotal?: boolean,
  composedLineDataKeys?: string[],
  onMouseMove?: CategoricalChartFunc,
) => (
  <ComposedChart data={data} margin={margin} onMouseMove={onMouseMove}>
    <defs>
      {dataKeys.map((value: string, index: number) => {
        return (
          <linearGradient id={`color-${getValidCSSSelector(value)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke[index]} stopOpacity={1} />
            <stop offset="100%" stopColor={stroke[index]} stopOpacity={0.2} />
          </linearGradient>
        );
      })}
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={TICK_INTERVAL_XAXIS}
      axisLine={false}
      tick={tickStyle}
      tickLine={false}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      reversed={true}
      padding={{ right: XAXIS_PADDING_RIGHT }}
    />
    <YAxis
      axisLine={false}
      width={dataFormat == DataFormat.Percentage ? 33 : 55}
      tick={tickStyle}
      tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
      tickLine={false}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[0, maximumYValue]}
      allowDataOverflow={false}
    />
    <Tooltip
      formatter={(value: string) => trim(parseFloat(value), 2)}
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          categories={categories}
          dataFormat={dataFormat}
          dataKey={dataKeys}
          totalExcludesDataKeys={composedLineDataKeys}
          displayTotal={displayTooltipTotal}
        />
      }
    />
    {dataKeys.map((value: string, index: number) => {
      /**
       * Any elements in the composed data keys are rendered as values
       * on a dashed, thick line.
       */
      if (composedLineDataKeys && composedLineDataKeys.includes(value)) {
        return (
          <Line
            dataKey={value}
            stroke={stroke ? stroke[index] : "none"}
            fill={`url(#color-${getValidCSSSelector(value)})`}
            dot={false}
            strokeWidth={LINE_STROKE_WIDTH}
            strokeDasharray={"4 1"}
          />
        );
      }

      return (
        <Area
          dataKey={value}
          stroke={stroke ? stroke[index] : "none"}
          fill={`url(#color-${getValidCSSSelector(value)})`}
          fillOpacity={1}
          stackId="1"
        />
      );
    })}
  </ComposedChart>
);

const renderLineChart = (
  data: any[],
  dataKeys: string[],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: Map<string, CSSProperties>,
  categories: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  scale?: string,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => (
  <LineChart data={data} margin={margin} onMouseMove={onMouseMove}>
    <XAxis
      dataKey="timestamp"
      interval={100}
      axisLine={false}
      tick={tickStyle}
      tickCount={3}
      tickLine={false}
      reversed={true}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      padding={{ right: XAXIS_PADDING_RIGHT }}
    />
    <YAxis
      tickCount={scale == "log" ? 1 : isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
      axisLine={false}
      tick={tickStyle}
      tickLine={false}
      width={32}
      scale={() => scale}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[scale == "log" ? "dataMin" : 0, maximumYValue]}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          categories={categories}
          dataFormat={dataFormat}
          dataKey={dataKeys}
          displayTotal={displayTooltipTotal}
        />
      }
    />
    <Line
      type="monotone"
      dataKey={dataKeys[0]}
      stroke={stroke ? stroke[0] : "none"}
      color={stroke ? stroke[0] : "none"}
      dot={false}
    />
    ;
  </LineChart>
);

/**
 * If keys[0] is
 * @param data
 * @param keys
 * @returns
 */
const isLineOneHigher = (data: any[], keys: string[]): boolean => {
  if (!data.length) return false;
  if (keys.length < 2) return false;

  return data[0][keys[0]] > data[0][keys[1]];
};

const renderAreaDifferenceChart = (
  data: any[],
  dataKeys: string[],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: Map<string, CSSProperties>,
  categories: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  itemDecimals?: number,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => {
  // Intersections code from: https://codesandbox.io/s/qdlyi?file=/src/tests/ComparisonChart.js
  /**
   * We add the "range" key to the incoming data.
   * This contains the lower and higher values for the contents of {dataKey}.
   */
  const dataWithRange = getDataWithRange(data, dataKeys);
  /**
   * This obtains the points where any line intersects with the other,
   * which is used to fill an Area element.
   *
   * The data we receive from the subgraph is in reverse-chronological order.
   * The intersections code relies on the data being in chronological order,
   * so we need to reverse the order of the array without mutating the original
   * one.
   */
  const intersections = getDataIntersections(data.slice().reverse(), dataKeys);
  const nonIntersectingAreaColor = getAreaColor(isLineOneHigher(data, dataKeys));

  return (
    <ComposedChart data={dataWithRange} margin={margin} onMouseMove={onMouseMove}>
      <defs>
        <linearGradient id={RANGE_KEY}>
          {intersections.length ? (
            intersections.map((intersection, index) => {
              const nextIntersection = intersections[index + 1];

              const isLast = index === intersections.length - 1;
              const closeColor = getIntersectionColor(intersection, false);
              const startColor = isLast
                ? getIntersectionColor(intersection, true)
                : getIntersectionColor(nextIntersection, false);

              // Determine the offset from the start of the x-axis
              const offset =
                intersection.x /
                (data.filter(value => value[dataKeys[0]] !== undefined && value[dataKeys[1]] != undefined).length - 1);

              return (
                <>
                  <stop offset={offset} stopColor={closeColor} stopOpacity={0.8} />
                  <stop offset={offset} stopColor={startColor} stopOpacity={0.8} />
                </>
              );
            })
          ) : (
            <>
              {/* If there are no intersections in the line, we still want to highlight the area */}
              <stop offset="0%" stopColor={nonIntersectingAreaColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={nonIntersectingAreaColor} stopOpacity={0.8} />
            </>
          )}
        </linearGradient>
      </defs>
      <XAxis
        dataKey="timestamp"
        interval={TICK_INTERVAL_XAXIS}
        axisLine={false}
        reversed={true}
        tick={tickStyle}
        tickCount={TICK_COUNT}
        tickLine={false}
        tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
        padding={{ right: XAXIS_PADDING_RIGHT }}
      />
      <YAxis
        tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
        axisLine={false}
        tick={tickStyle}
        tickLine={false}
        width={25}
        tickFormatter={number => getTickFormatter(dataFormat, number)}
        domain={[0, maximumYValue]}
        allowDataOverflow={false}
      />
      <Tooltip
        content={
          <CustomTooltip
            bulletpointColors={bulletpointColors}
            categories={categories}
            dataFormat={dataFormat}
            itemDecimals={itemDecimals}
            dataKey={dataKeys}
            displayTotal={displayTooltipTotal}
          />
        }
      />
      <Area dataKey={RANGE_KEY} stroke={stroke[0]} fill={`url(#range)`} />
      {dataKeys.map((value: string, index: number) => {
        return <Line dataKey={value} stroke={stroke[index]} dot={false} strokeWidth={LINE_STROKE_WIDTH} />;
      })}
    </ComposedChart>
  );
};

const renderMultiLineChart = (
  data: any[],
  dataKeys: string[],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: Map<string, CSSProperties>,
  categories: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  itemDecimals?: number,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => (
  <LineChart data={data} margin={margin} onMouseMove={onMouseMove}>
    <XAxis
      dataKey="timestamp"
      interval={TICK_INTERVAL_XAXIS}
      axisLine={false}
      reversed={true}
      tick={tickStyle}
      tickCount={TICK_COUNT}
      tickLine={false}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      padding={{ right: XAXIS_PADDING_RIGHT }}
    />
    <YAxis
      tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
      axisLine={false}
      tickLine={false}
      tick={tickStyle}
      width={25}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[0, maximumYValue]}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          categories={categories}
          dataFormat={dataFormat}
          itemDecimals={itemDecimals}
          dataKey={dataKeys}
          displayTotal={displayTooltipTotal}
        />
      }
    />
    {dataKeys.map((value: string, index: number) => {
      return <Line dataKey={value} stroke={stroke[index]} dot={false} strokeWidth={LINE_STROKE_WIDTH} />;
    })}
  </LineChart>
);

// JTBD: Bar chart for Holders
const renderBarChart = (
  data: any[],
  dataKeys: string[],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: Map<string, CSSProperties>,
  categories: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => (
  <BarChart data={data} margin={margin} onMouseMove={onMouseMove}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickCount={TICK_COUNT}
      tick={tickStyle}
      tickLine={false}
      reversed={true}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      padding={{ right: XAXIS_PADDING_RIGHT }}
    />
    <YAxis
      axisLine={false}
      tick={tickStyle}
      tickLine={false}
      tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
      width={33}
      domain={[0, maximumYValue]}
      allowDataOverflow={false}
      tickFormatter={number => (number !== 0 ? number : "")}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          categories={categories}
          dataFormat={dataFormat}
          dataKey={dataKeys}
          displayTotal={displayTooltipTotal}
        />
      }
    />
    <Bar dataKey={dataKeys[0]} fill={stroke[0]} />
  </BarChart>
);

function Chart({
  type,
  data,
  scale,
  dataKeys,
  stroke,
  headerText,
  dataFormat,
  headerSubText,
  bulletpointColors,
  categories,
  infoTooltipMessage,
  isLoading,
  tickStyle,
  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  itemDecimals,
  subgraphQueryUrl,
  displayTooltipTotal,
  composedLineDataKeys,
  onMouseMove,
}: {
  type: ChartType;
  data: any[];
  scale?: string;
  dataKeys: string[];
  stroke: string[];
  headerText: string;
  dataFormat: DataFormat;
  headerSubText: string;
  bulletpointColors: Map<string, CSSProperties>;
  categories: Map<string, string>;
  infoTooltipMessage: string;
  isLoading: boolean;
  tickStyle: Record<string, string | number>;
  margin?: CategoricalChartProps["margin"];
  itemDecimals?: number;
  subgraphQueryUrl?: string;
  displayTooltipTotal?: boolean;
  composedLineDataKeys?: string[];
  onMouseMove?: CategoricalChartFunc;
}) {
  const [open, setOpen] = useState(false);
  const [maximumYValue, setMaximumYValue] = useState(0.0);

  /**
   * Recharts has a bug where using "auto" or "dataMax" as the
   * higher value in the domain does not always result
   * in rendering all of the data. So we calculate the
   * maximum value in the y-axis manually.
   *
   * It is inclosed in useMemo, as it will only need to be recalculated when
   * the dependencies change.
   */
  useMemo(() => {
    if (!data || !data.length) {
      setMaximumYValue(0.0);
      return;
    }

    const tempMaxValue = getMaximumValue(data, dataKeys, type, composedLineDataKeys);
    // Give a bit of a buffer
    setMaximumYValue(tempMaxValue * 1.1);
  }, [data, dataKeys, type, composedLineDataKeys]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderChart = (type: ChartType, isExpanded: boolean) => {
    switch (type) {
      case ChartType.Line: {
        return renderLineChart(
          data,
          dataKeys,
          stroke,
          dataFormat,
          bulletpointColors,
          categories,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          scale,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.Area: {
        return renderAreaChart(
          data,
          dataKeys,
          stroke,
          dataFormat,
          bulletpointColors,
          categories,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.StackedArea: {
        return renderStackedAreaChart(
          data,
          dataKeys,
          stroke,
          dataFormat,
          bulletpointColors,
          categories,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.MultiLine: {
        return renderMultiLineChart(
          data,
          dataKeys,
          stroke,
          dataFormat,
          bulletpointColors,
          categories,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          itemDecimals,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.AreaDifference: {
        return renderAreaDifferenceChart(
          data,
          dataKeys,
          stroke,
          dataFormat,
          bulletpointColors,
          categories,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          itemDecimals,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.Bar: {
        return renderBarChart(
          data,
          dataKeys,
          stroke,
          dataFormat,
          bulletpointColors,
          categories,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.Composed: {
        return renderComposedChart(
          data,
          dataKeys,
          stroke,
          dataFormat,
          bulletpointColors,
          categories,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          displayTooltipTotal,
          composedLineDataKeys,
          onMouseMove,
        );
      }
      default: {
        return <></>;
      }
    }
  };

  const expandedChart = (
    <ExpandedChart
      open={open}
      handleClose={handleClose}
      renderChart={renderChart(type, true)}
      data={data}
      infoTooltipMessage={infoTooltipMessage}
      headerText={headerText}
      headerSubText={headerSubText}
      subgraphQueryUrl={subgraphQueryUrl}
    />
  );

  /**
   * Setting the width to 99% ensures that the chart resizes correctly.
   *
   * Source: https://stackoverflow.com/a/53205850
   */
  return (
    <ChartCard
      headerText={headerText}
      headerTooltip={infoTooltipMessage}
      headerSubtext={headerSubText}
      subgraphQueryUrl={subgraphQueryUrl}
      expandedChart={expandedChart}
      handleOpenExpandedChart={handleOpen}
      isLoading={isLoading}
    >
      <ResponsiveContainer height={DEFAULT_HEIGHT} width="99%">
        {renderChart(type, false)}
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default Chart;
