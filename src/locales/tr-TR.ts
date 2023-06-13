import general from "./tr-TR/general";
import component from "./tr-TR/component";
import globalHeader from "./tr-TR/globalHeader";
import menu from "./tr-TR/menu";
import pwa from "./tr-TR/pwa";
import settingDrawer from "./tr-TR/settingDrawer";
import settings from "./tr-TR/settings";
import UserPage from "./tr-TR/userPage";

export default {
  "navBar.lang": "Diller",
  "layout.user.link.help": "Yardım",
  "layout.user.link.privacy": "Gizlilik",
  "layout.user.link.terms": "Şartlar",
  ...general,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...UserPage,
};
