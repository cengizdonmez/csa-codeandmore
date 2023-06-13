export default [
  {
    path: "/welcome",
    name: "dashboard",
    icon: "smile",
    component: "./Welcome",
  },
  {
    name: "list.home",
    icon: "medicineBox",
    path: "/home-screen",
    routes: [
      {
        name: "slider",
        icon: "build",
        path: "/home-screen/slider-setting",
        component: "./SliderSetting",
        hideInMenu: "slider.List",
      },
      {
        name: "mini-slider",
        icon: "block",
        path: "/home-screen/mini-slider-setting",
        component: "./MiniSliderSetting",
        hideInMenu: "mini-slider.List",
      },
      {
        name: "home-setting",
        icon: "setting",
        path: "/home-screen/settings",
        component: "./SettingsPage",
        hideInMenu: "ana-sayfa-ayarlari.List",
      },
      {
        name: "top",
        icon: "setting",
        path: "/home-screen/top",
        component: "./settingPages/HomeTop",
        hideInMenu: "ust-bilgi-mesaji.List",
      },
    ],
  },
  {
    name: "list.menu",
    icon: "menu",
    path: "/menus",
    component: "./MenuList",
    hideInMenu: "menu-islemleri.List",
  },
  {
    name: "list.page-list",
    icon: "copy",
    path: "/pages",
    component: "./PagePages/PageList",
    hideInMenu: "sayfa-islemleri.List",
  },
  {
    name: "list.content-finder-list",
    icon: "copy",
    path: "/content-finder",
    component: "./ContentFinder/PageList",
    hideInMenu: "icerik-bulucu.List",
  },
  {
    name: "list.category-list",
    icon: "appstore",
    path: "/categories",
    component: "./CategoryPages/CategoryList",
    hideInMenu: "kategoriler.List",
  },
  {
    name: "list.text-list",
    icon: "fileText",
    path: "/text",
    component: "./PostPages/PostList",
    hideInMenu: "yazilar.List",
  },
  {
    name: "list.category-list.new",
    path: "/categories/new",
    component: "./CategoryPages/CategoryNew",
    hideInMenu: true,
  },
  {
    name: "list.category-list.edit",
    path: "/categories/edit/:id",
    component: "./CategoryPages/CategoryModify",
    hideInMenu: true,
  },
  {
    name: "list.page-list.new",
    path: "/pages/new",
    component: "./PagePages/PageCreate",
    hideInMenu: true,
  },
  {
    name: "list.page-list.new",
    path: "/pages/new/:pageType/:id/:sub_id",
    component: "./PagePages/PageCreate",
    hideInMenu: true,
  },
  {
    name: "list.page-list.edit",
    path: "/pages/edit/:id",
    component: "./PagePages/PageModify",
    hideInMenu: true,
  },
  {
    name: "list.page-list.edit",
    path: "/pages/edit/:id/:pageType/:sub_id",
    component: "./PagePages/PageModify",
    hideInMenu: true,
  },
  {
    name: "list.text-list.new",
    path: "/text/new",
    component: "./PostPages/PostCreate",
    hideInMenu: true,
  },
  {
    name: "list.text-list.edit",
    path: "/text/edit/:id",
    component: "./PostPages/PostModify",
    hideInMenu: true,
  },
  {
    name: "list.group-list",
    icon: "usergroupAdd",
    path: "/groups",
    component: "./GroupList",
    hideInMenu: true,
  },
  {
    name: "list.template-list",
    icon: "usergroupAdd",
    path: "/template-list",
    component: "./TemplatePages/",
    hideInMenu: "template-ayarlari.List",
  },
  {
    name: "list.template-create",
    icon: "usergroupAdd",
    path: "/template-create",
    component: "./TemplatePages/create",
    hideInMenu: true,
  },
  {
    path: "/main/popupCreate",
    name: "popup-create",
    component: "./PopupPage/PopupCreate",
    icon: "appstore",
    hideInMenu: true,
  },
  {
    path: "/main/popupList",
    name: "list.popup",
    component: "./PopupPage/PopupList",
    icon: "appstore",
    hideInMenu: "popup-islemleri.List",
  },
  {
    name: "list.upload",
    icon: "upload",
    path: "/file-manager",
    component: "./FileManager",
    hideInMenu: "dosya-yoneticisi.List",
  },
  {
    name: "user.create",
    icon: "user",
    path: "/user-create",
    component: "./UserPage/Create",
    hideInMenu: true,
  },
  {
    name: "customer.create",
    icon: "user",
    path: "/customer-create",
    component: "./CustomerPage/Create",
    hideInMenu: true,
  },
  {
    name: "list.setting",
    icon: "setting",
    path: "/setting",
    routes: [
      {
        name: "users",
        icon: "Kullanıcılar",
        path: "/setting/users",
        component: "./UserPage",
        access: "canAdmin",
        hideInMenu: "kullanicilar.List",
      },
      {
        name: "customers",
        icon: "Musteriler",
        path: "/setting/customers",
        component: "./CustomerPage",
        access: "canAdmin",
        hideInMenu: "musteriler.List",
      },
      {
        path: "/setting/user-permissions",
        name: "perm",
        component: "./UserPermissionsPage",
        icon: "appstore",
        hideInMenu: "kullanici-izinleri.List",
      },
      {
        path: "/setting/languages/list",
        name: "lang",
        component: "./LanguageList",
        hideInMenu: "dil-isimleri.List",
      },
      {
        name: "log",
        icon: "alignCenter",
        path: "/setting/log",
        component: "./LogList",
        hideInMenu: "loglar.List",
      },
    ],
  },
  {
    name: "customer",
    icon: "medicineBox",
    path: "/customer",
    routes: [
      {
        name: "CustomerType",
        icon: "setting",
        path: "/customer/customerType/list",
        component: "./CustomerSettings/CustomerType/List",
        hideInMenu: false,
      },
      {
        icon: "setting",
        path: "/customer/customerType/create",
        component: "./CustomerSettings/CustomerType/Create",
        hideInMenu: true,
      },
      {
        name: "customer-plan-list",
        icon: "setting",
        path: "/customer/plan/list",
        component: "./CustomerSettings/Plan/List",
        hideInMenu: false,
      },
      {
        icon: "setting",
        path: "/customer/plan/create",
        component: "./CustomerSettings/Plan/Create",
        hideInMenu: true,
      },
      {
        name: "report-list",
        icon: "setting",
        path: "/customer/report/list",
        component: "./CustomerSettings/Report/List",
        hideInMenu: false,
      },
      {
        icon: "setting",
        path: "/customer/report/create",
        component: "./CustomerSettings/Report/Create",
        hideInMenu: true,
      },
      {
        name: "report-dependent-module-list",
        icon: "setting",
        path: "/customer/report-dependent-modules/list",
        component: "./CustomerSettings/ReportDependentModules/List",
        hideInMenu: false,
      },
      {
        icon: "setting",
        path: "/customer/report-dependent-modules/create",
        component: "./CustomerSettings/ReportDependentModules/Create",
        hideInMenu: true,
      },
      {
        name: "customer-permission-page",
        icon: "setting",
        path: "/customer/customer-permission",
        component: "./CustomerSettings/CustomerPermissionPage/CustomerPermissions",
        hideInMenu: false,
      },
    ],
  },
  {
    name: "list.system",
    icon: "medicineBox",
    path: "/system-setting",
    routes: [
      {
        name: "design-setting",
        icon: "setting",
        path: "/system-setting/design",
        component: "./DesignSettings",
        hideInMenu: "tasarim-ayarlari.List",
      },
      {
        name: "social-media",
        icon: "build",
        path: "/system-setting/social-media",
        component: "./settingPages/SocialMedia",
        hideInMenu: "sosyal-medya.List",
      },
      {
        name: "language",
        icon: "build",
        path: "/system-setting/language",
        component: "./settingPages/Language",
        hideInMenu: "dil-ayarlari.List",
      },
      {
        name: "language-const",
        icon: "build",
        path: "/system-setting/language-const",
        component: "./settingPages/LanguageConst",
        hideInMenu: "dil-sabitleri.List",
      },
      {
        name: "two-factor-selection",
        icon: "build",
        path: "/system-setting/two-factor-auth-selection",
        component: "./settingPages/TwoFacSelection",
        hideInMenu: "dil-sabitleri.List",
      },
      // {
      //   name: "two-factor-settings",
      //   icon: "build",
      //   path: "/system-setting/two-factor-auth-settings",
      //   component: "./settingPages/TwoFacSettings",
      //   hideInMenu: "Dil Sabitleri.List",
      // },
      {
        name: "cache-settings",
        icon: "build",
        path: "/system-setting/cache-settings",
        component: "./settingPages/CacheSettings",
        hideInMenu: "dil-sabitleri.List",
      },
      {
        name: "log-settings",
        icon: "build",
        path: "/system-setting/log-settings",
        component: "./settingPages/LogSettings",
        hideInMenu: "dil-sabitleri.List",
      },
    ],
  },
  {
    path: "/additional-development",
    name: "additional-development",
    component: "./AdditionalDevelopment",
  },
  {
    path: "/",
    redirect: "/welcome",
  },
  {
    path: "/profile",
    hideInMenu: true,
    component: "./user/Profile",
    name: "profile",
  },
  {
    path: "/password-change",
    hideInMenu: true,
    component: "./user/PasswordChange",
    name: "password-change",
  },
  {
    path: "/not-perm",
    name: "Not Perm",
    component: "./NotPermission",
    hideInMenu: true,
  },
];
