import React, { FC, useEffect, useState } from 'react';
import { QrCodeInvateModelState, ConnectProps, connect, setPageNavBar } from 'alita';
import { getUserInfo } from '@/utils';
import {  router } from 'alita';

import moreIcon from '@/assets/images/more-icon.png';
import QRCode from 'qrcode.react';
import { Toast } from 'antd-mobile';
import copy from 'copy-to-clipboard';
import { share } from '@/utils/cordovapluigs';

import styles from './index.less';

interface PageProps extends ConnectProps {
  qrCodeInvate: QrCodeInvateModelState;
}

const QrCodeInvatePage: FC<PageProps> = ({ qrCodeInvate, dispatch }) => {
  const [isShowMenu, setShowMenu] = useState(false);
  const { info } = qrCodeInvate;
  const { provinceId, realName, driverId,cityId } = getUserInfo();

  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'qrCodeInvate/getInvitationCodeByDriverId',
      payload: {
        provinceId,
        cityId,
        inviter: driverId,
        inviterName: realName,
      },
    });
    console.log('init isShowMenu', isShowMenu);

    setPageNavBar({
      pagePath: '/personalCenter/qrCodeInvate',
      navBar: {
        rightContent: (
          <div
            onClick={() => {
              console.log('isShowMenu', isShowMenu);

              setShowMenu(!isShowMenu);
            }}
          >
            <img  src={moreIcon}></img>
          </div>
        ),
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  const copyInvateCode = () => {
    if (info && info.invitationCode) {
      copy(info.invitationCode); //复制到剪切板,长按可粘贴
      Toast.success('已复制邀请码到剪切板');
    }

    // cordova.plugins.clipboard.copy(strCode);
  };

  return (
    <div>
      <div
        className={isShowMenu ? styles.moreMenu : styles.elementHidn}
        onClick={() => {
          setShowMenu(!isShowMenu);
        }}
      >
        <div className={styles.menuLayout}>
          <div
            className={styles.menuItem}
            onClick={() => {
              share(
                {
                  type: "text",
                  description: realName+'给您发送邀请码'+info.invitationCode+'。欢迎您绑定邀请码，使用铁塔换电服务。（邀请码2天内有效）',
                },
                () => {
                  // 成功回调
                },
                () => {
                  // 分享失败的回调
                },
              );
            }}
          >
            分享给好友
          </div>

          <div
            className={styles.menuItem}
            onClick={() => {
              router.push({
                pathname: '/personalCenter/InvateHistory',
              });
            }}
          >
            邀请记录
          </div>
          {/* <div
            className={styles.menuItem}
            onClick={() => {
              console.log('保存成图片');
            }}
          >
            保存成图片
          </div> */}
          <div
            className={styles.menuItem}
            onClick={() => {
              console.log('取消');
            }}
          >
            取消
          </div>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.main}>
          <div className={styles.title}>【{realName}的邀请码】</div>

          <div className={styles.qrBack}>
            <QRCode
              value={info.invitationCode ? info.invitationCode : ''} // 生成二维码的内容
              // value={'WERTYUI'}
             size={650} // 二维码的大小
              fgColor="#000000" // 二维码的颜色
              // imageSettings={{
              //   // 中间有图片logo
              //   src: logo,
              //   height: 60,
              //   width: 60,
              //   excavate: true,
              // }}
            />

            <div className={styles.tip1}>
              该邀请码2天内({info.expirationTime?info.expirationTime.substring(5, 10):""})有效，重新进入将更新
            </div>

            <div className={styles.qrInvate}>
              <div className={styles.qrCode}>{info.invitationCode}</div>
              <div className={styles.copy} onClick={copyInvateCode}>
                复制
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tip2}>邀请码在有效期内可被多人绑定，每人只能绑定一个邀请码</div>
      </div>
    </div>
  );
};

export default connect(({ qrCodeInvate }: { qrCodeInvate: QrCodeInvateModelState }) => ({
  qrCodeInvate,
}))(QrCodeInvatePage);
