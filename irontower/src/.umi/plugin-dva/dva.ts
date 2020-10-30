// @ts-nocheck
import { Component } from 'react';
import { ApplyPluginsType } from 'umi';
import dva from 'dva';
// @ts-ignore
import createLoading from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/node_modules/dva-loading/dist/index.esm.js';
import { plugin, history } from '../core/umiExports';

let app:any = null;

function _onCreate() {
  const runtimeDva = plugin.applyPlugins({
    key: 'dva',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    // @ts-ignore
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  
  (runtimeDva.plugins || []).forEach((plugin:any) => {
    app.use(plugin);
  });
  app.model({ namespace: 'aboutUs', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/aboutUs.ts').default) });
app.model({ namespace: 'addressManagement', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/addressManagement.ts').default) });
app.model({ namespace: 'applyRefund', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/applyRefund.ts').default) });
app.model({ namespace: 'applyRefundCell', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/applyRefundCell.ts').default) });
app.model({ namespace: 'applyRefundDetail', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/applyRefundDetail.ts').default) });
app.model({ namespace: 'applyRefundList', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/applyRefundList.ts').default) });
app.model({ namespace: 'batterySetting', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/batterySetting.ts').default) });
app.model({ namespace: 'batteryTracking', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/batteryTracking.ts').default) });
app.model({ namespace: 'cabinetDoorInfo', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/cabinetDoorInfo.ts').default) });
app.model({ namespace: 'carManage', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/carManage.ts').default) });
app.model({ namespace: 'common', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/common.ts').default) });
app.model({ namespace: 'coupon', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/coupon.ts').default) });
app.model({ namespace: 'couponsDetail', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/couponsDetail.ts').default) });
app.model({ namespace: 'couponsView', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/couponsView.ts').default) });
app.model({ namespace: 'deposit', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/deposit.ts').default) });
app.model({ namespace: 'depositType', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/depositType.ts').default) });
app.model({ namespace: 'eleCabinetDetail', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/eleCabinetDetail.ts').default) });
app.model({ namespace: 'exchangeEleDetail', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/exchangeEleDetail.ts').default) });
app.model({ namespace: 'exchangeEleList', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/exchangeEleList.ts').default) });
app.model({ namespace: 'feedBack', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/feedBack.ts').default) });
app.model({ namespace: 'forgetPassword', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/forgetPassword.ts').default) });
app.model({ namespace: 'ImagePreview', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/ImagePreview.ts').default) });
app.model({ namespace: 'index', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/index.ts').default) });
app.model({ namespace: 'InvateHistory', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/InvateHistory.ts').default) });
app.model({ namespace: 'list', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/list.ts').default) });
app.model({ namespace: 'login', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/login.ts').default) });
app.model({ namespace: 'messageDetail', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/messageDetail.ts').default) });
app.model({ namespace: 'modifyName', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/modifyName.ts').default) });
app.model({ namespace: 'modifyPhone', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/modifyPhone.ts').default) });
app.model({ namespace: 'modifyPW', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/modifyPW.ts').default) });
app.model({ namespace: 'myBattery', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myBattery.ts').default) });
app.model({ namespace: 'myCard', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myCard.ts').default) });
app.model({ namespace: 'myOrder', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myOrder.ts').default) });
app.model({ namespace: 'myOrderDetail', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myOrderDetail.ts').default) });
app.model({ namespace: 'myOrg', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myOrg.ts').default) });
app.model({ namespace: 'myPoints', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myPoints.ts').default) });
app.model({ namespace: 'myWallet', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myWallet.ts').default) });
app.model({ namespace: 'news', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/news.ts').default) });
app.model({ namespace: 'newsCard', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/newsCard.ts').default) });
app.model({ namespace: 'noNews', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/noNews.ts').default) });
app.model({ namespace: 'operationGuide', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/operationGuide.ts').default) });
app.model({ namespace: 'packageList', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/packageList.ts').default) });
app.model({ namespace: 'personalNews', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/personalNews.ts').default) });
app.model({ namespace: 'pointsDesc', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/pointsDesc.ts').default) });
app.model({ namespace: 'pointsExchange', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/pointsExchange.ts').default) });
app.model({ namespace: 'powerStation', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/powerStation.ts').default) });
app.model({ namespace: 'protocol', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/protocol.ts').default) });
app.model({ namespace: 'qrCodeInvate', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/qrCodeInvate.ts').default) });
app.model({ namespace: 'realNameAuth', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/realNameAuth.ts').default) });
app.model({ namespace: 'refundApply', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/refundApply.ts').default) });
app.model({ namespace: 'refundDetail', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/refundDetail.ts').default) });
app.model({ namespace: 'register', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/register.ts').default) });
app.model({ namespace: 'registerCode', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/registerCode.ts').default) });
app.model({ namespace: 'rentCarDetail', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/rentCarDetail.ts').default) });
app.model({ namespace: 'rentCarList', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/rentCarList.ts').default) });
app.model({ namespace: 'resetPassword', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/resetPassword.ts').default) });
app.model({ namespace: 'resetSuccess', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/resetSuccess.ts').default) });
app.model({ namespace: 'searchAddress', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/searchAddress.ts').default) });
app.model({ namespace: 'serviceNetworkDetail', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/serviceNetworkDetail.ts').default) });
app.model({ namespace: 'setPassword', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/setPassword.ts').default) });
app.model({ namespace: 'settings', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/settings.ts').default) });
app.model({ namespace: 'setup', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/setup.ts').default) });
app.model({ namespace: 'systemMessage', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/systemMessage.ts').default) });
app.model({ namespace: 'tradingDetail', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/tradingDetail.ts').default) });
app.model({ namespace: 'userAgreement', ...(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/userAgreement.ts').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  constructor(props: any) {
    super(props);
    _onCreate();
  }

  componentWillUnmount() {
    let app = getApp();
    app._models.forEach((model:any) => {
      app.unmodel(model.namespace);
    });
    app._models = [];
    try {
      // 释放 app，for gc
      // immer 场景 app 是 read-only 的，这里 try catch 一下
      app = null;
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
