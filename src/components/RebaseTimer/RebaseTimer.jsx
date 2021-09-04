import { useSelector } from "react-redux";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box, Typography } from "@material-ui/core";
import "./rebasetimer.scss";
import { Skeleton } from "@material-ui/lab";
import { useEffect, useMemo, useState } from "react";

function RebaseTimer() {
  const SECONDS_TO_REFRESH = 60;
  const [secondsToRebase, setSecondsToRebase] = useState(0);
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  // This initializes secondsToRebase as soon as currentBlock becomes available
  useMemo(() => {
    if (currentBlock) {
      const rebaseBlock = getRebaseBlock(currentBlock);
      const seconds = secondsUntilBlock(currentBlock, rebaseBlock);
      setSecondsToRebase(seconds);
      debugger;
    }
  }, [currentBlock]);

  // After every period SECONDS_TO_REFRESH, decrement secondsToRebase by SECONDS_TO_REFRESH,
  // keeping the display up to date without requiring an on chain request to update currentBlock.
  useEffect(() => {
    let interval = null;
    if (secondsToRefresh > 0) {
      interval = setInterval(() => {
        setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setSecondsToRebase(secondsToRebase => secondsToRebase - SECONDS_TO_REFRESH);
      setSecondsToRefresh(SECONDS_TO_REFRESH);
    }
    return () => clearInterval(interval);
  }, [secondsToRebase, secondsToRefresh]);

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        {currentBlock ? (
          secondsToRebase > 0 ? (
            <>
              <strong>{prettifySeconds(secondsToRebase)}</strong> to next rebase
            </>
          ) : (
            <strong>rebasing</strong>
          )
        ) : (
          <Skeleton width="155px" />
        )}
      </Typography>
    </Box>
  );
}

export default RebaseTimer;
