import React, { FC, useEffect, useState } from 'react';
import { ForgetPasswordModelState, ConnectProps, connect, router } from 'alita';
import { createForm, formShape } from 'rc-form';
import { Button, Toast, InputItem } from 'antd-mobile';
import Title from "@/components/Title";
import LoginInput from "@/components/LoginInput";
import LoginBtn from "@/components/LoginBtn";

import GoBackIcon from '@/assets/images/go-back.png';

import styles from './index.less';

interface PageProps extends ConnectProps {
  forgetPassword: ForgetPasswordModelState;
  form: formShape;
}

const ForgetPasswordPage: FC<PageProps> = ({ forgetPassword, dispatch, form }) => {
  let insertFormData: formShape = null;
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getFieldProps, validateFields, setFieldsValue, getFieldValue, getFieldsValue } = form;
  const [isReady, setIsReady] = useState(false);
  const [checkPhone, setCheckPhone] = useState(false);
  

  const { 
    timer = null,
    userCode = "",
    sms = "",
   } = forgetPassword;

  const [count, setCount] = useState(0);

  /* 清除计时器 */
  const clearTimer = timer1 => {
    if (timer1) {
      clearInterval(timer1);
    }
    if (timer) {
      // 重新发送验证码时重新计时
      clearInterval(timer);
      dispatch!({
        type: 'forgetPassword/save',
        payload: {
          timer: null,
        },
      });
    }
  };

  /* 判断手机号格式是否正确 */
  const isPoneAvailable = data => {
    const myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(data)) {
        return false;
    }
    return true;
  }

  let timer1 = null;

  const onGetCaptcha = () => {
    if (insertFormData  != null) {
      insertFormData.props.form.validateFields((error, value) => {
        if (!value.userCode) {
          Toast.fail("请输入手机号码");
          return;
        }
        if (!isPoneAvailable(value.userCode)) {
          Toast.fail("手机号格式有误");
          return;
        } 

        dispatch!({
          type: 'forgetPassword/sendSms',
          payload: {
            userCode: value.userCode,
          },
        });

        setCheckPhone(true);

        clearTimer('');
        // eslint-disable-next-line no-shadow
        let count = 119;
        setCount(count);
        timer1 = setInterval(() => {
          count -= 1;
          // console.log(count);
          setCount(count);
          if (count === 0) {
            clearTimer(timer1);
          }
        }, 1000);
        dispatch!({
          type: 'forgetPassword/save',
          payload: {
            timer: timer1,
          },
        });
        
      });
    }
  };

  // const showSms = () => (
  //     <Button
  //       onClick={() => {
  //         onGetCaptcha();
  //       }}
  //       disabled={Boolean(count)}
  //       className={styles.yanzhengmaBtn}
  //     >
  //       {count ? `${count} s` : '发送验证码'}
  //     </Button>
  //   );

  const formData = [
    {
      type: 'input',
      fieldProps: 'userCode',
      required: true,
      placeholder: '请输入手机号码',
      // initialValue: userCode,
    },
    // {
    //   type: 'input',
    //   fieldProps: 'sms',
    //   required: true,
    //   placeholder: '请输入短信验证码',
    //   inputType: 'text',
    //   extra: showSms(),
    //   initialValue: sms,
    //   clean: false,
    // }
  ];

  const phoneChange = () => {
    // console.log(insertFormData)
    let tmp = '';
    if (insertFormData) {
      tmp = insertFormData.props.form.getFieldValue('userCode');
    }
    // console.log(tmp)
    if (insertFormData) {
      insertFormData.props.form.setFieldsValue({
        ...insertFormData.props.form.getFieldsValue(),
        userCode: insertFormData.props.form.getFieldValue('userCode').replace(/[^\d]/g, ''),
      });
      if (tmp && tmp.length > 11) {
        insertFormData.props.form.setFieldsValue({
          ...insertFormData.props.form.getFieldsValue(),
          userCode: insertFormData.props.form.getFieldValue('userCode').substring(0, 11),
        });
      }

      if (tmp && tmp.length >= 11) {
        if (!isPoneAvailable(insertFormData.props.form.getFieldValue('userCode'))) {
          setIsReady(false);
          return;
        } 
        if (getFieldValue('sms') && getFieldValue('sms').length === 6) {
          setIsReady(true);
          return;
        }
      }
    }
    setIsReady(false);
  };

  const toNext = () => {
    if (insertFormData != null) {
      insertFormData.props.form.validateFields((error, value) => {
        if (!value.userCode) {
          Toast.fail("请输入手机号码");
          return;
        }
        if (!isPoneAvailable(value.userCode)) {
          Toast.fail("手机号格式有误");
          return;
        } 
        
        let { userCode } = value;
        // eslint-disable-next-line no-shadow
        let sms = "";
        validateFields((error, value) => {
          if (!value.sms) {
            Toast.fail("请输入验证码");
            return;
          }

          if (value.sms.length !== 6) {
            Toast.fail("验证码错误");
            return;
          }

          // eslint-disable-next-line prefer-destructuring
          sms = value.sms;

          dispatch!({
            type: 'forgetPassword/save',
            payload: {
              userCode,
              sms,
            },
          });

          dispatch!({
            type: 'forgetPassword/checkShortMessage',
            payload: {
              userCode,
              sms,
              callback: () => {
                // eslint-disable-next-line no-console
                console.log("下一步了");
                router.push({
                  pathname: '/login/resetPassword',
                })
              }
            }
          })

          
        })
        
      });
    }
    
  };

  const goBack = () => {
    router.goBack();
  };

  // 这里发起了初始化请求
  useEffect(() => {
    window.addEventListener('click', () => {
      const tmpInput = document.querySelector("input");
      if (tmpInput && tmpInput.value == "") {
        setCheckPhone(false);
        setIsReady(false);
      } 
      
      if (!getFieldValue('sms')) {
        setIsReady(false);
      }
      
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      clearTimer(timer); 
      if (timer1) {
        clearTimer(timer1);
      }
      window.removeEventListener('click', () => {}); // 移除监听
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  const checkInput = () => {
    let tmpS = '';
    if (getFieldValue('sms')) {
      tmpS = getFieldValue('sms');
    }
    if (getFieldValue('sms')) {
      setFieldsValue({
        ...getFieldsValue(),
        sms: getFieldValue('sms').replace(/[^\d]/g, ''),
      });
      if (tmpS && tmpS.length > 6) {
        setFieldsValue({
          ...getFieldsValue(),
          sms: getFieldValue('sms').substring(0, 6),
        });
      }
      if (checkPhone || (insertFormData && insertFormData.props.form.getFieldValue('userCode') && insertFormData.props.form.getFieldValue('userCode').length === 11)) {
        if (getFieldValue('sms') && getFieldValue('sms').length === 6) {
          setIsReady(true);
          return;
        }
      }
    }
    setIsReady(false);
  };


  return (
    <div className={styles.center}>
      <img src={GoBackIcon} className={styles.gobackImg} onClick={goBack} />
      <Title title="忘记密码" />
      <div onChange={phoneChange}>  
        <LoginInput 
          formsData={formData}
          // eslint-disable-next-line no-return-assign
          wrappedComponentRef={el => (insertFormData = el)}
        />
      </div>
      <div className={styles.inputBox} key="sms" onChange={checkInput}>
        <InputItem
          type="text"
          clear
          onFocus={() => {
              // msgPwdError && setMsgPwdError(false);
          }}
          // error={msgPwdError}
            {...getFieldProps('sms', {
              initialValue: sms,
              rules: [{ required: true }],
            })}
            extra={
              <Button
                onClick={() => {
                  onGetCaptcha();
                }}
                disabled={Boolean(count)}
                className={styles.yanzhengmaBtn}
              >
                {count ? `${count} s` : '发送验证码'}
              </Button>
            }
            placeholder="请输入短信验证码"
        />
      </div>
      <LoginBtn 
        title="下一步" 
        styleS={
          isReady ? { background: 'rgba(0,191,131,1)' } : { background: 'rgba(128,224,194,1)' }
        }
        click={toNext}
      />
      
    </div>
  );
};

export default connect(({ forgetPassword }:{ forgetPassword: ForgetPasswordModelState; }) => ({ forgetPassword }))(createForm()(ForgetPasswordPage));
