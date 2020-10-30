import React, { FC, useEffect, useState } from 'react';
import { DepositModelState, ConnectProps, connect, router } from 'alita';
import { Toast, Modal } from 'antd-mobile';
import IconMyWalletEle from '@/assets/images/mywallet-ele.png';
import IconAliApp from '@/assets/images/aliapp.png';
import IconWxApp from '@/assets/images/wxapp.png';
import IconNoCheck from '@/assets/images/non-check.png';
import IconChecked from '@/assets/images/checked.png';
import PayTypePopView from '@/components/PayTypePopView';
import { aliPayForSign, unifiedOrder } from '@/services/netRequest';
import { getLoginInfo, getUserInfo,saveUserInfo } from '@/utils';
import { pay, commonFunc } from '@/utils/cordovapluigs';
import styles from './index.less';

interface PageProps extends ConnectProps {
  deposit: DepositModelState;
}

const DepositPage: FC<PageProps> = ({ deposit, dispatch, location }) => {
  const { payClassify } = location.query;
  const [showPayPop, setShowPayPop] = useState(false);
  const [chooseProtocol, setChooseProtocol] = useState(true);
  const { phoneNumber, deptId, provinceId, cityId } = getUserInfo();
  const { driverId } = getLoginInfo();
  const { depositAmount } = deposit;
  // 这里发起了初始化请求
  useEffect(() => {
    /* dispatch!({
      type: 'deposit/query',
    }); */

    dispatch!({
      type: 'deposit/getCityDepositAmount',
      payload: {
        cityId,
        deviceClassify: payClassify,
      },
    });

    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);

  // 微信支付押金
  const wxPaySignReq = () => {
    unifiedOrder({
      cityCode: cityId,
      deptId,
      packageId: location.query.id,
      payClassify,
      payMethod: '03',
      payType: '1',
      provinceCode: provinceId,
      userId: driverId,
      userPhone: phoneNumber,
      totalFee: depositAmount,
    })
      .then(res => {
        const { resultCode, resultObject } = res;
        if (resultCode === '000' && resultObject.isDeposit === '1') {
          pay(
            {
              type: 'Wechat',
              orderString: JSON.stringify({
                appid: resultObject.wxPayAppOrderResult.appId,
                partnerId: resultObject.wxPayAppOrderResult.partnerId,
                nonceStr: resultObject.wxPayAppOrderResult.nonceStr,
                sign: resultObject.wxPayAppOrderResult.sign,
                prepayId: resultObject.wxPayAppOrderResult.prepayId,
                timeStamp: resultObject.wxPayAppOrderResult.timeStamp,
              }),
            },
            () => {
              Toast.success('押金缴费成功');
              setTimeout(() => { 
                const upAvatar=getUserInfo();
                upAvatar.ifPayDeposit='1';
                saveUserInfo(upAvatar);
                router.go(-2);
              },1000)
    
            },
            () => {
              Toast.fail('押金缴纳失败');
            },
          );
        } else if (resultCode === '000') {
          let resultMsg = '未知错误';
          switch (resultObject.isDeposit) {
            case '2':
              resultMsg = '未缴纳押金 需要去缴纳押金，或者芝麻信用资金冻结免押';
              break;
            case '3':
              resultMsg = '已微信或者支付宝缴纳押金，需要去押金退费';
              break;
            case '4':
              resultMsg = '已芝麻信用资金冻结免押，需要解除授权';
              break;
            case '5':
              resultMsg = '该账户为押金担保账户，不可支付押金';
              break;
            case '6':
              resultMsg = '该账户为服务费担保账户，不可支付服务费';
              break;
            case '7':
              resultMsg = '该账户为押金/服务费全额担保，不可支付服务费或者押金';
              break;
            default:
              resultMsg = `未知错误：${resultObject.isDeposit}`;
              break;
          }
          Modal.alert('温馨提示', resultMsg, [
            { text: '确定', onPress: () => {
              router.go(-2);
            } },
          ], 'ios');
        }
      })
      .catch(err => {
        Toast.fail(err);
      });
  };

  // 阿里支付
  const aliPaySignReq = () => {
    aliPayForSign({
      cityCode: cityId,
      deptId,
      packageId: location.query.packageId,
      payClassify,
      payMethod: '02',
      payType: '1',
      provinceCode: provinceId,
      userId: driverId,
      userPhone: phoneNumber,
      totalFee: depositAmount,
    })
      .then(res => {
        const { resultCode, resultObject } = res;
        if (resultCode === '000' && resultObject.isDeposit === '1') {
          pay(
            {
              type: 'AliPay',
              orderString: resultObject.alipPrePayString,
            },
            () => {
              Toast.success('押金缴费成功');
              
              setTimeout(() => {
                const upAvatar=getUserInfo();
                upAvatar.ifPayDeposit='1';
                saveUserInfo(upAvatar);
                router.go(-2);
              },1000)
            },
            () => {
              Toast.fail('押金缴纳失败');
            },
          );
        } else if (resultCode === '000') {
          let resultMsg = '未知错误';
          switch (resultObject.isDeposit) {
            case '2':
              resultMsg = '未缴纳押金 需要去缴纳押金，或者芝麻信用资金冻结免押';
              break;
            case '3':
              resultMsg = '已微信或者支付宝缴纳押金，需要去押金退费';
              break;
            case '4':
              resultMsg = '已芝麻信用资金冻结免押，需要解除授权';
              break;
            case '5':
              resultMsg = '该账户为押金担保账户，不可支付押金';
              break;
            case '6':
              resultMsg = '该账户为服务费担保账户，不可支付服务费';
              break;
            case '7':
              resultMsg = '该账户为押金/服务费全额担保，不可支付服务费或者押金';
              break;
            default:
              resultMsg = `未知错误：${resultObject.isDeposit}`;
              break;
          }
          Modal.alert('温馨提示', resultMsg, [
            { text: '确定', onPress: () => {
              router.go(-2);
            } },
          ], 'ios');
        }
      })
      .catch(err => {
        Toast.info(err);
      });
  };

  // 0 充值协议  1 押金协议 2 用户协议  3 隐私协议
  const goProtocolDetail = (type?: string) => {
    dispatch!({
      type: 'login/getAgreement',
      payload: {
        type: 'deposit_agreement',
        callback: url => {
          dispatch!({
            type: 'protocol/save',
            payload: {
              protocolDetail: url,
            },
          });
          router.push({
            pathname: '/protocol',
            query: {
              title: '铁塔租金协议',
            },
          });
          // commonFunc({
          //   method: 'openWebView',
          //   params: {
          //     url,
          //     title: '铁塔租金协议',
          //   },
          // });
        },
      },
    });
  };

  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  return (
    <div className={styles.depositWrapper}>
      <div className={styles.depositBd}>
        <div className={styles.depositEle}>
          <div className={styles.eleIcon}>
            <img src={IconMyWalletEle} alt="" />
          </div>
          <div className={styles.eleInfo}>
            <div className={styles.elePrice}>
              ¥<span>{depositAmount}</span>
            </div>
            <div className={styles.eleTips}>
              { payClassify === '1' ? '电池押金' : '车电一体押金'}
            </div>
            {/* <div className={styles.eleTips}>{location.query.packageRemark}</div> */}
          </div>
        </div>
      </div>
      <div className={styles.protocol}>
        <img
          onClick={() => {
            setChooseProtocol(!chooseProtocol);
          }}
          className={styles.protocolRadio}
          src={chooseProtocol ? IconChecked : IconNoCheck}
          alt=""
        />
        {/* <span className={styles.protocolRadio}></span> */}
        <div className={styles.protocolText}>
          请勾选并同意
          <span
            onClick={() => {
              goProtocolDetail('1');
            }}
            style={{ color: '#00BF83', textDecoration: 'underline' }}
          >
            租电协议
          </span>
        </div>
      </div>
      <div className={styles.footerBox}>
        <div className={styles.footerPrice}>
          ¥<span>{depositAmount}</span>
        </div>
        <div
          className={styles.footerPayBtn}
          onClick={() => {
            if (chooseProtocol) {
              setShowPayPop(true);
            } else {
              Toast.fail('请先勾选租电协议');
            }
          }}
        >
          立即支付{' '}
        </div>
      </div>

      <PayTypePopView
        visiable={showPayPop}
        onOk={key => {
          if (key === 'ali') {
            aliPaySignReq();
          }
          if (key === 'wx') {
            wxPaySignReq();
          }
        }}
        feeType={ getUserInfo().ifPayDeposit === '1' ? '(月租费缴费)' : '(押金缴费)' }
        amount={depositAmount}
        onClose={() => setShowPayPop(false)}
        payTypes={[
          {
            icon: IconAliApp,
            text: '支付宝',
            key: 'ali',
          },
          {
            icon: IconWxApp,
            text: '微信',
            key: 'wx',
          },
        ]}
      />
    </div>
  );
};

export default connect(({ deposit }: { deposit: DepositModelState }) => ({ deposit }))(DepositPage);
