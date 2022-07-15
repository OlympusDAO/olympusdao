import { t } from "@lingui/macro";
import { Grid, Link, Skeleton, SvgIcon, Tooltip, Typography } from "@mui/material";
import { InfoTooltip } from "@olympusdao/component-library";
import { ReactElement } from "react";
import { ReactComponent as Fullscreen } from "src/assets/icons/fullscreen.svg";
import { ReactComponent as GraphLogo } from "src/assets/icons/graph-grt-logo.svg";

type ChartCardProps = {
  headerText: string;
  headerTooltip?: string;
  headerSubtext?: string;
  subgraphQueryUrl?: string;
  expandedChart?: ReactElement;
  handleOpenExpandedChart?(): void;
  isLoading: boolean;
};

export const ChartCard: React.FC<ChartCardProps> = props => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between" alignItems="flex-start">
          <Grid item xs={11}>
            <Typography variant="h6" color="textSecondary" display="inline">
              {props.headerText}
            </Typography>
            {props.headerTooltip && (
              <Typography variant={"h6"} color="textSecondary" display="inline">
                <InfoTooltip message={props.headerTooltip} />
              </Typography>
            )}
          </Grid>
          <Grid item xs={1}>
            <Grid container spacing={1} justifyContent="flex-end">
              <Grid item>
                {props.subgraphQueryUrl && (
                  <Link href={props.subgraphQueryUrl} target="_blank" rel="noopener noreferrer">
                    <Tooltip title={t`Open Subgraph Query`}>
                      <SvgIcon component={GraphLogo} viewBox="0 0 100 100" style={{ width: "16px", height: "16px" }} />
                    </Tooltip>
                  </Link>
                )}
              </Grid>
              <Grid item>
                {props.handleOpenExpandedChart && (
                  <Tooltip title={t`Open in expanded view`}>
                    <SvgIcon
                      component={Fullscreen}
                      color="primary"
                      onClick={props.handleOpenExpandedChart}
                      style={{ fontSize: "1rem", cursor: "pointer" }}
                    />
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Grid>
          {props.expandedChart}
        </Grid>
        <Grid item xs={12}>
          {props.isLoading ? (
            <Skeleton variant="text" width={100} />
          ) : (
            <Typography variant="h4" fontWeight={600}>
              {props.headerSubtext}
            </Typography>
          )}
        </Grid>
      </Grid>
      {/* We shift the Grid item left and make it wider to ensure that the x-axis labels are aligned with the header & subtext. */}
      <Grid item xs={13} marginLeft={"-10px"}>
        {props.isLoading ? <Skeleton variant="rectangular" width="100%" height={260} /> : props.children}
      </Grid>
    </Grid>
  );
};