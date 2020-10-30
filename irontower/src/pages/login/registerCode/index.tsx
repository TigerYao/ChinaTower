/* eslint-disable no-console */
import React, { FC, useEffect, useState } from 'react';
import { RegisterCodeModelState, ConnectProps, connect, router, RegisterModelState } from 'alita';
import { createForm, formShape } from 'rc-form';
import { Button, Toast, InputItem } from 'antd-mobile';
import LoginInput from '@/components/LoginInput';
import AutoTabInput from './components/AutoTabInput';
import { Form, Input } from 'antd';
import {commonFunc, setJpushAlias } from '@/utils/cordovapluigs';
import GoBackIcon from '@/assets/images/go-back.png';
// import InputGroup from 'react-input-groups';
// import 'react-input-groups/lib/css/styles.css'
import styles from './index.less';

interface PageProps extends ConnectProps {
  registerCode: RegisterCodeModelState;
  register: RegisterModelState;
}

const RegisterCodePage: FC<PageProps> = ({ registerCode, dispatch, register }) => {
  const { timer = null, userCode = '' } = register;

  const goBack = () => {
    router.goBack();
  };

  const [maxLength, setMaxLength] = useState(1);

  const [valueA, setValueA] = useState('');
  const [valueB, setValueB] = useState('');
  const [valueC, setValueC] = useState('');
  const [valueD, setValueD] = useState('');
  const [valueE, setValueE] = useState('');
  const [valueF, setValueF] = useState('');

  // const [isShow, setIsShow] = useState(false);

  const [count, setCount] = useState(0);

  let firstFoucs: any = '';
  let secondFoucs: any = '';
  let tridFoucs: any = '';
  let fourFoucs: any = '';
  let fivthFoucs: any = '';
  let sixthFoucs: any = '';

  /* 清除计时器 */
  const clearTimer = timer1 => {
    if (timer1) {
      clearInterval(timer1);
    }
    if (timer) {
      // 重新发送验证码时重新计时
      clearInterval(timer);
      dispatch!({
        type: 'register/save',
        payload: {
          timer: null,
        },
      });
    }
  };

  const getEveryValue = (num: string) => {
    if (num === '') {
      return '_';
    }
    return num;
  };

  const getInputCode = (A, B, C, D, E, F) => {
    let strNum = '';
    strNum = strNum.concat(getEveryValue(A));
    strNum = strNum.concat(getEveryValue(B));
    strNum = strNum.concat(getEveryValue(C));
    strNum = strNum.concat(getEveryValue(D));
    strNum = strNum.concat(getEveryValue(E));
    strNum = strNum.concat(getEveryValue(F));
    return strNum;
  };

  const fotmatPhone = (data: string) => {
    return data.split(' ').join('');
  };

  // 验证码光标后移
  const handleInputValue = (e: any, type: string) => {
    const { value = '' } = e.target;
    console.log('2345', value);
    const myreg = /^\d{6}$/;
    if (myreg.test(value)) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      setValuesCilpText(value);
      return;
    }

    let code = '';
    let newValue = value.replace(/\D/g, '').slice(0, 1);
    if (type === 'A') {
      if (newValue) secondFoucs.input.focus();
      setValueA(newValue);
      code = getInputCode(newValue, valueB, valueC, valueD, valueE, valueF);
    } else if (type === 'B') {
      if (newValue) tridFoucs.input.focus();
      setValueB(newValue);
      code = getInputCode(valueA, newValue, valueC, valueD, valueE, valueF);
    } else if (type === 'C') {
      if (newValue) fourFoucs.input.focus();
      setValueC(newValue);
      code = getInputCode(valueA, valueB, newValue, valueD, valueE, valueF);
    } else if (type === 'D') {
      if (newValue) fivthFoucs.input.focus();
      setValueD(newValue);
      code = getInputCode(valueA, valueB, valueC, newValue, valueE, valueF);
    } else if (type === 'E') {
      if (newValue) sixthFoucs.input.focus();
      setValueE(newValue);
      code = getInputCode(valueA, valueB, valueC, valueD, newValue, valueF);
    } else {
      setValueF(newValue);
      // setIsShow(true);
      code = getInputCode(valueA, valueB, valueC, valueD, valueE, newValue);
    }
    if (code && code.length && code.split('_').join('').length === 6) {
      console.log('完成输入验证码', code);
      dispatch!({
        type: 'register/save',
        payload: {
          sms: code,
        },
      });
      dispatch!({
        type: 'register/smsLogin',
        payload: {
          userCode: fotmatPhone(userCode),
          sms: code,
          callback: (userInfo: { driverId: string }) => {
            setJpushAlias(userInfo.driverId);
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
      // router.push({
      //   pathname: '/login/setPassword',
      // })
    }
  };

  // 删除验证码
  const handleDel = (e: any) => {
    const BACK_SPACE = 8;
    const isBackSpaceKey = e.keyCode === BACK_SPACE;
    if (isBackSpaceKey && e.target.value.length === 0) {
      let previous = e.target;
      previous = previous.previousElementSibling;
      while (previous) {
        if (previous === null) break;
        if (previous.tagName.toLowerCase() === 'input') {
          previous.focus();
          break;
        }
      }
    }
  };

  let timer1 = null;

  const onGetCaptcha = () => {
    clearTimer('');
    // eslint-disable-next-line no-shadow
    let count = 119;
    setCount(count);
    timer1 = setInterval(() => {
      count -= 1;
      setCount(count);
      if (count === 0) {
        clearTimer(timer1);
      }
    }, 1000);
    dispatch!({
      type: 'register/save',
      payload: {
        timer: timer1,
      },
    });
  };

  // 这里发起了初始化请求
  useEffect(() => {
    // dispatch!({
    //   type: 'registerCode/query',
    // });
    onGetCaptcha();
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      clearTimer(timer);
      if (timer1) {
        clearTimer(timer1);
      }
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  const setValuesCilpText = (clipText = '') => {
    const myreg = /^\d{6}$/;
    if (clipText && myreg.test(clipText)) {
      console.log('true');
      setValueA(clipText[0]);
      setValueB(clipText[1]);
      setValueC(clipText[2]);
      setValueD(clipText[3]);
      setValueE(clipText[4]);
      setValueF(clipText[5]);
      sixthFoucs.input.focus();
      console.log('完成输入验证码', clipText);
      dispatch!({
        type: 'register/save',
        payload: {
          sms: clipText,
        },
      });

      setTimeout(() => {
        dispatch!({
          type: 'register/smsLogin',
          payload: {
            userCode: fotmatPhone(userCode),
            sms: clipText,
            callback: (userInfo: { driverId: string }) => {
              setJpushAlias(userInfo.driverId);
              commonFunc({
                method: 'goMapView',
                params: {
                  ...userInfo,
                },
              });
            },
          },
        });
      }, 500);
    }
  };

  return (
    <div className={styles.center}>
      <img src={GoBackIcon} className={styles.gobackImg} onClick={goBack} />
      <div className={styles.title}>输入验证码</div>
      <div className={styles.tip}>验证码已发送至{userCode}</div>
      <Form className={styles.codeForm}>
        <Input
          className={styles.checkInput}
          type="tel"
          ref={ref => {
            firstFoucs = ref;
          }}
          value={valueA}
          onPaste={e => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            // eslint-disable-next-line prefer-const
            let clipText = e.clipboardData.getData('Text'); // 粘贴板的内容
            console.log('改造粘贴', clipText);

            setValuesCilpText(clipText);
          }}
          // maxLength={maxLength}
          onKeyDown={maxLength ? handleDel : () => {}}
          onChange={e => handleInputValue(e, 'A')}
        />
        <Input
          className={styles.checkInput}
          type="tel"
          ref={ref => {
            secondFoucs = ref;
          }}
          value={valueB}
          // maxLength={maxLength}
          onPaste={e => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            // eslint-disable-next-line prefer-const
            let clipText = e.clipboardData.getData('Text'); // 粘贴板的内容
            console.log('改造粘贴', clipText);

            setValuesCilpText(clipText);
          }}
          onKeyDown={maxLength ? handleDel : () => {}}
          onChange={e => handleInputValue(e, 'B')}
        />
        <Input
          className={styles.checkInput}
          type="tel"
          ref={ref => {
            tridFoucs = ref;
          }}
          value={valueC}
          onPaste={e => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            // eslint-disable-next-line prefer-const
            let clipText = e.clipboardData.getData('Text'); // 粘贴板的内容
            console.log('改造粘贴', clipText);

            setValuesCilpText(clipText);
          }}
          // maxLength={maxLength}
          onKeyDown={maxLength ? handleDel : () => {}}
          onChange={e => handleInputValue(e, 'C')}
        />
        <Input
          className={styles.checkInput}
          type="tel"
          ref={ref => {
            fourFoucs = ref;
          }}
          value={valueD}
          onPaste={e => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            // eslint-disable-next-line prefer-const
            let clipText = e.clipboardData.getData('Text'); // 粘贴板的内容
            console.log('改造粘贴', clipText);

            setValuesCilpText(clipText);
          }}
          // maxLength={maxLength}
          onKeyDown={maxLength ? handleDel : () => {}}
          onChange={e => handleInputValue(e, 'D')}
        />
        <Input
          className={styles.checkInput}
          type="tel"
          // pattern="[0-9]"
          ref={ref => {
            fivthFoucs = ref;
          }}
          value={valueE}
          // maxLength={maxLength}
          onPaste={e => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            // eslint-disable-next-line prefer-const
            let clipText = e.clipboardData.getData('Text'); // 粘贴板的内容
            console.log('改造粘贴', clipText);

            setValuesCilpText(clipText);
          }}
          onKeyDown={maxLength ? handleDel : () => {}}
          onChange={e => handleInputValue(e, 'E')}
        />
        <Input
          className={styles.checkInput}
          type="tel"
          // pattern="/[0-9\-]/"
          ref={ref => {
            sixthFoucs = ref;
          }}
          value={valueF}
          onPaste={e => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            // eslint-disable-next-line prefer-const
            let clipText = e.clipboardData.getData('Text'); // 粘贴板的内容
            console.log('改造粘贴', clipText);

            setValuesCilpText(clipText);
          }}
          // maxLength={maxLength}
          onKeyDown={maxLength ? handleDel : () => {}}
          onChange={e => handleInputValue(e, 'F')}
        />
      </Form>
      <Button
        onClick={() => {
          dispatch!({
            type: 'register/sendSms',
            payload: {
              userCode: fotmatPhone(userCode),
            },
          });
          onGetCaptcha();
        }}
        disabled={Boolean(count)}
        className={styles.codeTip}
      >
        {count ? `${count} 秒后重新获取验证码` : '重新获取验证码'}
      </Button>
    </div>
  );
};

export default connect(
  ({
    registerCode,
    register,
  }: {
    registerCode: RegisterCodeModelState;
    register: RegisterModelState;
  }) => ({ registerCode, register }),
)(RegisterCodePage);
