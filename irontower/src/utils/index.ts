import { commonFunc } from './cordovapluigs';
import { Toast } from 'antd-mobile';

function transformlat(lng, lat) {
  const PI = 3.1415926535897932384626;
  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}
function transformlng(lng, lat) {
  const PI = 3.1415926535897932384626;
  let ret =
    300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
}

/**
 * WGS84转GCj02
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * @param lng
 * @param lat
 * @returns {*[]}
 */
const wgs84togcj02tobd09: any = (lng: number, lat: number) => {
  const xPI = (3.14159265358979324 * 3000.0) / 180.0;
  const PI = 3.1415926535897932384626;
  const a = 6378245.0;
  const ee = 0.00669342162296594323;
  // WGS84转GCj02
  let dlat = transformlat(lng - 105.0, lat - 35.0);
  let dlng = transformlng(lng - 105.0, lat - 35.0);
  const radlat = (lat / 180.0) * PI;
  let magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  const sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
  dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
  const mglat = lat + dlat;
  const mglng = lng + dlng;
  // 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
  const z = Math.sqrt(mglng * mglng + mglat * mglat) + 0.00002 * Math.sin(mglat * xPI);
  const theta = Math.atan2(mglat, mglng) + 0.000003 * Math.cos(mglng * xPI);
  const bdlng = z * Math.cos(theta) + 0.0065;
  const bdlat = z * Math.sin(theta) + 0.006;
  return { longitude: bdlng, latitude: bdlat };
};

export const getCurrentPosition = ({ success = options => {}, fail = er => {} }) => {
  document.addEventListener('deviceready', () => {
    commonFunc(
      {
        method: 'getCurrentPosition',
      },
      (e: any) => {
        if (e.platform === 'iOS') {
          const options = {
            ...e,
            ...wgs84togcj02tobd09(+e.longitude, +e.latitude),
          };
          console.log('tag', options);
          success(options);
        } else {
          success(e);
        }
      },
      (err: PositionError) => {
        fail(err);
        Toast.fail('当前位置获取失败，请查看使用已打开定位服务权限');
      },
    );
    // navigator.geolocation.getCurrentPosition(
    //   e => {
    //     success(e.coords);
    //   },
    //   err => {
    //     fail(err);
    //   },
    //   { timeout: 30000, enableHighAccuracy: true },
    // );
  });
};

// 设置iframe页面的meta
export function resetIframeViewPort() {
  try {
    const meta = document.querySelector('meta[name="viewport"]');
    window._contentBackUp = meta.getAttribute('content');
    const scale = window._contentBackUp.split('initial-scale=')[1].split(',')[0];
    meta.setAttribute(
      'content',
      'user-scalable=no, initial-scale=1.0, maximum-scale=1.0 minimal-ui',
    );
    const html = document.querySelector('html');
    window._fontSize = html.style.fontSize;
    html.style.fontSize = window._fontSize.split('px')[0] * scale + 'px';
  } catch (error) {
    console.log('tool_setIframeViewPort', error);
  }
}

// 还原iframe页面的meta
export function backIframeViewPort() {
  try {
    // 容错
    if (window._fontSize && window._contentBackUp) {
      const meta = document.querySelector('meta[name="viewport"]');
      meta.setAttribute('content', window._contentBackUp);
      const html = document.querySelector('html');
      html.style.fontSize = window._fontSize;
    }
  } catch (error) {
    console.log('tool_backIframeViewPort', error);
  }
}

// workHours
// plugman create --name NativeBridge --plugin_id cordova-plugin-nativebridge --plugin_version 1.0.0

export const loginInfoKey = 'loginInfo';
export const sysMsgInfoKey = 'sysMsgInfo';
export const activityInfoKey = 'activityInfo';
export const noticeInfoKey = 'noticeInfo'

export const saveLoginInfo = (info = {}) => {
  localStorage.setItem(loginInfoKey, JSON.stringify(info));
};
// 获取登录信息
export function getLoginInfo() {
  const loginInfo = JSON.parse(localStorage.getItem(loginInfoKey) || '{}') || {};
  return loginInfo;
}

export function clearLoginInfo() {
  localStorage.removeItem(loginInfoKey);
}

// 登录的账户密码信息
export const loginParamInfoKey = 'loginParamInfo';

export const saveLoginParamInfo = (info = {}) => {
  localStorage.setItem(loginParamInfoKey, JSON.stringify(info));
};

export function getLoginParamInfo() {
  const loginParamInfo = JSON.parse(localStorage.getItem(loginParamInfoKey) || '{}') || {};
  return loginParamInfo;
}

export function clearLoginParamInfo() {
  localStorage.removeItem(loginParamInfoKey);
}

// MD5密码加密
const salt = '2020naidnauhateit123!'; // salt为任意乱序字符串，目的在于使加密后的密码不容易被破解
export function md5Pwd(pwd: string) {
  const md5 = require('md5');
  return md5(md5(pwd + salt));
}

export const setAgreementPro = (ok?: boolean) => {
  localStorage.setItem('protocol$', ok === true ? 'YES' : 'NO');
};

export const setAgreementProByUserId = (ok?: boolean) => {
  const protocolKey = `protocol$${getLoginInfo().driverId}`;
  console.log('protocolKey==', protocolKey);
  localStorage.setItem(protocolKey, ok === true ? 'YES' : 'NO');
};

export const getAgreementByUserId = (ok?: boolean) => {
  const protocolKey = `protocol$${getLoginInfo().driverId}`;
  return localStorage.getItem(protocolKey) !== 'NO';
};

export const getCustomerTel = () => {
  return localStorage.getItem('telKey');
};

export const saveCustomerTel = (tel: string) => {
  localStorage.setItem('telKey', tel);
};

export const getAgreement = () => localStorage.getItem('protocol$') !== 'NO';

//  保存用户信息
export const saveUserInfo = (userInfo = {}) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

//  获取用户信息
export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem('userInfo') || '{}');
};

// 获取平台 iOS Android
export const getPlatform = async () =>
  new Promise(resolve => {
    document.addEventListener('deviceready', () => {
      // callback((window as any).device.platform);
      resolve((window as any).device.platform);
    });
  });

export const userInfoKey = 'UserInfo';

export function clearUserInfo() {
  localStorage.removeItem(userInfoKey);
}

//  获取二维码可用字符串
export const getQrcodeStr = (text = '') => {
  let code: number | string = '';
  if (text.length === 0) {
    Toast.fail('二维码错误');
    return -1;
  }
  const isChineseReg = /[\u4e00-\u9fa5]/;
  if (text.indexOf('{') !== -1) {
    // 扫电池出的码(不是邮政的身份)
    const codeDic = JSON.parse(text);
    const str: string = codeDic.code;
    if (isChineseReg.test(str)) {
      Toast.fail('二维码错误');
      code = -1;
    } else {
      code = str;
    }
  } else if (text.indexOf('BT') !== -1) {
    // 邮政电池;
    const str = text.split('BT')[1];
    if (str.length >= 26 && !isChineseReg.test(str) && str.indexOf(',') !== -1) {
      Toast.info('暂不支持邮政电池类型');
      code = -1;
    } else {
      Toast.fail('二维码错误');
      code = -1;
    }
    // code = text;
  } else {
    code = text;
  }

  return code;
};

/**
 * 返回file类型
 * @param dataurl base64图片
 * @param filename 文件名称
 */
export const base64ToFile = (dataurl: string, filename: string) => {
  console.log('filename:', dataurl, filename);

  try {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while ((n -= 1)) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.png`, {
      type: mime,
      lastModified: new Date().getTime(),
    });
  } catch (error) {
    return new File([], { type: 'png', lastModified: new Date().getTime() });
  }
};
export const blobToFile = (theBlob: any, fileName: string, type: string) => {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  // return theBlob;

  return new File([theBlob], fileName, { type });
};

export const base64ToBlob = (dataurl: string) => {
  // const bytes = window.atob(dataurl); // 去掉url的头，并转换为byte
  // // 处理异常,将ascii码小于0的转换为大于0
  // const ab = new ArrayBuffer(bytes.length);
  // const ia = new Uint8Array(ab);
  // for (let i = 0; i < bytes.length; i += 1) {
  //   ia[i] = bytes.charCodeAt(i);
  // }

  // return new Blob([ab], { type: 'image/png' });

  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  console.log('mime', mime);
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  const theBlob = new Blob([u8arr], { type: mime });
  return blobToFile(theBlob, 'file.png', mime);
};

export const fixedIOS12ReadOnlyKeyboardFocus = () => {
  const inputList = document.querySelectorAll('input[readonly]');
  inputList.forEach(item => {
    (function() {
      item.setAttribute('unselectable', 'on');
      item.onfocus = function() {
        item.blur();
      };
    })();
  });
};

export const saveSysMsgInfo = (key = '', info = {}) => {
  if (key) {
    const sysMsgInfo = JSON.parse(localStorage.getItem('sysMsgInfoKey') || '{}');
    sysMsgInfo[key] = info;
    localStorage.setItem(sysMsgInfoKey, JSON.stringify(sysMsgInfo));
  }
};

export const getSysMsgInfo = () => {
  const sysMsgInfo = JSON.parse(localStorage.getItem(sysMsgInfoKey) || '{}');
  return sysMsgInfo;
};

export const saveActivityInfo = (key = '', info = {}) => {
  if (key) {
    const activityInfo = JSON.parse(localStorage.getItem('sysMsgInfoKey') || '{}');
    activityInfo[key] = info;
    localStorage.setItem(activityInfoKey, JSON.stringify(info));
  }
};

export const getActivityInfo = () => {
  const activityInfo = JSON.parse(localStorage.getItem(activityInfoKey) || '{}');
  return activityInfo;
};

export const saveNoticeInfo = (key = '', info = {}) => {
  if (key) {
    const noticeInfo = JSON.parse(localStorage.getItem(noticeInfoKey) || '{}');
    noticeInfo[key] = info;
    localStorage.setItem(noticeInfoKey, JSON.stringify(noticeInfo));
  }
};

export const getNoticeInfo = () => {
  const noticeInfo = JSON.parse(localStorage.getItem(noticeInfoKey) || '{}');
  return noticeInfo;
};

export const createAction = type => (payload?, callback?) => ({ type, payload, callback });


const ONE_REM = parseInt(document.documentElement.style.fontSize, 10) || 100;
const SCALE = ONE_REM / 100;
/**
 * 像素转换
 * @param {Number} px - 750视觉稿像素
 * @return {Number} 屏幕上实际像素
 */
export function px2hd(px) {
    return Number((px * SCALE).toFixed(1));
}
