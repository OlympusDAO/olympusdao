import { ReactComponent as ForumIcon } from "../../assets/icons/forum.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as FeedbackIcon } from "../../assets/icons/feedback.svg";
import { SvgIcon } from "@material-ui/core";
import { Trans } from "@lingui/macro";

const externalUrls = [
  {
    title: <Trans>Forum</Trans>,
    url: "https://forum.telesto.world/",
    icon: <SvgIcon color="primary" component={ForumIcon} />,
  },
  {
    title: <Trans>Governance</Trans>,
    url: "https://vote.telesto.world/",
    icon: <SvgIcon color="primary" component={GovIcon} />,
  },
  {
    title: <Trans>Docs</Trans>,
    url: "https://docs.telesto.world/",
    icon: <SvgIcon color="primary" component={DocsIcon} />,
  },
  // {
  //   title: "Feedback",
  //   url: "https://telestodao.canny.io/",
  //   icon: <SvgIcon color="primary" component={FeedbackIcon} />,
  // },
];

export default externalUrls;
