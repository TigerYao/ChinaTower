import React, { FC, useEffect,useState } from 'react';
import { ModifyPhoneModelState,PersonalNewsModelState,ConnectProps, connect,router } from 'alita';
import styles from './index.less';
import { createForm, formShape } from 'rc-form';
import { List, InputItem ,Button, Toast,} from 'antd-mobile';
import {getUserInfo,saveUserInfo} from "@/utils/index"
import LoginInput from "@/components/LoginInput";
import LoginBtn from "@/components/LoginBtn";
interface PageProps extends ConnectProps {
  modifyPhone: ModifyPhoneModelState;
  form:formShape;
  personalNews: PersonalNewsModelState;
}

const ModifyPhonePage: FC<PageProps> = ({ modifyPhone, personalNews,dispatch,form }) => {
  let insertFormData: formShape = null;
  // 这里发起了初始化请求
  const driverId=getUserInfo().driverId
  const phoneNumber=getUserInfo().phoneNumber
  const pNumber=phoneNumber.substr(0,3)+"****"+phoneNumber.substr(7)
  // const [count,setCount]=useState(0)
  // console.log(phoneNumber,typeof phoneNumber,getUserInfo())
 
  const { getFieldProps, validateFields, setFieldsValue, getFieldValue } = form;
  const { 
    timer = null,
    userCode = "",
    sms = "",
   } = modifyPhone;
   const [count, setCount] = useState(0);
   let timer1 = null;
   /* 清除计时器 */
  const clearTimer = timer1 => {
    if (timer1) {
      clearInterval(timer1);
    }
    if (timer) {
      // 重新发送验证码时重新计时
      clearInterval(timer);
      dispatch!({
        type: 'modifyPhone/save',
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
  const onGetCaptcha = () => {
    if (insertFormData  != null) {
      insertFormData.validateFields((error, value) => {
        if (!value.userCode) {
          Toast.fail("请输入手机号码");
          return;
        }
        if (!isPoneAvailable(value.userCode)) {
          Toast.fail("手机号格式有误");
          return;
        } 
        if(value.userCode===phoneNumber){
          Toast.fail("不能与原号码相同")
          return
        }
        // console.log(value.userCode)
        dispatch!({
          type: 'modifyPhone/sendSms',
          payload: {
            userCode: value.userCode,
          },
        });

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
            type: 'modifyPhone/save',
            payload: {
              timer: timer1,
            },
          })
        
      });
    }
  };

  const toNext = () => {
    if (insertFormData != null) {
      insertFormData.validateFields((error, value) => {
        if (!value.userCode) {
          Toast.fail("请输入手机号码");
          return;
        }
        if (!isPoneAvailable(value.userCode)) {
          Toast.fail("手机号格式有误");
          return;
        } 
        if(value.userCode===phoneNumber){
          Toast.fail("不能与原号码相同")
          return
        }
        let userCode = value.userCode;
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
            type: 'modifyPhone/updateUserPhoneU',
            payload: {
              userCode,
              sms,
              driverId,
              callback:()=>{
                dispatch!({
                  type:"personalNews/save",
                  payload:{
                    phone:userCode.substr(0,3)+"****"+userCode.substr(7)
                  }
                })
                const upAvatar=getUserInfo();
                upAvatar.phoneNumber=userCode;
                upAvatar.account=userCode;
                saveUserInfo(upAvatar);
                // router.push({
                //   pathname:'/personalCenter/personalNews'
                // })
                router.goBack();
              }
            },
          })
          
        })
        
      });
    }
    
  };

  // }
  const formData = [
    {
      type: 'input',
      fieldProps: 'userCode',
      required: true,
      placeholder: '请输入新手机号',
      // initialValue: userCode,
    },
  ];

  useEffect(() => {
    // dispatch!({
    //   type: 'modifyPhone/query',
    // });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      clearTimer(timer);
      
      if (timer1) {
        clearTimer(timer1);
      }
    };
  }, []);

  return (
    <div className={styles.modifyPhone}>
      <div className={styles.phone}>当前账号：<span>{pNumber}</span></div>
      <LoginInput 
          formsData={formData}
          // eslint-disable-next-line no-return-assign
          ref={el => (insertFormData = el)}
        />
      <div className={styles.inputBox} key="sms">
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
      <LoginBtn title="下一步" styleS={{background: 'rgba(0,191,131,1)'}} click={toNext}/>
    </div>
  );
};

export default connect(({ modifyPhone }:{ modifyPhone: ModifyPhoneModelState; }) => ({ modifyPhone }))(createForm()(ModifyPhonePage));
