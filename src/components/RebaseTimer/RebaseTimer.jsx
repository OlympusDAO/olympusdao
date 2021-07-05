<<<<<<< HEAD
<<<<<<< HEAD
import React from "react";
import { useSelector } from "react-redux";
=======
import React from 'react';
import { useSelector } from 'react-redux';
>>>>>>> dashboard tiles use graph queries from app state
import "./rebasetimer.scss";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../../helpers";
=======
import { useSelector } from "react-redux";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box, Typography } from "@material-ui/core";
import "./rebasetimer.scss";
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented

function RebaseTimer() {
  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const timeUntilRebase = () => {
    if (currentBlock) {
      const rebaseBlock = getRebaseBlock(currentBlock);
      const seconds = secondsUntilBlock(currentBlock, rebaseBlock);
      return prettifySeconds(seconds);
    }
  };

  return (
<<<<<<< HEAD
    <div className="rebase-timer">
      <p>
        <span style={{ fontWeight: "bold" }}>{timeUntilRebase()}</span> to next rebase
      </p>
    </div>
=======
    <Box className="rebase-timer">
      <Typography variant="body2">
        <strong>{timeUntilRebase()}</strong> to next rebase
      </Typography>
    </Box>
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
  );
}

export default RebaseTimer;
