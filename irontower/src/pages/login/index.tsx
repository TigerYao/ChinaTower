import React, { FC, useEffect, useState } from 'react';
import {
  LoginModelState,
  ConnectProps,
  connect,
  router,
  setPageNavBar,
  setTabBarList,
} from 'alita';

import { Icon, Toast } from 'antd-mobile';
import Title from '@/components/Title';
// import  DynamicForm, {useForm}  from '@alitajs/dform';
import LoginInput from '@/components/LoginInput';
import LoginBtn from '@/components/LoginBtn';
import { createForm, formShape } from 'rc-form';
import LoginCloseIcon from '@/assets/images/login-close.png';
import NonCheckIcon from '@/assets/images/non-check.png';
import CheckedIcon from '@/assets/images/checked.png';

import { getLoginInfo, getLoginParamInfo, getCurrentPosition } from '@/utils';
import { commonFunc, setJpushAlias } from '@/utils/cordovapluigs';
import styles from './index.less';
import { getAppShareLink } from '@/services/getRequest';

interface PageProps extends ConnectProps {
  login: LoginModelState;
  form: formShape;
}

const LoginPage: FC<PageProps> = ({ login, dispatch, location, form }) => {
  let insertFormData: formShape = null;
  const [isLogin, setisLogin] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [check, setCheck] = useState(true);
  const {
    account = '', // 登录账号
    password = '', //  登录密码
  } = getLoginParamInfo();

  const { tmpPhone = '', tmpPassword = '' } = login;

  const [layoutHeight, setLayoutHeight] = useState(0);
  const [showBottom, setShowBottom] = useState(true);

  // 判断手机键盘是否唤出，唤出则隐藏底部按钮
  const reSize = () => {
    // eslint-disable-next-line prefer-const
    let currHeight = document.getElementsByClassName('rumtime-keep-alive-layout-no')[0]
      .clientHeight;
    if (currHeight < layoutHeight) {
      setShowBottom(false);
    } else {
      setShowBottom(true);
    }
  };

  useEffect(() => {
    const loginInfo = getLoginInfo();
    if (loginInfo.token) {
      commonFunc({
        method: 'goMapView',
        params: loginInfo,
      });
    } else {
      setisLogin(true);
    }

    return () => {};
  }, []);

  // 这里发起了初始化请求
  useEffect(() => {
    getCurrentPosition(
      () => {},
      () => {},
    );
    if (document.getElementsByClassName('rumtime-keep-alive-layout-no')[0]) {
      setLayoutHeight(
        document.getElementsByClassName('rumtime-keep-alive-layout-no')[0].clientHeight,
      );
    }

    if (account && password && check) {
      setIsReady(true);
    }

    if (tmpPhone && tmpPassword && check) {
      setIsReady(true);
    }

    window.addEventListener('resize', reSize);

    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      window.removeEventListener('resize', reSize); // 移除监听
    };
  });
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  const onChange = () => {
    if (!check) {
      return;
    }
    if (insertFormData != null) {
      insertFormData.validateFields((error, value) => {
        if (!value.userCode) {
          if (isReady) {
            setIsReady(false);
          }
          return;
        }
        if (!value.passWord) {
          if (isReady) {
            setIsReady(false);
          }
          return;
        }
        if (!isReady) {
          setIsReady(true);
        }
      });
    }
  };

  const formData = [
    {
      type: 'input',
      fieldProps: 'userCode',
      initialValue: tmpPhone ? tmpPhone : account,
      required: true,
      placeholder: '请输入手机号码',
      // onValueChage: (e) => {test(e)}
    },
    {
      type: 'textAndImgClick',
      fieldProps: 'passWord',
      initialValue: tmpPassword ? tmpPassword : password,
      required: true,
      placeholder: '请输入登录密码',
      inputType: 'password',
    },
  ];

  const getArrType = () => {
    // eslint-disable-next-line prefer-const
    let tmp = [];
    formData.map(item => {
      if (item.type === 'textAndImgClick') {
        if (item.inputType === 'password') {
          tmp.push({ fieldProps: item.fieldProps, inputType: item.inputType });
        }
      }
    });
    return tmp;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getFieldProps, validateFields, setFieldsValue, getFieldValue } = form;

  const close = () => {
    // eslint-disable-next-line no-console
    // console.log('关闭');
  };
  const toRegister = () => {
    // eslint-disable-next-line no-console
    // console.log('去验证码登录/注册');
    dispatch!({
      type: 'login/save',
      payload: {
        tmpPhone: '',
        tmpPassword: '',
      },
    });
    router.push({
      pathname: '/login/register',
    });
  };
  const toResetPassword = () => {
    // eslint-disable-next-line no-console
    // console.log('忘记密码');
    dispatch!({
      type: 'login/save',
      payload: {
        tmpPhone: '',
        tmpPassword: '',
      },
    });
    dispatch!({
      type: 'forgetPassword/save',
      payload: {
        userCode: '',
        sms: '',
        timer: null,
      },
    });
    router.push({
      pathname: '/login/forgetPassword',
    });
  };

  const loginFun = () => {
    if (insertFormData != null) {
      insertFormData.validateFields((error, value) => {
        // eslint-disable-next-line no-console
        // console.log(error, value);
        if (!value.userCode) {
          if (isReady) {
            setIsReady(false);
          }
          Toast.fail('请输入账号');
          return;
        }
        if (!value.passWord) {
          if (isReady) {
            setIsReady(false);
          }
          Toast.fail('请输入密码');
          return;
        }

        if (!check) {
          Toast.fail('请同意协议');
          return;
        }

        if (!isReady) {
          setIsReady(true);
        }
        dispatch!({
          type: 'login/loginFun',
          payload: {
            userCode: value.userCode,
            passWord: value.passWord,
            callback: (userInfo: { driverId: string }) => {
              dispatch!({
                type: 'login/save',
                payload: {
                  tmpPhone: '',
                  tmpPassword: '',
                },
              });
              setJpushAlias(userInfo.driverId);
              localStorage.setItem('isRefreshIndex', 'yes');
              // router.push({
              //   pathname: '/index',
              // });

              commonFunc({
                method: 'goMapView',
                params: {
                  ...userInfo,
                },
              });
            },
          },
        });
      });
    }
  };

  // 0 充值协议  1 押金协议 2 用户协议  3 隐私协议
  const goProtocolDetail = (type?: string) => {
    dispatch!({
      type: 'login/getAgreement',
      payload: {
        type: 'user_agreement',
        callback: url => {
          if (insertFormData != null) {
            insertFormData.validateFields((error, value) => {
              dispatch!({
                type: 'login/save',
                payload: {
                  tmpPhone: value.userCode ? value.userCode : '',
                  tmpPassword: value.passWord ? value.passWord : '',
                },
              });
            });
          }

          if (type === '2') {
            dispatch!({
              type: 'protocol/save',
              payload: {
                protocolDetail: url,
              },
            });
            router.push({
              pathname: '/protocol',
              query: {
                title: '铁塔用户协议',
              },
            });
          }

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

  return (
    isLogin && (
      <div className={styles.center}>
        {/* <Icon key="0" type="cross" size='lg' style={{marginLeft: '26px'}} /> */}
        <img src={LoginCloseIcon} className={styles.closeImg} onClick={close} />
        <div className={styles.closeDiv}></div>
        <Title title="登录铁塔换电" />
        <div onChange={onChange}>
          <LoginInput
            formsData={formData}
            // eslint-disable-next-line no-return-assign
            ref={el => (insertFormData = el)}
            arrType={getArrType()}
          />
        </div>
        <LoginBtn
          title="登录"
          styleS={
            isReady ? { background: 'rgba(0,191,131,1)' } : { background: 'rgba(128,224,194,1)' }
          }
          click={loginFun}
        />
        <div className={styles.lastBox}>
          <div onClick={toRegister}>验证码登录/注册</div>
          <div onClick={toResetPassword}>忘记密码</div>
        </div>

        <div className={styles.bottomBox} style={{ display: showBottom ? 'block' : 'none' }}>
          <div className={styles.bottomAgreement}>
            <img
              src={check ? CheckedIcon : NonCheckIcon}
              onClick={() => {
                if (check) {
                  setIsReady(false);
                } else {
                  // eslint-disable-next-line no-lonely-if
                  if (insertFormData != null) {
                    insertFormData.validateFields((error, value) => {
                      if (!value.userCode) {
                        if (isReady) {
                          setIsReady(false);
                        }
                        return;
                      }
                      if (!value.passWord) {
                        if (isReady) {
                          setIsReady(false);
                        }
                        return;
                      }
                      if (!isReady) {
                        setIsReady(true);
                      }
                    });
                  }
                }
                setCheck(!check);
              }}
            />
            <span>我已阅读并同意</span>
            <a
              onClick={e => {
                e.preventDefault();
              }}
            >
              <span
                onClick={e => {
                  e.stopPropagation();
                  goProtocolDetail('2');
                }}
              >
                铁塔用户协议
              </span>
              {/* 、
              <span
                onClick={() => {
                  goProtocolDetail('3');
                }}
              >
                隐私协议
              </span> */}
            </a>
          </div>
        </div>
      </div>
    )
  );
};

export default connect(({ login }: { login: LoginModelState }) => ({
  login,
}))(createForm()(LoginPage));
