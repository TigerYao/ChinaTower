// @ts-nocheck
import { ApplyPluginsType } from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/node_modules/@umijs/runtime';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/.umi/alita-layout/AlitaLayout.tsx').default,
    "routes": [
      {
        "path": "/ImagePreview",
        "exact": true,
        "component": require('@/pages/ImagePreview/index.tsx').default
      },
      {
        "path": "/cabinetDoorInfo",
        "exact": true,
        "component": require('@/pages/cabinetDoorInfo/index.tsx').default
      },
      {
        "path": "/carManage",
        "exact": true,
        "component": require('@/pages/carManage/index.tsx').default
      },
      {
        "path": "/couponsDetail",
        "exact": true,
        "component": require('@/pages/couponsDetail/index.tsx').default
      },
      {
        "path": "/couponsView",
        "exact": true,
        "component": require('@/pages/couponsView/index.tsx').default
      },
      {
        "path": "/eleCabinetDetail",
        "exact": true,
        "component": require('@/pages/eleCabinetDetail/index.tsx').default
      },
      {
        "path": "/exchangeEleDetail",
        "exact": true,
        "component": require('@/pages/exchangeEleDetail/index.tsx').default
      },
      {
        "path": "/exchangeEleList",
        "exact": true,
        "component": require('@/pages/exchangeEleList/index.tsx').default
      },
      {
        "path": "/index",
        "exact": true,
        "component": require('@/pages/index/index.tsx').default,
        "isResetMainEdit": true
      },
      {
        "path": "/list",
        "exact": true,
        "component": require('@/pages/list/index.tsx').default
      },
      {
        "path": "/login/forgetPassword",
        "exact": true,
        "component": require('@/pages/login/forgetPassword/index.tsx').default
      },
      {
        "path": "/",
        "exact": true,
        "component": require('@/pages/login/index.tsx').default,
        "isResetMainEdit": true
      },
      {
        "path": "/login/register",
        "exact": true,
        "component": require('@/pages/login/register/index.tsx').default
      },
      {
        "path": "/login/registerCode",
        "exact": true,
        "component": require('@/pages/login/registerCode/index.tsx').default
      },
      {
        "path": "/login/resetPassword",
        "exact": true,
        "component": require('@/pages/login/resetPassword/index.tsx').default
      },
      {
        "path": "/login/resetSuccess",
        "exact": true,
        "component": require('@/pages/login/resetSuccess/index.tsx').default
      },
      {
        "path": "/login/setPassword",
        "exact": true,
        "component": require('@/pages/login/setPassword/index.tsx').default
      },
      {
        "path": "/myBattery/batterySetting",
        "exact": true,
        "component": require('@/pages/myBattery/batterySetting/index.tsx').default
      },
      {
        "path": "/myBattery/batteryTracking",
        "exact": true,
        "component": require('@/pages/myBattery/batteryTracking/index.tsx').default
      },
      {
        "path": "/myBattery",
        "exact": true,
        "component": require('@/pages/myBattery/index.tsx').default
      },
      {
        "path": "/myBattery/movingTrack",
        "exact": true,
        "component": require('@/pages/myBattery/movingTrack/index.tsx').default
      },
      {
        "path": "/myBattery/operationGuide",
        "exact": true,
        "component": require('@/pages/myBattery/operationGuide/index.tsx').default
      },
      {
        "path": "/myOrder",
        "exact": true,
        "component": require('@/pages/myOrder/index.tsx').default
      },
      {
        "path": "/myOrder/myOrderDetail",
        "exact": true,
        "component": require('@/pages/myOrder/myOrderDetail/index.tsx').default
      },
      {
        "path": "/myOrg",
        "exact": true,
        "component": require('@/pages/myOrg/index.tsx').default
      },
      {
        "path": "/myWallet/applyRefund",
        "exact": true,
        "component": require('@/pages/myWallet/applyRefund/index.tsx').default
      },
      {
        "path": "/myWallet/applyRefundList/applyRefundDetail",
        "exact": true,
        "component": require('@/pages/myWallet/applyRefundList/applyRefundDetail/index.tsx').default
      },
      {
        "path": "/myWallet/applyRefundList",
        "exact": true,
        "component": require('@/pages/myWallet/applyRefundList/index.tsx').default
      },
      {
        "path": "/myWallet/coupon",
        "exact": true,
        "component": require('@/pages/myWallet/coupon/index.tsx').default
      },
      {
        "path": "/myWallet/deposit",
        "exact": true,
        "component": require('@/pages/myWallet/deposit/index.tsx').default
      },
      {
        "path": "/myWallet/depositType",
        "exact": true,
        "component": require('@/pages/myWallet/depositType/index.tsx').default
      },
      {
        "path": "/myWallet/index",
        "exact": true,
        "component": require('@/pages/myWallet/index/index.tsx').default
      },
      {
        "path": "/myWallet",
        "exact": true,
        "component": require('@/pages/myWallet/index.tsx').default
      },
      {
        "path": "/myWallet/myCard",
        "exact": true,
        "component": require('@/pages/myWallet/myCard/index.tsx').default
      },
      {
        "path": "/myWallet/myPoints",
        "exact": true,
        "component": require('@/pages/myWallet/myPoints/index.tsx').default
      },
      {
        "path": "/myWallet/packageList",
        "exact": true,
        "component": require('@/pages/myWallet/packageList/index.tsx').default
      },
      {
        "path": "/myWallet/pointsDesc",
        "exact": true,
        "component": require('@/pages/myWallet/pointsDesc/index.tsx').default
      },
      {
        "path": "/myWallet/pointsExchange",
        "exact": true,
        "component": require('@/pages/myWallet/pointsExchange/index.tsx').default
      },
      {
        "path": "/myWallet/refundApply",
        "exact": true,
        "component": require('@/pages/myWallet/refundApply/index.tsx').default
      },
      {
        "path": "/myWallet/refundDetail",
        "exact": true,
        "component": require('@/pages/myWallet/refundDetail/index.tsx').default
      },
      {
        "path": "/myWallet/tradingDetail",
        "exact": true,
        "component": require('@/pages/myWallet/tradingDetail/index.tsx').default
      },
      {
        "path": "/news/messageDetail",
        "exact": true,
        "component": require('@/pages/news/messageDetail/index.tsx').default
      },
      {
        "path": "/news/news",
        "exact": true,
        "component": require('@/pages/news/news/index.tsx').default
      },
      {
        "path": "/news/noNews",
        "exact": true,
        "component": require('@/pages/news/noNews/index.tsx').default
      },
      {
        "path": "/news/systemMessage",
        "exact": true,
        "component": require('@/pages/news/systemMessage/index.tsx').default
      },
      {
        "path": "/personalCenter/InvateHistory",
        "exact": true,
        "component": require('@/pages/personalCenter/InvateHistory/index.tsx').default
      },
      {
        "path": "/personalCenter/aboutUs",
        "exact": true,
        "component": require('@/pages/personalCenter/aboutUs/index.tsx').default
      },
      {
        "path": "/personalCenter/addressManagement",
        "exact": true,
        "component": require('@/pages/personalCenter/addressManagement/index.tsx').default
      },
      {
        "path": "/personalCenter/feedBack",
        "exact": true,
        "component": require('@/pages/personalCenter/feedBack/index.tsx').default
      },
      {
        "path": "/personalCenter/modifyName",
        "exact": true,
        "component": require('@/pages/personalCenter/modifyName/index.tsx').default
      },
      {
        "path": "/personalCenter/modifyPW",
        "exact": true,
        "component": require('@/pages/personalCenter/modifyPW/index.tsx').default
      },
      {
        "path": "/personalCenter/modifyPhone",
        "exact": true,
        "component": require('@/pages/personalCenter/modifyPhone/index.tsx').default
      },
      {
        "path": "/personalCenter/personalNews",
        "exact": true,
        "component": require('@/pages/personalCenter/personalNews/index.tsx').default
      },
      {
        "path": "/personalCenter/qrCodeInvate",
        "exact": true,
        "component": require('@/pages/personalCenter/qrCodeInvate/index.tsx').default
      },
      {
        "path": "/personalCenter/searchAddress",
        "exact": true,
        "component": require('@/pages/personalCenter/searchAddress/index.tsx').default
      },
      {
        "path": "/personalCenter/setup",
        "exact": true,
        "component": require('@/pages/personalCenter/setup/index.tsx').default
      },
      {
        "path": "/personalCenter/userAgreement",
        "exact": true,
        "component": require('@/pages/personalCenter/userAgreement/index.tsx').default
      },
      {
        "path": "/powerStation",
        "exact": true,
        "component": require('@/pages/powerStation/index.tsx').default
      },
      {
        "path": "/protocol",
        "exact": true,
        "component": require('@/pages/protocol/index.tsx').default
      },
      {
        "path": "/realNameAuth/ImagePreview",
        "exact": true,
        "component": require('@/pages/realNameAuth/ImagePreview/index.tsx').default
      },
      {
        "path": "/realNameAuth",
        "exact": true,
        "component": require('@/pages/realNameAuth/index.tsx').default
      },
      {
        "path": "/rentCarDetail",
        "exact": true,
        "component": require('@/pages/rentCarDetail/index.tsx').default
      },
      {
        "path": "/rentCarList",
        "exact": true,
        "component": require('@/pages/rentCarList/index.tsx').default
      },
      {
        "path": "/serviceNetworkDetail",
        "exact": true,
        "component": require('@/pages/serviceNetworkDetail/index.tsx').default
      },
      {
        "path": "/settings",
        "exact": true,
        "component": require('@/pages/settings/index.tsx').default
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
