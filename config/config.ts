import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import pageRoutes from './pageRoutes';


export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'Code And More',
    locale: false,
    siderWidth: 208,
  },
  locale: {
    default: 'tr-TR',
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  proxy: {},
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: 'loginSms',
          path: '/user/smsLogin',
          component: './user/login/SmsLogin',
        },
        {
          name: 'loginMail',
          path: '/user/mailLogin',
          component: './user/login/MailLogin',
        },
      ],
    },
    ...pageRoutes,
    {
      component: './404',
    },
  ],
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },

  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
});
