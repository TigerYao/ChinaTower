import theme from './antdMobileTheme';

export default {
  appType: 'cordova',
  // appType: 'h5',
  mobileLayout: true,
  theme,
  mainPath: '/login',
  keepalive: ['/index'],
  // proxy: {
  //   '/api': {
  //     target: 'http://101.227.245.114:8091',
  //     changeOrigin: true,
  //     pathRewrite: { '^/api': '' },
  //   },
  // },

  // chainWebpack(memo:any) {
  //   memo.module
  //     .rule('media')
  //     .test(/\.(mp4)$/)
  //     .use('file-loader')
  //     .loader(require.resolve('file-loader'))
  // }
};

/**
 * 百度appid:
浏览器：NIpEZqoHe59hu6piM9yD1QwhDOqhHIdy
iOS：qpf1EgzHSGVqEe9XWDswQVrAgAVPM8gD
android：tIKfm9DcvPr4j2xX1rPgUmkB4eDfR0YL
 * 
 * 
 */
