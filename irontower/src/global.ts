/* eslint-disable no-undef */
import { queryUpgrade } from '@/services/loginServices';
// import { CommonFunc} from '@/utils/cordovapluigs'
import { history } from 'alita';
import UpdateModal from './components/UpdateModal';
import { commonFunc, setJpushAlias } from './utils/cordovapluigs';
import { router } from 'alita';
import { getLoginInfo, saveNoticeInfo, saveSysMsgInfo, saveActivityInfo } from './utils';
import { Toast } from 'antd-mobile';
export let isNeedUpdate = false;

const currentVersion = 409;

export const getAppVersion = async () =>
  new Promise((resolve, reject) => {
    commonFunc(
      {
        method: 'getAppVersion',
      },
      (version: unknown) => {
        resolve(version);
      },
    );
  });

export const checkAppVersionUpdate = async () => {
  const version = await getAppVersion();
  console.log('version ===', version);
  if (version) {
    queryUpgrade({
      appCode: `exchange_${(window as any).device.platform.toLowerCase()}`,
    }).then(res => {
      const { resultObject } = res;
      if (currentVersion < resultObject.appVersionNo) {
        isNeedUpdate = true;
        // UpdateModal.show({
        //   version: resultObject.appVersion,
        //   tips: resultObject.upgradeDescribe,
        //   downloadUrl: resultObject.upgradeUrl,
        //   show: true,
        //   isForceUpgrade: resultObject.isForceUpgrade === '1', // 1强制更新
        // });
      }
    });
  }
};

document.addEventListener('deviceready', () => {
  StatusBar.backgroundColorByHexString('#ffffff');
  StatusBar.styleDefault();
  navigator.splashscreen.hide();
  checkAppVersionUpdate();
  // document.addEventListener('backbutton', pageBack, false);
});
var time = new Date(); //当前时间
var isToast = false;
/**
 * 按物理按键返回上页
 * @param e
 */
function pageBack(e) {
  // window.history.go(-1);
  if (history.location.pathname === '/index' || history.location.pathname === '/') {
    // 2s内再次点击就退出
    if (new Date() - time > 2000 || !isToast) {
      Toast.info('再按一次退出铁塔换电'); // 提示信息
      time = new Date();
      isToast = true;
    } else {
      navigator.app.exitApp(); // app退出
    }
  } else {
    router.goBack();
  }
}

/**
 * 激光推送跳转页面
 * payload: {
 *    pathname,
 *    query: {
 *       id:'xxx'
 *    }
 * }
 */
(window as any).pushToPage = (payload: string, noticeId: string) => {
  console.log('payload==========', payload);
  const { token } = getLoginInfo();
  if (token) {
    console.log('激光推送 ===>', payload);
    document.addEventListener('deviceready', () => {
      console.log('激光推送2 ===>', payload);
      if (payload === '0') {
        //  支付消息
        history.push({
          pathname: '/myWallet/tradingDetail',
        });
      } else if (payload === '1') {
        //  退款
        history.push({
          pathname: '/myWallet/tradingDetail',
        });
      } else if (payload === '2') {
        //  电池
      } else if (payload === '3') {
        // 订单到期信息
        history.push({
          pathname: '/myWallet',
        });
      } else if (payload === '4') {
        // 预期消息
        history.push({
          pathname: '/myWallet',
        });
      } else if (payload === '501') {
        // 预期消息
        history.push({
          pathname: '/news/messageDetail',
          query: {
            newsType: 0,
            title: '通知公告',
            noticeId,
            type: '501',
          },
        });
      } else if (payload === '502') {
        // 预期消息
        history.push({
          pathname: '/news/messageDetail',
          query: {
            newsType: 2,
            title: '活动消息',
            noticeId,
            type: '502',
          },
        });
      }
    });
  }
};

// 请求数据和保存
(window as any).pushToQueryData = (payload: any) => {
  console.log('请求数据和保存 payload==========', payload);
  // 系统消息
  const payloadObj = JSON.parse(payload || '{}');
  saveNoticeInfo(payloadObj.noticeId, { ...payloadObj });
  /* if (payloadObj.type === '501') {
    saveSysMsgInfo(payloadObj.noticeId, {});
  } else {// 活动消息
    saveActivityInfo(payloadObj.noticeId, {});
  } */
};

/**
 * 实时查询电池电量
 */
let batteryTimer = null;

const getBatteryQuaCount = () => {
  batteryTimer = setInterval(() => {
    //  查询电量
  }, 1000 * 60 * 5);
};

document.addEventListener('pause', () => {
  // console.log('程序进入后台');
  getBatteryQuaCount();
});

document.addEventListener('resume', () => {
  console.log('程序进入前台');
});
