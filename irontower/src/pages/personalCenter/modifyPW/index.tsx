import React, { FC, useEffect, useState } from 'react';
import { ModifyPWModelState, ConnectProps, connect, router } from 'alita';
import { createForm, formShape } from 'rc-form';
import { getUserInfo, getLoginParamInfo, saveLoginParamInfo } from '@/utils/index';
import LoginInput from '@/components/LoginInput';
import { Toast } from 'antd-mobile';
import styles from './index.less';

interface PageProps extends ConnectProps {
  modifyPW: ModifyPWModelState;
  form: formShape;
}

const ModifyPWPage: FC<PageProps> = ({ modifyPW, dispatch }) => {
  let insertFormData: formShape = null;
  const [showBottom, setShowBottom] = useState(true);

  // 这里发起了初始化请求
  useEffect(() => {
    let yetHeight = 0;
    if (document.getElementsByClassName('rumtime-keep-alive-layout-no')[0]) {
      yetHeight = document.getElementsByClassName('rumtime-keep-alive-layout-no')[0].clientHeight;
    }

    window.addEventListener('resize', () => {
      // eslint-disable-next-line prefer-const
      let currHeight = document.getElementsByClassName('rumtime-keep-alive-layout-no')[0]
        .clientHeight;
      // eslint-disable-next-line @typescript-eslint/camelcase
      const ModifyPWPage_Footer = document.getElementById('ModifyPWPage_Footer');
      if (currHeight < yetHeight) {
        // setShowBottom(false);

        ModifyPWPage_Footer.style.display = 'none';
      } else {
        // setShowBottom(true);
        ModifyPWPage_Footer.style.display = 'block';
      }
    });

    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      // window.removeEventListener('resize', () => {}); // 移除监听
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  const { driverId } = getUserInfo();
  // const { getFieldProps, validateFields, setFieldsValue, getFieldValue } = form;
  // const [img,setImg]=useState(pwIcon)
  // const [img1,setImg1]=useState(pwIcon)
  // const [img2,setImg2]=useState(pwcloseIcon)
  const { name } = modifyPW;

  const formData = [
    {
      type: 'textAndImgClick',
      fieldProps: 'password',
      required: true,
      placeholder: '请输入旧密码',
      inputType: 'password',
    },
    {
      type: 'textAndImgClick',
      fieldProps: 'newPassword',
      required: true,
      placeholder: '请输入新密码(6位数字)',
      inputType: 'password',
      onChange: e => {
        let tmp = '';
        if (insertFormData) {
          tmp = insertFormData.props.form.getFieldValue('newPassword');
        }
        // console.log(tmp)
        if (insertFormData) {
          insertFormData.props.form.setFieldsValue({
            ...insertFormData.props.form.getFieldsValue(),
            newPassword: insertFormData.props.form
              .getFieldValue('newPassword')
              .replace(/[^\d]/g, ''),
          });
          if (tmp && tmp.length > 6) {
            insertFormData.props.form.setFieldsValue({
              ...insertFormData.props.form.getFieldsValue(),
              newPassword: insertFormData.props.form.getFieldValue('newPassword').substring(0, 6),
            });
          }
        }
      },
    },
    {
      type: 'textAndImgClick',
      fieldProps: 'passwordCheck',
      required: true,
      placeholder: '再次输入密码',
      inputType: 'password',
      onChange: e => {
        let tmp = '';
        if (insertFormData) {
          tmp = insertFormData.props.form.getFieldValue('passwordCheck');
        }
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
      fieldProps: 'newPassword',
      inputType: 'password',
    },
    {
      fieldProps: 'passwordCheck',
      inputType: 'password',
    },
  ];

  const save = () => {
    if (insertFormData != null) {
      insertFormData.props.form.validateFields((error, value) => {
        if (!value.password) {
          Toast.fail('请输入旧密码');
          return;
        }
        if (!value.newPassword) {
          Toast.fail('请输入新密码');
          return;
        }
        if (value.newPassword.length < 6) {
          Toast.fail('请设置6位密码');
          return;
        }
        if (!value.passwordCheck) {
          Toast.fail('再次输入密码');
          return;
        }
        if (value.newPassword !== value.passwordCheck) {
          Toast.fail('密码不一致');
          return;
        }
        if (value.password === value.newPassword || value.password === value.passwordCheck) {
          Toast.fail('新旧密码不能一致');
          return;
        }
        // eslint-disable-next-line no-console
        console.log('一致');
        const { password, newPassword } = value;
        dispatch!({
          type: 'modifyPW/updataPasswordU',
          payload: {
            password,
            newPassword,
            driverId,
            callback: () => {
              // router.push({
              //   pathname:'/personalCenter/personalNews'
              // })
              const tmpParam = {
                account: getLoginParamInfo() ? getLoginParamInfo().account : '',
              };
              saveLoginParamInfo(tmpParam);
              router.goBack();
            },
          },
        });
      });
    }
  };
  return (
    <div className={styles.Modifypw}>
      <LoginInput
        // onBlur={() => {
        //   setShowBottom(true);
        // }}
        // onFoucs={() => {
        //   setShowBottom(false);
        // }}
        formsData={formData}
        // eslint-disable-next-line no-return-assign
        wrappedComponentRef={el => (insertFormData = el)}
        arrType={arrType}
        centerSty={{ margin: '0px', padding: '0px 30px', background: '#ffffff' }}
      />
      {/* <div className={styles.list}>
          <List>
            <div className={styles.input}>
              <InputItem
                placeholder="请输入旧密码"
                type={img===pwIcon?"text":"password"}
                moneyKeyboardAlign="left"
              >
              </InputItem>
              <img src={img} onClick={()=>img===pwIcon?setImg(pwcloseIcon):setImg(pwIcon)} alt=""/>
              </div>
              
              <div className={styles.input}>
              <InputItem
                placeholder="请输入新密码"
                type={img1===pwIcon?"text":"password"}
                moneyKeyboardAlign="left"
              ></InputItem>
              <img src={img1} onClick={()=>img1===pwIcon?setImg1(pwcloseIcon):setImg1(pwIcon)} alt=""/>
              </div>
              <div className={styles.input}>
              <InputItem
                placeholder="再次输入密码"
                type={img2===pwIcon?"text":"password"}
                moneyKeyboardAlign="left"
              ></InputItem>
              <img src={img2} onClick={()=>img2===pwIcon?setImg2(pwcloseIcon):setImg2(pwIcon)} alt=""/>
              </div>
          </List>
        </div> */}
      <div
        id="ModifyPWPage_Footer"
        className={styles.foot}
        style={{ display: showBottom ? 'block' : 'none' }}
      >
        <div className={styles.button} onClick={save}>
          保存
        </div>
        {/* <div className={styles.line}></div> */}
      </div>
    </div>
  );
};

export default connect(({ modifyPW }: { modifyPW: ModifyPWModelState }) => ({ modifyPW }))(
  createForm()(ModifyPWPage),
);
