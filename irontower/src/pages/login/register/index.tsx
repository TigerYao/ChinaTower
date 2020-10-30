import React, { FC, useEffect, useState } from 'react';
import { RegisterModelState, ConnectProps, connect, router, ForgetPasswordModelState } from 'alita';
import { InputItem, Toast } from 'antd-mobile';
import Title from '@/components/Title';
import LoginBtn from '@/components/LoginBtn';
import { createForm, formShape } from 'rc-form';
import LoginCloseIcon from '@/assets/images/login-close.png';
import NonCheckIcon from '@/assets/images/non-check.png';
import CheckedIcon from '@/assets/images/checked.png';
import styles from './index.less';
import { commonFunc } from '@/utils/cordovapluigs';

interface PageProps extends ConnectProps {
  register: RegisterModelState;
  form: formShape;
  forgetPassword: ForgetPasswordModelState;
}

const RegisterPage: FC<PageProps> = ({ register, dispatch, form, forgetPassword }) => {
  
  const [showBottom, setShowBottom] = useState(true);
  const [check, setCheck] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const { userCode } = register;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getFieldProps, validateFields, setFieldsValue, getFieldValue } = form;

  /* 判断手机号格式是否正确 */
  const isPoneAvailable = (data: string) => {
    const myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(data)) {
      return false;
    }
    return true;
  };

  const fotmatPhone = (data: string) => {
    return data.split(' ').join('');
  };

  // 这里发起了初始化请求
  useEffect(() => {
    const yetHeight = document.getElementsByClassName('rumtime-keep-alive-layout-no')[0].clientHeight;
    
    window.addEventListener('resize', () => {
      // eslint-disable-next-line prefer-const
      let currHeight = document.getElementsByClassName('rumtime-keep-alive-layout-no')[0].clientHeight;
      if (currHeight < yetHeight) {
        setShowBottom(false)
      } else {
        setShowBottom(true);
      }
    });

    window.addEventListener('click', () => {
      if (!getFieldValue('userCode')) {
        setIsReady(false);
      }
    });

    if (userCode && check && isPoneAvailable(fotmatPhone(userCode))) {
      setIsReady(true);
    }
    
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      window.removeEventListener('resize', () => {}); // 移除监听
      window.removeEventListener('click', () => {}); // 移除监听
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  // 0 充值协议  1 押金协议 2 用户协议  3 隐私协议
  const goProtocolDetail = (type?: string) => {
    dispatch!({
      type: 'login/getAgreement',
      payload: {
        type: 'user_agreement',
        callback: url => {

          validateFields((error, value) => {
            dispatch!({
              type: 'register/save',
              payload: {
                userCode: value.userCode || "",
              },
            });
          });

          if (type === '2') {
            dispatch!({
              type: 'protocol/save',
              payload: {
                protocolDetail: url,
              }
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

  

  const toLogin = () => {
    // eslint-disable-next-line no-console
    // console.log('去密码登录');
    dispatch!({
      type: 'register/save',
      payload: {
        userCode: "",
      },
    });
    router.push({
      pathname: '/',
    });
  };

  const close = () => {
    // console.log("...", getFieldValue('userCode'));
    validateFields((error, value) => {
      // eslint-disable-next-line no-console
      // console.log(value);
      if (!value.userCode) {
        setIsReady(false);
        return;
      }
      if (!isPoneAvailable(fotmatPhone(value.userCode))) {
        setIsReady(false);
        return;
      }
      if (!check) {
        setIsReady(false);
        return;
      }
      setIsReady(true);
    });
  };

  const getSms = () => {
    validateFields((error, value) => {
      // eslint-disable-next-line no-console
      console.log(value);
      if (!value.userCode) {
        Toast.fail('请输入手机号');
        setIsReady(false);
        return;
      }
      if (!isPoneAvailable(fotmatPhone(value.userCode))) {
        Toast.fail('请输入正确的手机号');
        setIsReady(false);
        return;
      }
      if (!check) {
        Toast.fail('请同意协议');
        setIsReady(false);
        return;
      }
      setIsReady(true);
      dispatch!({
        type: 'register/save',
        payload: {
          userCode: value.userCode,
        },
      });
      dispatch!({
        type: 'register/sendSms',
        payload: {
          userCode: fotmatPhone(value.userCode),
          callback: () => { 
            Toast.success('验证码已发送');
            router.push({
              pathname: '/login/registerCode',
            });
          }
        },
      });
      
    });
  };

  return (
    <div className={styles.center}>
      {/* <img src={LoginCloseIcon} className={styles.closeImg} /> */}
      <div className={styles.closeDiv}></div>
      <Title title="登录铁塔换电" />
      <div className={styles.littleTitle}>新用户自动创建账户</div>

      <div className={styles.inputBox} key="userCode" onChange={close}>
        <InputItem
          type="phone"
          clear
          {...getFieldProps('userCode', {
            initialValue: userCode,
            rules: [{ required: true }],
          })}
          
          placeholder="请输入手机号码"
          onBlur={() => {
            validateFields((error, value) => {
              console.log(error)
              // eslint-disable-next-line no-console
              console.log(value);
              if (!value.userCode) {
                setIsReady(false);
                return;
              }
              if (!isPoneAvailable(fotmatPhone(value.userCode))) {
                setIsReady(false);
                return;
              }
              if (!check) {
                setIsReady(false);
                return;
              }
              setIsReady(true);
            });
          }}
        />
      </div>

      <LoginBtn
        title="获取短信验证码"
        styleS={
          isReady ? { background: 'rgba(0,191,131,1)' } : { background: 'rgba(128,224,194,1)' }
        }
        click={getSms}
      />

      <div className={styles.lastBox}>
        <div onClick={toLogin}>密码登录</div>
      </div>

      <div className={styles.bottomBox} style={{display: showBottom ? 'block' : 'none'}}>
        <div className={styles.bottomAgreement}>
          <img
            src={check ? CheckedIcon : NonCheckIcon}
            onClick={() => {
              if (check) {
                setIsReady(false);
              } else {
                validateFields((error, value) => {
                  if (!value.userCode) {
                    setIsReady(false);
                    return;
                  }
                  if (!isPoneAvailable(fotmatPhone(value.userCode))) {
                    setIsReady(false);
                    return;
                  }
                  if (!isReady) {
                    setIsReady(true);
                  }
                });
              }
              setCheck(!check);

            }}
          />
          <span>我已阅读并同意</span>
          <a>
            <span
              onClick={() => {
                goProtocolDetail('2');
              }}
            >
              铁塔用户协议
            </span>{' '}
            {/* <span
              onClick={() => {
                goProtocolDetail('3');
              }}
            >
              、隐私协议
            </span> */}
          </a>
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({
    register,
    forgetPassword,
  }: {
    register: RegisterModelState;
    forgetPassword: ForgetPasswordModelState;
  }) => ({ register, forgetPassword }),
)(createForm()(RegisterPage));
