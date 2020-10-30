import React, { FC, useEffect } from 'react';
import { CabinetDoorInfoModelState, ConnectProps, connect } from 'alita';
import classNames from 'classnames';
import classnames from 'classnames'
import styles from './index.less';

interface PageProps extends ConnectProps {
  cabinetDoorInfo: CabinetDoorInfoModelState;
}

const CabinetDoorInfoPage: FC<PageProps> = ({ cabinetDoorInfo, dispatch, location }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'cabinetDoorInfo/queryCabinetDoorInfo',
      payload: {
        cabinetId: location.query.cabinetId,
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { info } = cabinetDoorInfo;
  return (
    <div className={styles.center}>
      <div className={styles.id}>机柜码：{location.query.cabinetId}</div>
      <div className={styles.cabinetDoorList}>
        {(info.bsBatteryInfoList || []).map(
          (item: {
            lastBindCabin: React.ReactNode;
            batteryStatus: string;
            currentCapacity: any;
          }) => {
            const classNameArr = [styles.cabinetDoorItem];
            const powerClassNameArr = [styles.batteryPower];
            const currentCapacity = Number(item.currentCapacity || 0);
            let tipMsg = '空仓';
            if (item.batteryStatus === '0') {
              classNameArr.push(styles.cabinetDoorItemEmpty);
            } else if (currentCapacity >= 0 && currentCapacity < 80) {
              classNameArr.push(...[styles.cabinetDoorItemLow]);
              tipMsg = `${item.fullCapacityTime}分钟后可用`;
              powerClassNameArr.push(...[styles.batteryCharge]);
            } else if (currentCapacity >= 80) {
              classNameArr.push(...[styles.cabinetDoorItemFull]);
              tipMsg = '可用';
            }
            return (
              <div className={classNames(classNameArr)}>
                <div className={styles.topInfo}>
                  <div className={styles.indexPage}>{item.lastBindCabin}</div>
                  {
                    item.batteryStatus === '1' && (
                      <div className={styles.batteryInfo}>
                        <div className={classnames(powerClassNameArr)}>
                          <div
                            className={styles.batteryPercent}
                            style={{ width: `${item.currentCapacity}%` }}
                          >
                          </div>
                        </div>
                        <div>{item.currentCapacity}%</div>
                      </div>
                    )
                  }
                </div>
                <div
                  className={styles.batteryContain}
                  style={{ flex: 1, textAlign: 'center', fontWeight: 600 }}
                >
                  {tipMsg}
                </div>
                {
                  item.batteryStatus === '1' && (
                    <div className={styles.topInfo}>
                      <div style={{ fontSize:25 }}>{item.batteryId}</div>
                      <div>{item.batteryVoltage}V</div>
                    </div>
                  )
                }
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};

export default connect(({ cabinetDoorInfo }: { cabinetDoorInfo: CabinetDoorInfoModelState }) => ({
  cabinetDoorInfo,
}))(CabinetDoorInfoPage);
