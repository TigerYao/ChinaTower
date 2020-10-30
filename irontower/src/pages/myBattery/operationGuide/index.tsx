import React, { FC, useEffect } from 'react';
import { OperationGuideModelState, ConnectProps, connect } from 'alita';
import { Player } from 'video-react';
import { Steps } from 'antd-mobile';
import styles from './index.less';

const { Step } = Steps;
interface PageProps extends ConnectProps {
  operationGuide: OperationGuideModelState;
}

const OperationGuidePage: FC<PageProps> = ({ operationGuide, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'operationGuide/query',
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = operationGuide;

  const customIcon = (key) => (
    <div className={styles.stepNumber}>
      {key}
    </div>
  );

  return (
    <div className={styles.center}>
      <div className={styles.videoContain}>
        <div className={styles.guideTitle}>
          操作指南
        </div>
        <div className={styles.guideSubTitle}>
          -1分钟了解铁塔换电-
        </div>
        <div>
        {/* /Users/kunfengchen/Documents/as_pro/iwhale/irontower/irontower/src/pages/myBattery/operationGuide/index.tsx */}
          <Player playsInline src={'http://120.52.40.38:1032/file/video/f1f09ffc6efd4f10acb88dba58fd3fae.mp4'}
          
          playsinline="true"        // IOS微信浏览器支持小窗内播放
          webkit-playsinline="true" // 这个属性是ios 10中设置可以，让视频在小窗内播放，也就是不是全屏播放 
          x5-video-player-type="h5" // 启用H5播放器,是微信安卓版特性
          x5-playsinline="true"     // 安卓微信浏览器支持小窗内播放
          x-webkit-airplay="allow"  // 这个属性使此视频支持ios的AirPlay功能 
          style="object-fit:fill"
          />
        </div>
      </div>
      <div className={styles.stepContain}>
        <div className={styles.desc}>
          换电使用说明
        </div>
        <div className={styles.subDesc}>
          -铁塔能源-
          {/* <Badge text="减" hot style={{ marginLeft: 12 }} /> */}
        </div>
        <div className={styles.stepDesc}>
          <div className={styles.stepTitle}>首次取电</div>
          <Steps size="small" current={1}>
            <Step title="去往各大应用商店或应用市场搜索关键字“铁塔换电”，下载并安装铁塔换电客户端APP,实名注册后缴纳押金及月租金。" icon={customIcon(1)} />
            <Step title="打开铁塔换电客户端APP，点击“扫码换电”扫描柜体二维码或屏幕上的二维码，首放时先选择所需电池的电压值，仓门自动弹开，即可取用电池使用。" icon={customIcon(2)} />
          </Steps>
        </div>
        <div className={styles.stepDesc}>
          <div className={styles.stepTitle}>换电操作</div>
          <Steps size="small" current={1}>
            <Step title="打开铁塔换电客户端APP软件，点击“扫码换电”扫描柜体二维码或屏幕上方二维码，换电柜仓门自动弹开，将已使用电池放入空仓，接好充电线后关闭仓门。" icon={customIcon(1)} />
            <Step title="等待5秒，满电电池仓门将自动打开，取出满电电池后关闭仓门即可完成换电。" icon={customIcon(2)} />
          </Steps>
        </div>
        <div className={styles.stepDesc}>
          <div className={styles.stepTitle}>电池信息</div>
          <div className={styles.stepInfo}>
            铁塔换电所有电池均为换电专用动力电池，内置BMS模板、GPS定位系统、过载保护系统。
          </div>
        </div>
        <div className={styles.stepDesc}>
          <div className={styles.stepTitle}>注意事项</div>
          <Steps size="small" current={1}>
            <Step title="换电柜内有高压电，全方位24小时监控，请勿拆卸、打砸、倚靠换电柜。" icon={customIcon(1)} />
            <Step title="所有电池均无法使用换电柜以外的任何设备充电，请勿改造、拆卸电池。" icon={customIcon(2)} />
            <Step title="所有电池均为电瓶车专用，请勿挪作它用，请勿串、并联，请勿水泡、摔砸电池。" icon={customIcon(3)} />
          </Steps>
        </div>
        <div className={styles.stepDesc}>
          <div className={styles.stepTitle}>退电流程</div>
          <div className={styles.stepInfo}>
            打开铁塔换电客户端APP软件，【点击我的电池】—【点击退电】—【扫描柜体二维码】—【弹出一个空仓】—【将电池放入空仓内】—【点击退款】一【完成退电】。
          </div>
        </div>
        <div className={styles.stepDesc}>
          <div className={styles.stepTitle}>用户注销</div>
          <div className={styles.stepInfo}>
          请拨打10096客服电话，进行账户注销。
          </div>
        </div>
        <div className={styles.stepDesc}>
          <div className={styles.serviceTelephone}>
            客服电话：10096
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ operationGuide }:{ operationGuide: OperationGuideModelState; }) => ({ operationGuide }))(OperationGuidePage);
