import React, { FC, useEffect } from 'react';
import { SetPasswordModelState, ConnectProps, connect, router, RegisterModelState } from 'alita';
import { createForm, formShape } from 'rc-form';
import Title from '@/components/Title';
import LoginInput from '@/components/LoginInput';
import LoginBtn from '@/components/LoginBtn';
import { Toast } from 'antd-mobile';
import GoBackIcon from '@/assets/images/go-back.png';
import { commonFunc, setJpushAlias } from '@/utils/cordovapluigs';
import styles from './index.less';

interface PageProps extends ConnectProps {
  setPassword: SetPasswordModelState;
  form: formShape;
  register: RegisterModelState;
}

const SetPasswordPage: FC<PageProps> = ({ setPassword, register, dispatch, form }) => {
  let insertFormData: formShape = null;

  // 这里发起了初始化请求
  useEffect(() => {
    // dispatch!({
    //   type: 'setPassword/query',
    // });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { userCode = '', sms = '' } = register;

  const { getFieldProps, validateFields, setFieldsValue, getFieldValue } = form;

  const formData = [
    {
      type: 'textAndImgClick',
      fieldProps: 'password',
      required: true,
      placeholder: '请设置新密码(6位数字)',
      inputType: 'password',
      onChange: e => {
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
      onChange: e => {
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
            passwordCheck: insertFormData.props.form
              .getFieldValue('passwordCheck')
              .replace(/[^\d]/g, ''),
          });
          if (tmp && tmp.length > 6) {
            insertFormData.props.form.setFieldsValue({
              ...insertFormData.props.form.getFieldsValue(),
              passwordCheck: insertFormData.props.form
                .getFieldValue('passwordCheck')
                .substring(0, 6),
            });
          }
        }
      },
    },
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

  const goBack = () => {
    router.goBack();
  };

  const fotmatPhone = (data: string) => {
    return data.split(' ').join('');
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
        console.log('一致');
        commonFunc(
          {
            method: 'getAppDeviceModel',
          },
          (appName: any) => {
            // eslint-disable-next-line no-console
            console.log('appName==', appName);
            dispatch!({
              type: 'register/registerUser',
              payload: {
                userCode: fotmatPhone(userCode),
                password: value.password,
                sms,
                phoneModel: appName,
                callback: () => {
                  dispatch!({
                    type: 'register/smsLogin',
                    payload: {
                      userCode: fotmatPhone(userCode),
                      sms,
                      callback: (userInfo: { driverId: string }) => {
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
                },
              },
            });
          },
        );
      });
    }
  };

  return (
    <div className={styles.center}>
      <img src={GoBackIcon} className={styles.gobackImg} onClick={goBack} />
      <Title title="设置密码" />
      <LoginInput
        formsData={formData}
        // eslint-disable-next-line no-return-assign
        wrappedComponentRef={el => (insertFormData = el)}
        arrType={arrType}
      />
      <LoginBtn title="完成" styleS={{ background: 'rgba(0,191,131,1)' }} click={submit} />
    </div>
  );
};

export default connect(
  ({
    setPassword,
    register,
  }: {
    setPassword: SetPasswordModelState;
    register: RegisterModelState;
  }) => ({ setPassword, register }),
)(createForm()(SetPasswordPage));
