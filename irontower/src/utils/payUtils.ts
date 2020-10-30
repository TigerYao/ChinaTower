import { aliPayForSign, unifiedOrder, getRefundStatusConfirm } from '@/services/netRequest';
import { pay } from './cordovapluigs';
import { getUserInfo } from './index';
import { Modal } from 'antd-mobile';

//  支付宝支付
export const aliPayMethod = ({ data = {}, success = () => {}, fail = (e: any) => {} }) => {
  aliPayForSign(data).then(resKey => {
    const { resultCode, resultObject } = resKey;
    if (resultCode === '000') {
      //
      const { isDeposit, alipPrePayString } = resultObject;
      if (isDeposit === '1') {
        pay(
          {
            type: 'AliPay',
            orderString: alipPrePayString,
          },
          success,
          fail,
        );
      } else {
        fail(isDeposit);
      }
    }
  });
};

//  微信支付
export const wxPayMethod = ({ data = {}, success = () => {}, fail = (e: any) => {} }) => {
  unifiedOrder(data).then(resKey => {
    const { resultCode, resultObject } = resKey;
    if (resultCode === '000') {
      //
      const { isDeposit, wxPayAppOrderResult } = resultObject;
      if (isDeposit === '1') {
        pay(
          {
            type: 'Wechat',
            orderString: JSON.stringify({
              appid: wxPayAppOrderResult.appId,
              partnerId: wxPayAppOrderResult.partnerId,
              nonceStr: wxPayAppOrderResult.nonceStr,
              sign: wxPayAppOrderResult.sign,
              prepayId: wxPayAppOrderResult.prepayId,
              timeStamp: wxPayAppOrderResult.timeStamp,
            }),
          },
          success,
          err => {
            fail(err);
          },
        );
      } else {
        fail(isDeposit);
      }
    }
  });
};

export const getRefundStatusConfirmRequest = ({
  refundType = '',
  ok = status => {},
  cancel = () => {},
  callback = e => {},
}) => {
  const { driverId, deviceClassify } = getUserInfo();
  getRefundStatusConfirm({
    userId: driverId,
    refundType,
    deviceClassify,
  }).then(res => {
    const { resultCode, resultObject } = res;
    if (resultCode === '000') {
      const { refundCode, refundMsg } = resultObject;
      const buttonList = [];
      if (refundCode === '1') {
        buttonList.push({
          text: '确定',
          onPress: () => {
            cancel();
          },
        });
      } else {
        buttonList.push({
          text: '取消',
          onPress: () => {
            cancel();
          },
        });
        buttonList.push({
          text: '确定',
          onPress: () => {
            ok(refundCode);
          },
        });
      }

      const modalObject = Modal.alert('温馨提示', refundMsg, buttonList, 'ios');
      callback(modalObject);
    }
  });
};
