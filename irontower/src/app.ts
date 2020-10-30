import { ResponseError } from 'umi-request';
import {
  NavBarProps,
  TitleListItem,
  NarBarListItem,
  TarBarProps,
  TabBarListItem,
} from '@alitajs/alita-layout';
import { Toast } from 'antd-mobile';
import { history } from 'alita';
import { commonFunc } from '@/utils/cordovapluigs';

import HomeGary from './assets/demoIcon/home.png';
import HomeBlue from './assets/demoIcon/home1.png';
import ListGary from './assets/demoIcon/list.png';
import ListBlue from './assets/demoIcon/list1.png';
import SetGary from './assets/demoIcon/setting.png';
import SetBlue from './assets/demoIcon/setting1.png';

export const request = {
  // prefix: 'http://10.45.4.97:8091',
  // prefix: 'http://101.227.245.114:8091', // 测试地址
  // prefix: 'http://119.3.246.199:3927', // 准生产环境
  // prefix: 'http://fx.chinatowercom.cn:8091', // 生产地址i
  prefix: window.prefix,
  method: 'post',
  errorHandler: (error: ResponseError) => {
    // 集中处理错误
    // eslint-disable-next-line no-console
    console.log(error);
    Toast.fail('服务器开小差了~~~');
  },
};

const titleList: TitleListItem[] = [
  {
    pagePath: '/couponsDetail',
    title: '优惠券详情',
  },
  {
    pagePath: '/myOrg',
    title: '我的组织',
  },
  {
    pagePath: '/cabinetDoorInfo',
    title: '电柜信息',
  },
  {
    pagePath: '/powerStation',
    title: '电站详情',
  },
  {
    pagePath: '/index',
    title: '首页',
  },
  {
    pagePath: '/settings',
    title: '设置',
  },
  {
    pagePath: '/list',
    title: '列表',
  },
  {
    pagePath: '/exchangeEleDetail',
    title: '换电详情',
  },
  {
    pagePath: '/eleCabinetDetail',
    title: '电柜详情',
  },
  {
    pagePath: '/exchangeEleList',
    title: '换电记录',
  },
  {
    pagePath: '/personalCenter/personalNews',
    title: '个人信息',
  },
  // {
  //   pagePath: '/personalCenter/modifyName',
  //   title: '修改用户名',
  // },
  {
    pagePath: '/personalCenter/modifyPW',
    title: '密码修改',
  },
  {
    pagePath: '/personalCenter/addressManagement',
    title: '地址管理',
  },
  {
    pagePath: '/personalCenter/modifyPhone',
    title: '修改手机号',
  },
  {
    pagePath: '/personalCenter/setup',
    title: '设置',
  },
  {
    pagePath: '/personalCenter/aboutUs',
    title: '关于我们',
  },
  {
    pagePath: '/personalCenter/userAgreement',
    title: '用户协议',
  },
  {
    pagePath: '/personalCenter/feedBack',
    title: '意见反馈',
  },
  {
    pagePath: '/news/news',
    title: '消息',
  },
  {
    pagePath: '/news/systemMessage',
    title: '通知公告',
  },
  {
    pagePath: '/news/messageDetail',
    title: '通知公告',
  },
  {
    pagePath: '/news/noNews',
    title: '消息',
  },
  {
    pagePath: '/realNameAuth',
    title: '实名认证',
  },
  {
    pagePath: '/myBattery',
    title: '我的电池',
  },
  {
    pagePath: '/myBattery/operationGuide',
    title: '操作指南',
  },
  {
    pagePath: '/myBattery/batterySetting',
    title: '设置',
  },
  {
    pagePath: '/myBattery/batteryTracking',
    title: '实时跟踪',
  },
  {
    pagePath: '/myBattery/movingTrack',
    title: '运动轨迹',
  },
  {
    pagePath: '/myWallet',
    title: '我的钱包',
  },
  {
    pagePath: '/myWallet/deposit',
    title: '缴纳押金',
  },
  {
    pagePath: '/myWallet/applyRefund',
    title: '押金退款申请',
  },
  {
    pagePath: '/myWallet/applyRefundList',
    title: '退款申请单列表',
  },
  {
    pagePath: '/myWallet/applyRefundList/applyRefundDetail',
    title: '退款申请单详情',
  },
  {
    pagePath: '/myWallet/depositType',
    title: '购买套餐',
  },
  {
    pagePath: '/myWallet/myCard',
    title: '我的卡',
  },
  {
    pagePath: '/myWallet/tradingDetail',
    title: '交易明细',
  },
  {
    pagePath: '/myWallet/coupon',
    title: '优惠券',
  },
  {
    pagePath: '/myWallet/packageList',
    title: '购买套餐',
  },
  {
    pagePath: '/myWallet/myPoints',
    title: '我的积分',
  },
  {
    pagePath: '/myWallet/pointsExchange',
    title: '积分兑换',
  },
  {
    pagePath: '/myWallet/pointsDesc',
    title: '积分介绍',
  },
  {
    pagePath: '/myOrder',
    title: '我的订单',
  },
  {
    pagePath: '/myOrder/myOrderDetail',
    title: '套餐详情',
  },
  {
    pagePath: '/myWallet/refundApply',
    title: '退款申请',
  },
  {
    pagePath: '/myWallet/refundDetail',
    title: '退款详情',
  },
  {
    pagePath: '/personalCenter/searchAddress',
    title: '修改使用地',
  },
  {
    pagePath: '/protocol',
    title: '协议详情',
  },
  {
    pagePath: '/couponsView',
    title: '我的优惠券',
  },
  {
    pagePath: '/personalCenter/qrCodeInvate',
    title: '老带新',
  },
  {
    pagePath: '/serviceNetworkDetail',
    title: '网点详情',
  },
  {
    pagePath: '/carManage',
    title: '我的车辆',
  },
  {
    pagePath: '/rentCarList',
    title: '租车记录',
  },
  {
    pagePath: '/rentCarDetail',
    title: '租车详情',
  },
  {
    pagePath: '/personalCenter/InvateHistory',
    title: '邀请记录',
  },

  {
    pagePath: '/ImagePreview',
    title: '大图预览',
  },
  {
    pagePath: '/realNameAuth/ImagePreview',
    title: '大图预览',
  },
];
const navList: NarBarListItem[] = [
  {
    pagePath: '/eleCabinetDetail',
  },
  {
    pagePath: '/myOrg',
  },
  {
    pagePath: '/myWallet/packageList',
    navBar: {
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },
  {
    pagePath: '/myWallet',
    navBar: {
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },
  {
    pagePath: '/personalCenter/feedBack',
    navBar: {
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },
  {
    pagePath: '/myBattery',
    navBar: {
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },
  {
    pagePath: '/personalCenter/setup',
    navBar: {
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },
  {
    pagePath: '/myOrder',
    navBar: {
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },
  {
    pagePath: '/index',
    navBar: {
      hideNavBar: true,
    },
  },
  {
    pagePath: '/',
    navBar: {
      hideNavBar: true,
    },
  },
  {
    pagePath: '/login/forgetPassword',
    navBar: {
      hideNavBar: true,
    },
  },
  {
    pagePath: '/login/resetPassword',
    navBar: {
      hideNavBar: true,
    },
  },
  {
    pagePath: '/login/resetSuccess',
    navBar: {
      hideNavBar: true,
    },
  },
  {
    pagePath: '/login/register',
    navBar: {
      hideNavBar: true,
    },
  },
  {
    pagePath: '/login/registerCode',
    navBar: {
      hideNavBar: true,
    },
  },
  {
    pagePath: '/login/setPassword',
    navBar: {
      hideNavBar: true,
    },
  },
  {
    pagePath: '/myWallet/applyRefundList',
    navBar: {
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },
  {
    pagePath: '/settings',
    navBar: {
      onLeftClick: router => {
        history.goBack();
      },
    },
  },
  {
    pagePath: '/personalCenter/searchAddress',
    navBar: {
      // hideNavBar: true,
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/realNameAuth',
    navBar: {
      pageBackground: '#EDF0F5',
      onLeftClick: () => {
        if (window.location.href.indexOf('native=1') !== -1) {
          commonFunc({
            method: 'popToView',
          });
        } else {
          history.goBack();
        }
      },
    },
  },
  {
    pagePath: '/serviceNetworkDetail',
    navBar: {
      onLeftClick: () => {
        if (window.location.href.indexOf('native=1') !== -1) {
          commonFunc({
            method: 'popToView',
          });
        } else {
          history.goBack();
        }
      },
    },
  },
  {
    pagePath: '/eleCabinetDetail',
    navBar: {
      onLeftClick: () => {
        if (window.location.href.indexOf('native=1') !== -1) {
          commonFunc({
            method: 'popToView',
          });
        } else {
          history.goBack();
        }
      },
    },
  },
  {
    pagePath: '/myBattery/batterySetting',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/myWallet/tradingDetail',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/myWallet/coupon',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/myWallet',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/myWallet/refundApply',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/myWallet/refundDetail',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/myWallet/myPoints',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/exchangeEleList',
    navBar: {
      pageBackground: '#EDF0F5',
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },
  {
    pagePath: '/personalCenter/personalNews',
    navBar: {
      pageBackground: '#EDF0F5',
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },

  {
    pagePath: '/personalCenter/InvateHistory',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/news/news',
    navBar: {
      pageBackground: '#EDF0F5',
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },
  {
    pagePath: '/news/systemMessage',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/personalCenter/modifyName',
    navBar: {
      hideNavBar: true,
    },
  },
  {
    pagePath: '/protocol',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/personalCenter/qrCodeInvate',
    navBar: {
      pageBackground: '#EDF0F5',
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },
  {
    pagePath: '/carManage',
    navBar: {
      pageBackground: '#EDF0F5',
      onLeftClick: () => {
        commonFunc({
          method: 'popToView',
        });
      },
    },
  },
  {
    pagePath: '/rentCarList',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
  {
    pagePath: '/rentCarDetail',
    navBar: {
      pageBackground: '#EDF0F5',
    },
  },
];
const navBar: NavBarProps = {
  navList,
  fixed: true,
  mode: 'light',
  onLeftClick: () => {
    history.goBack();
  },
};
const tabList: TabBarListItem[] = [];

const tabBar: TarBarProps = {
  color: `#999999`,
  selectedColor: '#00A0FF',
  borderStyle: 'white',
  position: 'bottom',
  list: tabList,
};

export const mobileLayout = {
  documentTitle: '',
  navBar,
  tabBar: [],
  titleList,
};
