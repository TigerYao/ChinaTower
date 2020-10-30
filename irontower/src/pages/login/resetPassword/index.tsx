import React, { FC, useEffect } from 'react';
import { ResetPasswordModelState, ConnectProps, connect, router, ForgetPasswordModelState } from 'alita';
import { createForm, formShape } from 'rc-form';
import Title from "@/components/Title";
import LoginInput from "@/components/LoginInput";
import LoginBtn from "@/components/LoginBtn";
import { getLoginParamInfo, saveLoginParamInfo } from '@/utils/index';
import { Toast } from 'antd-mobile';

import GoBackIcon from '@/assets/images/go-back.png';

import styles from './index.less';

interface PageProps extends ConnectProps {
  resetPassword: ResetPasswordModelState;
  form: formShape;
  forgetPassword: ForgetPasswordModelState;
}

const ResetPasswordPage: FC<PageProps> = ({ resetPassword, forgetPassword, dispatch, form }) => {
  let insertFormData: formShape = null;
  // 这里发起了初始化请求
  useEffect(() => {
    // dispatch!({
    //   type: 'resetPassword/query',
    // });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      window.removeEventListener('click', () => {}); // 移除监听
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getFieldProps, validateFields, setFieldsValue, getFieldValue } = form;

  const { name } = resetPassword;
  const { 
    userCode = "",
    sms = "",
  } = forgetPassword;

  const formData = [
    {
      type: 'textAndImgClick',
      fieldProps: 'password',
      required: true,
      placeholder: '请设置新密码(6位数字)',
      inputType: 'password',
      onChange: (e) => {
        // console.log(insertFormData)
        let tmp = '';
        if (insertFormData) {
          tmp = insertFormData.props.form.getFieldValue('password');
        }
        // console.log(tmp)
        if (insertFormData) {
          insertFormData.props.form.setFieldsValue({
            ...insertFormData.props.form.getFieldsValue(),
            password: insertFormData.props.form.getFieldValue('password').replace(/[^\d]/g, ''),
          });
          if (tmp && tmp.length > 6) {
            insertFormData.props.form.setFieldsValue({
              ...insertFormData.props.form.getFieldsValue(),
              password: insertFormData.props.form.getFieldValue('password').substring(0, 6),
            });
          }
        }
      },
    },
    {
      type: 'textAndImgClick',
      fieldProps: 'passwordCheck',
      required: true,
      placeholder: '请确认密码',
      inputType: 'password',
      onChange: (e) => {
        // console.log(insertFormData)
        let tmp = '';
        if (insertFormData) {
          // if (!insertFormData.props.form.getFieldValue('password')) {
          //   Toast.info('请先设置新密码');
          //   insertFormData.props.form.setFieldsValue({
          //     ...insertFormData.props.form.getFieldsValue(),
          //     passwordCheck: '',
          //   });
          //   return;
          // }
          tmp = insertFormData.props.form.getFieldValue('passwordCheck');
        }
        // console.log(tmp)
        if (insertFormData) {
          insertFormData.props.form.setFieldsValue({
            ...insertFormData.props.form.getFieldsValue(),
            passwordCheck: insertFormData.props.form.getFieldValue('passwordCheck').replace(/[^\d]/g, ''),
          });
          if (tmp && tmp.length > 6) {
            insertFormData.props.form.setFieldsValue({
              ...insertFormData.props.form.getFieldsValue(),
              passwordCheck: insertFormData.props.form.getFieldValue('passwordCheck').substring(0, 6),
            });
          }
        }
      },
    }
  ];

  const arrType = [
    {
      fieldProps: 'password',
      inputType: 'password',
    },
    {
      fieldProps: 'passwordCheck',
      inputType: 'password',
    },
  ];

  // const getArrType = () => {
  //   // eslint-disable-next-line prefer-const
  //   let tmp = [];
  //   formData.map(item => {
  //     if (item.type === 'textAndImgClick') {
  //       if (item.inputType === 'password') {
  //           tmp.push({fieldProps: item.fieldProps, inputType: item.inputType});
  //       }
  //     }
  //   });
  //   return tmp;
  // };

  const goBack = () => {
    router.goBack();
  };

  const submit = () => {
    if (insertFormData != null) {
      insertFormData.props.form.validateFields((error, value) => {
        if (!value.password) {
          Toast.fail('请输入密码');
          return;
        }
        if (value.password.length < 6) {
          Toast.fail('请设置6位密码');
          return;
        }
        if (!value.passwordCheck) {
          Toast.fail('请确认密码');
          return;
        }
        if (value.password !== value.passwordCheck) {
          Toast.fail('密码不一致');
          return;
        }
        console.log("一致");

        dispatch!({
          type: 'forgetPassword/save',
          payload: {
            password: value.password,
          }
        });

        dispatch!({
            type: 'forgetPassword/updataPassword',
            payload: {
              userCode,
              password: value.password,
              sms,
              callback: () => {
                const tmpParam = {
                  account: getLoginParamInfo() ? getLoginParamInfo().account : '',
                };
                saveLoginParamInfo(tmpParam);
                router.push({
                  pathname: '/login/resetSuccess',
                });
              },
            },
        })
      });
    }
    
  };

  return (
    <div className={styles.center}>
      <img src={GoBackIcon} className={styles.gobackImg} onClick={goBack} />
      <Title title="重置密码" /> 
      <LoginInput 
          formsData={formData}
          // eslint-disable-next-line no-return-assign
          wrappedComponentRef={el => (insertFormData = el)}
          arrType={arrType}
        />
      <LoginBtn title="完成" styleS={{background: 'rgba(0,191,131,1)'}} click={submit}/>
      
    </div>
  );
};

export default connect(({ resetPassword, forgetPassword }:{ resetPassword: ResetPasswordModelState; forgetPassword: ForgetPasswordModelState; }) => ({ resetPassword, forgetPassword }))(createForm()(ResetPasswordPage));
