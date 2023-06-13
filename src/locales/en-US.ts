import general from "./en-US/general";
import component from "./en-US/component";
import globalHeader from "./en-US/globalHeader";
import menu from "./en-US/menu";
import pwa from "./en-US/pwa";
import settingDrawer from "./en-US/settingDrawer";
import settings from "./en-US/settings";
import UserPage from "./en-US/userPage";

export default {
  "navBar.lang": "Languages",
  "layout.user.link.help": "Help",
  "layout.user.link.privacy": "Privacy",
  "layout.user.link.terms": "Terms",
  ...general,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...UserPage,
};
