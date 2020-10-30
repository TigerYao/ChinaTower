import React, { FC, useEffect } from 'react';
import { ResetSuccessModelState, ConnectProps, connect, router, ForgetPasswordModelState } from 'alita';
import { Button } from 'antd-mobile';
import ResetSuccessIcon from "@/assets/images/reset-success.png";
import {commonFunc, setJpushAlias } from '@/utils/cordovapluigs';
import styles from './index.less';

interface PageProps extends ConnectProps {
  resetSuccess: ResetSuccessModelState;
  forgetPassword: ForgetPasswordModelState;
}

const ResetSuccessPage: FC<PageProps> = ({ resetSuccess, dispatch, forgetPassword }) => {


  // 这里发起了初始化请求
  useEffect(() => {
    // dispatch!({
    //   type: 'resetSuccess/query',
    // });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      window.removeEventListener('click', () => {}); // 移除监听
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  const { 
    userCode = "",
    sms = "",
    password = "",
  } = forgetPassword;
  
  return (
    <div className={styles.center}>
      <img src={ResetSuccessIcon} />
      <div className={styles.title}>重置成功</div>
      <div className={styles.tip}>赞！您已成功重置密码</div>
      <Button
        onClick={() => {
          // console.log("返回首页");
          // router.push({
          //   pathname: '/',
          // })

          dispatch!({
            type: 'login/loginFun',
            payload: {
              userCode,
              passWord: password,
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

        }}
        className={styles.btn}
      >
        返回首页
      </Button>
    </div>
  );
};

export default connect(({ resetSuccess, forgetPassword }:{ resetSuccess: ResetSuccessModelState; forgetPassword: ForgetPasswordModelState; }) => ({ resetSuccess, forgetPassword }))(ResetSuccessPage);
