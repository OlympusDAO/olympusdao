import { t } from "@lingui/macro";
import { Box, Tab, Tabs, Zoom } from "@material-ui/core";
import { MetricCollection, Paper } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { OHMPrice, TreasuryBalance } from "../TreasuryDashboard/components/Metric/Metric";
import { BondList } from "./components/BondList";
import { BondModalContainer } from "./components/BondModal/BondModal";
import { ClaimBonds } from "./components/ClaimBonds/ClaimBonds";
import { useLiveBonds } from "./hooks/useLiveBonds";

export const Bond = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentAction, setCurrentAction] = useState<"BOND" | "INVERSE">("BOND");

  const navigate = useNavigate();

  const liveBonds = useLiveBonds();
  const bonds = liveBonds.data;
  const inverse = useLiveBonds({ isInverseBond: true }).data;
  const showTabs = !!inverse && inverse.length > 0 && !!bonds;

  const setCurrentTab = (tab: "BOND" | "INVERSE") => {
    setCurrentAction(tab);
    navigate(`/bonds/${tab === "INVERSE" ? "inverse" : ""}`);
  };

  const changeTab = (_event: React.ChangeEvent<unknown>, newValue: number) => {
    setCurrentTab(newValue === 0 ? "BOND" : "INVERSE");
  };

  useEffect(() => {
    // On initial load, if there are no bonds, switch to inverse bonds
    if (liveBonds.isSuccess && liveBonds.data.length === 0) {
      console.info("There are no live bonds. Switching to inverse bonds instead.");
      setCurrentTab("INVERSE");
    }
  }, [liveBonds.isSuccess, liveBonds.data]);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <ClaimBonds />

        <Zoom in onEntered={() => setIsZoomed(true)}>
          <Paper headerText={currentAction === "INVERSE" ? `${t`Inverse Bond`} (3,1)` : `${t`Bond`} (4,4)`}>
            <MetricCollection>
              <TreasuryBalance />
              <OHMPrice />
            </MetricCollection>

            <Box mt="24px">
              {showTabs && (
                <Tabs
                  centered
                  textColor="primary"
                  aria-label="bond tabs"
                  indicatorColor="primary"
                  value={currentAction === "BOND" ? 0 : 1}
                  onChange={changeTab}
                  // Hides the tab underline while <Zoom> is zooming
                  TabIndicatorProps={!isZoomed ? { style: { display: "none" } } : undefined}
                >
                  <Tab aria-label="bond-button" label={t`Bond`} style={{ fontSize: "1rem" }} />
                  <Tab aria-label="inverse-bond-button" label={t`Inverse Bond`} style={{ fontSize: "1rem" }} />
                </Tabs>
              )}

              {!!bonds && !!inverse && (
                <Box mt="24px">
                  <BondList
                    isInverseBond={currentAction === "INVERSE"}
                    bonds={currentAction === "BOND" ? bonds : inverse}
                  />
                </Box>
              )}
            </Box>
          </Paper>
        </Zoom>
      </Box>
      <Routes>
        <Route path=":id" element={<BondModalContainer />} />
        <Route path="inverse/:id" element={<BondModalContainer />} />
      </Routes>
    </>
  );
};
