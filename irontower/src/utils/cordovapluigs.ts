interface MapProps {
  origin: string;
  lat: number | string;
  lng: number | string;
  name: string; // 目的地名称
  mode: string; // 导航模式，骑行、驾车、步行、公交
}

interface OpenAntFiProps {
  orderString: string;
}

interface VideoProps {
  title: string;
  url: string;
}

interface MediaProps {
  type: 'battery'; // 电量低
}

interface ShareProps {
  title?: string;
  description?: string;
  url?: string;
  icon?: string;
  // type: 'QQ' | 'Timeline' | 'Session' | 'Favorite';
}

interface PayProps {
  type: 'AliPay' | 'Wechat';
  orderString: string;
}

interface CommonFCProps {
  method:
    | 'isFirstRun'
    | 'canOpenWx'
    | 'canOpenAli'
    | 'openWebView'
    | 'getAppDeviceModel'
    | 'getAppVersion'
    | 'getCurrentPosition'
    | 'openAppStoreScore'
    | 'chooseAssetPhoto'
    | 'appversion' // ios真实版本号
    | 'goMapView'
    | 'popToView' // 返回上一级
    | 'notificationNative'
    | 'showUpdateView'; // 发送通知
  params?: any;
}

interface ScanProps {
  title?: string;
}

//  播放音频
export const playMedia = (args: MediaProps, success = () => {}) => {
  document.addEventListener('deviceready', () => {
    (window as any).H5bridge.playMedia(JSON.stringify(args), success);
  });
};

// 视频播放
export const playVideo = (args: VideoProps, success = () => {}) => {
  document.addEventListener('deviceready', () => {
    (window as any).H5bridge.playVideo(JSON.stringify(args), success);
  });
};

// 添加扫码功能
export const openScanQrcode = (args: ScanProps, success = (text: string) => {}) => {
  document.addEventListener('deviceready', () => {
    (window as any).H5bridge.scanQRCode(JSON.stringify(args), success);
  });
};

// 分享功能 args = { type: '',  }
export const share = (args: ShareProps, success = (text: string) => {}, fail = msg => {}) => {
  document.addEventListener('deviceready', () => {
    (window as any).H5bridge.share(JSON.stringify(args), success, fail);
  });
};

/**
 *
 * @param args
 * @param success 微信支付成功回调文字
 *                支付宝成功：
 * @param fail 微信支付失败说明：-1: 普通错误类型   -2:用户点击取消并返回   -3:发送失败  -4:授权失败  -5: 微信不支持
 *             支付宝失败说明：8000 正在处理中 4000  订单支付失败 6001 用户中途取消/重复操作取消 6002  网络连接出错
 */

// 支付功能
export const pay = (args: PayProps, success = (text: string) => {}, fail = msg => {}) => {
  document.addEventListener('deviceready', () => {
    (window as any).H5bridge.pay(JSON.stringify(args), success, fail);
  });
};

// 跳转地图导航
export const openMapApp = (params: MapProps, success = () => {}, fail = () => {}) => {
  document.addEventListener('deviceready', () => {
    (window as any).H5bridge.openMapApp(JSON.stringify(params), success, fail);
  });
};

// 打开蚂蚁金服
export const openAntFi = (params: OpenAntFiProps, success = () => {}, fail = () => {}) => {
  document.addEventListener('deviceready', () => {
    (window as any).H5bridge.openAntFi(JSON.stringify(params), success, fail);
  });
};

// 设置极光推送标识  入参 driverId
export const setJpushAlias = (args: string, success = () => {}, fail = () => {}) => {
  document.addEventListener('deviceready', () => {
    (window as any).H5bridge.setJpushAlias(args, success, fail);
  });
};

// 删除极光推送标识
export const clearJpushAlias = (args: string, success = () => {}, fail = () => {}) => {
  document.addEventListener('deviceready', () => {
    (window as any).H5bridge.clearJpushAlias(args, success, fail);
  });
};

// 公共方法
export const commonFunc = (params: CommonFCProps, success = () => {}, fail = () => {}) => {
  document.addEventListener('deviceready', () => {
    (window as any).H5bridge.commonFunc(JSON.stringify(params), success, fail);
  });
};
