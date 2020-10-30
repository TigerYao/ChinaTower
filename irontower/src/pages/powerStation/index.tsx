import React, { FC, useEffect, useState } from 'react';
import { PowerStationModelState, ConnectProps, connect, history } from 'alita';
import styles from './index.less';
import { openMapApp } from '@/utils/cordovapluigs';

interface PageProps extends ConnectProps {
  powerStation: PowerStationModelState;
}

const PowerStationPage: FC<PageProps> = ({ powerStation, dispatch, location }) => {
  const [locationData, setLocationData] = useState({ list: [], item: {} });

  // 这里发起了初始化请求
  useEffect(() => {
    setLocationData({
      list: JSON.parse(location.query.list),
      item: JSON.parse(location.query.item),
    });

    console.log(JSON.parse(location.query.list), JSON.parse(location.query.item));
    // dispatch!({
    //   type: 'powerStation/query',
    // });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);

  const renderEleView = () => (
    <div className={styles.chargeEle}>
      <div className={styles.eleTitle}>电池充电情况</div>
      <div className={styles.eleBd}>
        <div className={styles.eleHd}>
          <div className={styles.countEle}>
            <div>
              60V共<span>{locationData.item.sixtyFullCount}</span>块
            </div>
            <div>
              48V共<span>{locationData.item.fortyeFullCount}</span>块
            </div>
          </div>
          <div className={styles.eleDes}>满电电池</div>
        </div>
        <div className={styles.eleFt}>
          <div className={styles.countEle}>
            <div className={styles.charging}>
              60V共<span>{locationData.item.sixtyNotFullCount}</span>块
            </div>
            <div className={styles.charging}>
              48V共<span>{locationData.item.fortyeNotFullCount}</span>块
            </div>
          </div>
          <div className={styles.eleDes}>充电电池</div>
        </div>
      </div>
    </div>
  );

  const renderEleCell = (code = '', name = '', onClick = () => {}) => {
    return (
      <div key={code} className={styles.eleCell} onClick={onClick}>
        <div className={styles.cabinetInfo}>
          <div>机柜码：{code}</div>
          <div>机柜名称：{name}</div>
        </div>
        <div className={styles.cabinetBtn}>电柜信息</div>
      </div>
    );
  };

  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = powerStation;
  return (
    <div className={styles.powerStation}>
      <div className={styles.mainWrapper}>
        <div className={styles.title}>
          <div className={styles.address}>
            <div>{locationData.item.name}</div>
            <div className={styles.stationAddress}>{locationData.item.stationAddress}</div>
          </div>
          <div
            className={styles.navMap}
            onClick={() => {
              openMapApp({
                name: locationData.item.stationAddress,
                lat: locationData.item.stationLatitude,
                lng: locationData.item.stationLongitude,
                origin: '我的位置',
                mode: 'riding',
              });
            }}
          >
            导航
          </div>
        </div>
        {renderEleView()}
        {locationData.list.map(item => {
          return renderEleCell(item.cabinetId, item.cabinetName, () => {
            history.push({
              pathname: 'cabinetDoorInfo',
              query: {
                cabinetId: item.cabinetId,
              },
            });
          });
        })}
      </div>
    </div>
  );
};

export default connect(({ powerStation }: { powerStation: PowerStationModelState }) => ({
  powerStation,
}))(PowerStationPage);
