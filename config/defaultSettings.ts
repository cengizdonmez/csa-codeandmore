import {Settings as LayoutSettings} from '@ant-design/pro-layout';

export default {
  navTheme: 'light',
  primaryColor: '#de4500',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  logo:"https://www.codeandmore.com.tr//assets/images/logo.jpg",
  menu: {
  },
  title: '',
  pwa: false,
  iconfontUrl: '',
} as LayoutSettings & {
  pwa: boolean;
};
