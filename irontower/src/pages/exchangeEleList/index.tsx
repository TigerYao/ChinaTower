import React, { FC, useEffect, useState } from 'react';
import {
  ExchangeEleListModelState,
  ConnectProps,
  connect,
  history,
  MyBatteryModelState,
  router,
  setPageNavBar,
} from 'alita';
import { Toast, Modal, DatePicker } from 'antd-mobile';
import { exchangePowerBusiness, getPostalBatteryUnbound } from '@/services/netRequest';
import { getQrcodeStr, getUserInfo, getLoginInfo } from '@/utils';
import { openScanQrcode } from '@/utils/cordovapluigs';
import EmptyPage from '@/components/EmptyPage';
import IconRefresh from '@/assets/images/refresh-img.png';
import UseEleCell from './components/UseEleCell';
import UnEleCell from './components/UnEleCell';
import moment from 'moment';
import styles from './index.less';

interface PageProps extends ConnectProps {
  exchangeEleList: ExchangeEleListModelState;
  myBattery: MyBatteryModelState;
}

const ExchangeEleListPage: FC<PageProps> = ({ exchangeEleList, dispatch, myBattery, location }) => {
  let timer = null;
  let timerRefresh = null;
  let timerRefreshSucc = null;
  const { hasBattery } = myBattery;
  let now = new Date(Date.now());
  const [currentDate, setDateSelect] = useState(new Date(Date.now()));
  const [exchangeMonth, setExchangeMonth] = useState(moment(new Date(Date.now())).format('YYYYMM'));

  const batteryRequest = () => {
    timer = setTimeout(() => {
      dispatch!({
        type: 'myBattery/queryBatteryElectricQuantity',
        payload: {
          driverId: getLoginInfo().driverId,
          callback: (haBattery: boolean) => {
            if (!haBattery) {
              clearTimeout(timer);
              const { driverType } = getUserInfo();
              if (driverType !== '2' && driverType !== '3') {
                Modal.alert('温馨提示', '退电已完成，您是否需要退费？', [
                  {
                    text: '取消',
                    onPress: () => {},
                  },
                  {
                    text: '确认',
                    onPress: () => {
                      router.push({
                        pathname: '/myWallet',
                      });
                    },
                  },
                ]);
              } else {
                router.push({
                  pathname: '/myWallet',
                });
              }
            } else {
              batteryRequest();
            }
          },
        },
      });
    }, 2000);
  };

  // 退还
  const refund = () => {
    openScanQrcode({ title: '扫码换电' }, text => {
      const { batteryVolts, driverId, provinceId, cityId, deptId, orgId, orgType } = getUserInfo();
      const sqcode = getQrcodeStr(text);
      if (sqcode !== '' && sqcode !== -1) {
        exchangePowerBusiness({
          batteryMarking: '1',
          batteryVolts,
          cabinetId: sqcode,
          driverId,
          provinceId,
          cityId,
          deptId,
          orgId,
          orgType,
        })
          .then(res => {
            const { resultCode, resultObject } = res;
            timerRefreshSucc = setInterval(() => {
              dispatch!({
                type: 'exchangeEleList/getExchangeRecord',
                payload: {
                  exchangeMonth,
                },
              });
            }, 1500);
            if (resultCode === '000') {
              //  绑定成功
              const { code, msg } = resultObject;
              if (code === '1') {
                Toast.success(msg);

                batteryRequest();
              } else {
                Toast.fail(msg);
              }
            }
          })
          .catch(err => {
            Toast.fail('开柜失败');
          });
      }
    });
  };

  const getPostalOpenSqcode = () => {
    openScanQrcode({ title: '扫码换电' }, text => {
      getPostalBatteryUnbound({
        batteryId: text,
        driverId: getUserInfo().driverId,
      }).then(res => {
        const { resultCode, resultObject } = res;
        if (resultCode === '000') {
          Toast.success(resultObject.description);
        }
      });
    });
  };
  const setPageNavBarView = date1 => {
    setPageNavBar({
      pagePath: '/exchangeEleList',
      navBar: {
        rightContent: (
          <DatePicker
            maxDate={now}
            mode="month"
            title="请选择月份"
            onOk={date => {
              setPageNavBarView(date);
              setDateSelect(date);
              setExchangeMonth(moment(new Date(date)).format('YYYYMM'));
              console.log('exchangeMonth---->', exchangeMonth);
              dispatch!({
                type: 'exchangeEleList/getExchangeRecord',
                payload: {
                  exchangeMonth: moment(new Date(date)).format('YYYYMM'),
                },
              });
            }}
          >
            <div className={styles.mouthStyle}>
              <span className={styles.text}>{moment(new Date(date1)).format('YYYY年MM月')}</span>
            </div>
          </DatePicker>
        ),
      },
    });
  };

  // 这里发起了初始化请求
  useEffect(() => {
    setPageNavBarView(currentDate);
    dispatch!({
      type: 'exchangeEleList/getExchangeRecord',
      payload: {
        exchangeMonth,
      },
    });
    if (timerRefreshSucc) {
      clearInterval(timerRefreshSucc);
    }

    if (timerRefresh) {
      clearTimeout(timerRefresh);
    }

    if (!getUserInfo().cityId) {
      const { driverId } = getLoginInfo();
      dispatch!({
        type: 'login/selectUserInfo',
        payload: {
          driverId,
        },
      });
    }

    // timerRefreshSucc = setInterval(() => {
    //   dispatch!({
    //     type: 'exchangeEleList/getExchangeRecord',
    //     payload: {
    //       exchangeMonth,
    //     },
    //   });
    // }, 1500);

    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      if (timerRefreshSucc) {
        clearInterval(timerRefreshSucc);
      }

      if (timerRefresh) {
        clearTimeout(timerRefresh);
      }
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { recordList = [] } = exchangeEleList;

  return (
    <div className={styles.eleList} style={{}}>
      {/* <div className={styles.refreshBox}>
        <img src={IconRefresh} className={styles.refreshImg} 
          onClick={() => {
            dispatch!({
              type: 'exchangeEleList/getExchangeRecord',
            });
          }}
        />
      </div> */}

      {/* <div className={!dateSelect ? '' : styles.hideEle}> */}

      {/* </div> */}

      {recordList.length === 0 ? (
        <EmptyPage />
      ) : (
        recordList.map((item, index) =>
          item &&
          // item.bsExchangeRecord.rerurnTime &&
          item.delFlag === '2' ? (
            <UnEleCell
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              data={item}
              onClick={() => {
                dispatch!({
                  type: 'exchangeEleList/save',
                  payload: {
                    itemDetail: {
                      ...item,
                    },
                    exchangeMonth,
                  },
                });
                history.push({
                  pathname: '/exchangeEleDetail',
                  query: {
                    id: item.batteryId,
                    status: '0', // 已完成
                  },
                });
              }}
            />
          ) : (
            <UseEleCell
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              data={item}
              onClick={() => {
                dispatch!({
                  type: 'exchangeEleList/save',
                  payload: {
                    itemDetail: {
                      ...item,
                    },
                    exchangeMonth,
                  },
                });
                history.push({
                  pathname: '/exchangeEleDetail',
                  query: {
                    id: item.batteryId,
                    status: '1', // 正在使用
                  },
                });
              }}
              dealClick={e => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                // eslint-disable-next-line no-console

                if (getUserInfo().driverType === '5') {
                  //  如果是邮政用户

                  getPostalOpenSqcode();

                  return;
                }

                dispatch!({
                  type: 'index/getAllSysAreaInfo',
                  payload: {
                    cityId: getUserInfo().cityId,
                    callback: res => {
                      if (res && res.ifPermitReturn === '0') {
                        refund();
                      } else {
                        Modal.alert(
                          '温馨提示',
                          '本地市暂不支持线上退还功能，如有疑问，请咨询客服10096。',
                          [
                            {
                              text: '确认',
                              onPress() {},
                            },
                          ],
                        );
                      }
                    },
                  },
                });

                // location.reload();
                // Toast.success('退还');

                // timer = setInterval(() => {
                //   const { hasBattery } = myBattery;
                //   console.log("...", hasBattery)
                //   dispatch!({
                //     type: 'myBattery/queryBatteryElectricQuantity',
                //     payload: {
                //       driverId: getLoginInfo().driverId,
                //     },
                //   });

                //   if (!hasBattery) {
                //     clearInterval(timer);
                //   }
                // },2000);
              }}
            />
          ),
        )
      )}
    </div>
  );
};

export default connect(
  ({
    exchangeEleList,
    myBattery,
  }: {
    exchangeEleList: ExchangeEleListModelState;
    myBattery: MyBatteryModelState;
  }) => ({
    exchangeEleList,
    myBattery,
  }),
)(ExchangeEleListPage);
