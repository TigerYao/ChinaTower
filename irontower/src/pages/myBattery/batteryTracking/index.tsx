import React, { FC, useEffect, useRef, useState } from 'react';
import { BatteryTrackingModelState, MyBatteryModelState, ConnectProps, connect } from 'alita';
import MapView from '@/components/MapView';
import IconCurrent from '@/assets/images/detail-current.png';
import { getLoginInfo } from '@/utils';
import styles from './index.less';

interface PageProps extends ConnectProps {
  batteryTracking: BatteryTrackingModelState;
  myBattery: MyBatteryModelState;
}

const BatteryTrackingPage: FC<PageProps> = ({ myBattery, batteryTracking, dispatch }) => {
  const mapView = useRef(null);
  const { batteryInfo = {} } = myBattery;
  const {
    batteryLongitude = '', // 经度
    batteryLatitude = '', // 维度
  } = batteryInfo;
  const [lat, setLat] = useState(false);
  const [lng, setLng] = useState(false);

  const getData = () => {
    dispatch!({
      type: 'myBattery/queryBatteryElectricQuantity',
      payload: {
        driverId: getLoginInfo().driverId,
      },
    });
  };
  // 这里发起了初始化请求
  useEffect(() => {
    getData();
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log(batteryLongitude, batteryLatitude); // 113.65	 34.76
      // mapView.current.setCenter((26.085834 + 26.087974) / 2.0, (119.269503 + 119.24401) / 2); // 维度，经度
      mapView.current.setCenter(Number(batteryLatitude), Number(batteryLongitude)); // 维度，经度
      setLat(batteryLatitude);
      setLng(batteryLongitude);
    }, 1000);

    // eslint-disable-next-line no-shadow
    const timer = setInterval(() => {
      getData();
    }, 10000);
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = batteryTracking;
  return (
    <div className={styles.center}>
      <MapView
        ref={mapView}
        id="mapViewTrACKING"
        zoom={14}
        // 119.269503,26.085834
        initialPosition={{ lat, lng }}
        curPosition={{
          onClick: (e: any) => {},
        }}
        labels={[
          {
            content: `<div style="width:35px; height:35px; background-image:url(${IconCurrent}); background-repeat:no-repeat; background-size:100% 100%;"></div>`,
            lng: batteryLongitude,
            lat: batteryLatitude,
            offset: [-15, -30],
          },
        ]}
      />
    </div>
  );
};

export default connect(
  ({
    batteryTracking,
    myBattery,
  }: {
    batteryTracking: BatteryTrackingModelState;
    myBattery: MyBatteryModelState;
  }) => ({ batteryTracking, myBattery }),
)(BatteryTrackingPage);
