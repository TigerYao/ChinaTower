import React, { FC, useEffect, useState } from 'react';
import {
  SetupModelState,
  LoginModelState,
  IndexModelState,
  ConnectProps,
  connect,
  router,
} from 'alita';
import styles from './index.less';
import { WhiteSpace, Toast, Switch, Modal } from 'antd-mobile';
import { Store, ValidateErrorEntity } from 'rc-field-form/es/interface';
import {
  clearLoginInfo,
  clearUserInfo,
  getLoginParamInfo,
  saveLoginParamInfo,
} from '@/utils/index';
import DynamicForm, { IFormItemProps, useForm } from '@alitajs/dform';
import { commonFunc } from '@/utils/cordovapluigs';
import arrowIcon from '@/assets/images/arrow_img.png';
import { getUserInfo } from '@/utils/index';
import { clearJpushAlias } from '@/utils/cordovapluigs';
import { isNeedUpdate, checkAppVersionUpdate } from '@/global';

interface PageProps extends ConnectProps {
  setup: SetupModelState;
  index: IndexModelState;
}
const arrowImg = () => <img src={arrowIcon} style={{ width: '.32rem', height: '.32rem' }} />;
const SetupPage: FC<PageProps> = ({ setup, index, dispatch }) => {
  const { switchStatus } = setup;
  const [form] = useForm();
  const { phoneNumber, driverType } = getUserInfo();
  const [openNotification, setOpenNotification] = useState(false);

  const onFinish = (values: Store) => {
    // eslint-disable-next-line no-console
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'setup/queryPowerNoticeSwitch',
    });
    return () => {};
  }, []);

  /**
   * 注销用户
   */
  const zxUserInfo = () => {
    // 请确认是否注销本账户？
    Modal.alert('', '请确认是否注销本账户？', [
      {
        text: '确定',
        onPress: () => {},
      },
      {
        text: '取消',
      },
    ]);
  };

  const isEmpty = (str: string | any[]) => {
    if (!str) {
      return true;
    }
    if (str.length === 0) {
      return true;
    }
    return false;
  };

  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const formsData = [
    {
      type: 'input',
      fieldProps: 'aboutus',
      required: false,
      title: '关于我们',
      extra: arrowImg(),
      editable: false,
      onClick: () => {
        router.push({
          pathname: '/personalCenter/aboutUs',
        });
      },
    },
    {
      type: 'input',
      fieldProps: 'score',
      required: false,
      title: '给我们评分',
      editable: false,
      extra: arrowImg(),
      onClick: () => {
        commonFunc({ method: 'openAppStoreScore' });
      },
    },
    {
      type: 'input',
      fieldProps: 'cityswitch',
      required: false,
      title: '修改使用地',
      editable: false,
      placeholder: isEmpty(getUserInfo().cityName) ? '' : `当前城市：${getUserInfo().cityName}`,
      extra: arrowImg(),
      onClick: () => {
        if (getUserInfo().ifPayDeposit === '1' && !getUserInfo().packageId) {
          Toast.info('如需修改城市使用地，请先退回押金及服务费！');
        } else {
          router.push({
            pathname: '/personalCenter/searchAddress',
          });
        }
      },
    },
  ] as IFormItemProps[];

  const formsDataother = [
    {
      type: 'input',
      fieldProps: 'aboutus',
      required: false,
      title: '关于我们',
      extra: arrowImg(),
      editable: false,
      onClick: () => {
        router.push({
          pathname: '/personalCenter/aboutUs',
        });
      },
    },
  ] as IFormItemProps[];
  // 0 充值协议  1 押金协议 2 用户协议  3 隐私协议
  const goProtocolDetail = (type?: string) => {
    dispatch!({
      type: 'login/getAgreement',
      payload: {
        type: type === '0' ? 'recharge_agreement' : 'deposit_agreement',
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
              title: type === '0' ? '铁塔充值协议' : '铁塔押金协议',
            },
          });
          // commonFunc({
          //   method: 'openWebView',
          //   params: {
          //     url,
          //     title: type === '0' ? '铁塔充值协议' : '铁塔押金协议',
          //   },
          // });
        },
      },
    });
  };
  const goProtocolDetail2 = (type?: string) => {
    dispatch!({
      type: 'login/getAgreement',
      payload: {
        // type: 'user_agreement',
        type: type === '2' ? 'user_agreement' : 'privacyPolicy_agreement',
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
              title: type === '2' ? '铁塔用户协议' : '铁塔隐私协议',
            },
          });

          // commonFunc({
          //   method: 'openWebView',
          //   params: {
          //     url,
          //     title: type === '2' ? '铁塔用户协议' : '铁塔隐私协议',
          //   },
          // });
        },
      },
    });
  };

  const checkUpdate = () => {
    commonFunc({
      method: 'showUpdateView',
    });

    // if (isNeedUpdate) {
    //   // checkAppVersionUpdate();
    //   commonFunc({
    //     method: 'showUpdateView',
    //   });
    // } else {
    //   Toast.info('您目前版本为最新版本');
    // }
  };

  const gotoOperationGuide = () => {
    router.push({
      pathname: '/myBattery/operationGuide',
    });
  };
  const formsData2 = [
    {
      type: 'switch',
      fieldProps: 's21tuserswitch1',
      required: false,
      placeholder: '请选择',
      title: '低电量提醒',
      positionType: 'horizontal',
    },
  ] as IFormItemProps[];

  const formsData1 = [
    {
      type: 'input',
      fieldProps: 'operationGuide',
      required: false,
      title: '操作指南',
      extra: arrowImg(),
      editable: false,
      onClick: () => gotoOperationGuide(),
    },
    {
      type: 'input',
      fieldProps: 'useragreement',
      required: false,
      title: '用户协议',
      extra: arrowImg(),
      editable: false,
      onClick: () => goProtocolDetail2('2'),
    },
    {
      type: 'input',
      fieldProps: 'depositagreement',
      required: false,
      title: '押金协议',
      editable: false,
      extra: arrowImg(),
      onClick: () => goProtocolDetail('1'),
    },
    {
      type: 'input',
      fieldProps: 'rechangeagreement',
      required: false,
      title: '充值协议',
      editable: false,
      extra: arrowImg(),
      onClick: () => goProtocolDetail('0'),
    },
    {
      type: 'input',
      fieldProps: 'privacypolicy',
      required: false,
      title: '隐私政策',
      editable: false,
      extra: arrowImg(),
      onClick: () => goProtocolDetail2('3'),
    },
    {
      type: 'input',
      fieldProps: 'privacypolicy',
      required: false,
      title: '检查新版本',
      editable: false,
      extra: arrowImg(),
      onClick: () => checkUpdate(),
    },
  ] as IFormItemProps[];
  const formsValues = {};
  const formProps = [
    {
      // eslint-disable-next-line no-nested-ternary
      data: (window as any).device
        ? (window as any).device.platform.toLowerCase() === 'ios'
          ? formsData
          : formsDataother
        : formsDataother,
      form,
    },
    {
      data: formsData1,
      form,
    },
  ];
  const formProps1 = [
    {
      data: formsDataother,
      form,
    },
    {
      data: formsData1,
      form,
    },
  ];
  const exit = () => {
    console.log('点击退出');
    dispatch!({
      type: 'setup/exit',
      payload: {
        phone: phoneNumber,
        userId: getUserInfo().driverId,
        driverId: getUserInfo().driverId,
        callback: () => {
          clearJpushAlias();
          clearLoginInfo();
          clearUserInfo();
          const tmpParam = {
            account: getLoginParamInfo() ? getLoginParamInfo().account : '',
          };
          saveLoginParamInfo(tmpParam);
          router.push({
            pathname: '/',
          });
        },
      },
    });
    dispatch!({
      type: 'index/save',
      payload: {
        showDraw: false,
        stationList: [],
      },
    });
  };
  return (
    <div className={styles.setupPage}>
      <div>
        <WhiteSpace size="sm" />
        {formsData2.map(res => {
          return (
            <div key={res.fieldProps} className={styles.formsData}>
              <div>{res.title}</div>
              <div className={styles.placeholder}>
                <Switch
                  checked={switchStatus}
                  onClick={() => {
                    dispatch!({
                      type: 'setup/updatePowerNoticeSwitch',
                      payload: {
                        driverId: getUserInfo().driverId,
                        switchStatus: switchStatus ? '2' : '1',
                      },
                    });
                  }}
                />
              </div>
            </div>
          );
        })}
        <WhiteSpace size="xl" />
        {formsDataother.map(res => {
          return (
            <div
              key={res.fieldProps}
              className={styles.formsData}
              onClick={() => {
                if (res.onClick) {
                  res.onClick();
                }
              }}
            >
              <div>{res.title}</div>
              <div className={styles.placeholder}>
                <span>{res.placeholder}</span>
                {arrowImg()}
              </div>
            </div>
          );
        })}

        {formsData1.map(res => {
          return (
            <div
              key={res.fieldProps}
              className={styles.formsData}
              onClick={() => {
                if (res.onClick) {
                  res.onClick();
                }
              }}
            >
              <div>{res.title}</div>
              <div className={styles.placeholder}>
                <span>{res.placeholder}</span>
                {arrowImg()}
              </div>
            </div>
          );
        })}
      </div>

      {/* {(window as any).device && (window as any).device.platform.toLowerCase() === 'ios'
        ? formProps1.map((item, index) => (
            <DynamicForm {...item} key={index}>
              <WhiteSpace size="sm" />
            </DynamicForm>
          ))
        : formProps.map((item, index) => (
            <DynamicForm {...item} key={index}>
              <WhiteSpace size="sm" />
            </DynamicForm>
          ))} */}

      <div className={styles.exit}>
        <div hidden={driverType !== '5'} className={styles.exitZx} onClick={zxUserInfo}>
          注销用户
        </div>
        <div className={styles.exitTc} onClick={exit}>
          退出登录
        </div>
      </div>
    </div>
  );
};

export default connect(({ setup, index }: { setup: SetupModelState; index: IndexModelState }) => ({
  setup,
  index,
}))(SetupPage);
