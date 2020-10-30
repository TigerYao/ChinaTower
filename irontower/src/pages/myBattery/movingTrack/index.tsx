import React, { FC, useState, useEffect } from 'react';
import { ConnectProps, connect, MyBatteryModelState, setPageNavBar } from 'alita';
import moment from 'moment';
import { DatePicker } from 'antd-mobile';
import iconTimePicker from '@/assets/images/icon-battery-timePicker.png';
import iconStart from '@/assets/images/icon-track-start.png';
import iconEnd from '@/assets/images/icon-track-end.png';
import { getUserInfo, getCurrentPosition } from '@/utils/index';
import styles from './index.less';

interface PageProps extends ConnectProps {
  myBattery: MyBatteryModelState;
}

interface InfoWindowProps {
  content?: string;
  offsetY?: number;
}

interface MapLableItemProps {
  lng?: string | number;
  lat?: string | number;
  content?: string; // 添加点的样式
  infoWindow?: InfoWindowProps; // null 点击不展示
  onClick?: (labelItem: MapLableItemProps) => void;
  offset?: [number | string, number | string];
}

interface queryTrackParamsProps {
  batteryId?: string;
  endTime?: string;
  startTime?: string;
}

const dateFormat = 'YYYY.MM.DD HH:mm:00';
const reqDateFormat = 'YYYY-MM-DD HH:mm:00';
const BMapGL = (window as any).BMap;
let trackMap: any = null;
let polyline: any = null;
let startMarker: any = null;
let endMarker: any = null;
/**
 * 运动轨迹
 */
export const MovingTrack: FC<PageProps> = ({ dispatch, myBattery, location, match }) => {
  // const [startTime, setStartTime] = useState(new Date(new Date().setDate((new Date()).getDate() - 1)));
  const [startTime, setStartTime] = useState(new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
  const [endTime, setEndTime] = useState(new Date());
  const [batteryId, setBatteryId] = useState(location.query.batteryId);
  const [queryParams, setQueryParams] = useState({
    startTime: moment()
      .add(-1, 'days')
      .format(reqDateFormat),
    batteryId,
    endTime: moment().format(reqDateFormat),
  });
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const { batteryTrackInfoList } = myBattery;
  const { batteryInfo = {} } = myBattery;
  const {
    batteryLongitude = '', // 经度
    batteryLatitude = '', // 维度
  } = batteryInfo;

  const queryBatteryTackInfo = (params: queryTrackParamsProps = {}) => {
    dispatch!({
      type: 'myBattery/queryBatteryTrackInfo',
      payload: {
        batteryId,
        ...params,
      },
    });
  };

  // 获取当前位置
  // const getCurrPosition = () => {
  //   getCurrentPosition({
  //     success: cor => {
  //       console.log(cor);
  //       const point = new BMapGL.Point(cor.longitude, cor.latitude);
  //       if ((window as any).navigator.userAgent.toLowerCase().indexOf('android') > -1) {
  //         // android
  //         trackMap.centerAndZoom(point, 20);
  //       } else {
  //         trackMap.setCenter(point);
  //       }
  //     },
  //     fail: () => {
  //       Toast.info('当前位置获取失败');
  //     },
  //   });
  // };

  const initMap = () => {
    // const { cityName } = getUserInfo();
    trackMap = new BMapGL.Map('batteryTrackMap');
    const point = new BMapGL.Point(batteryLongitude, batteryLatitude);
    trackMap.centerAndZoom(point, 15);
    // setTimeout(() => {
    //   getCurrPosition();
    // }, 200);
    // trackMap.setMapStyleV2({
    //   styleId: 'f3a5a3eef7bae25c2fdce41ef50fa3c1',
    // });
  };

  useEffect(() => {
    setBatteryId(location.query.batteryId);

    initMap();
    queryBatteryTackInfo({ ...queryParams });
    return () => {};
  }, []);

  const renderMarker = (labelItem: MapLableItemProps) => {
    const { content = '', onClick = () => {}, lng, lat, offset = [] } = labelItem;
    const label = new BMapGL.Label(content, {
      offset: new BMapGL.Size(offset[0], offset[1]),
      position: new BMapGL.Point(lng, lat),
    });
    label.setStyle({
      border: 'none',
      background: 'transparent',
    });
    if (onClick) {
      label.addEventListener('click', e => {
        if (e.domEvent) {
          e.domEvent.stopPropagation();
        }
        onClick(e);
      });
    }
    return label;
  };

  const refreshMapLine = () => {
    console.log(batteryTrackInfoList);
    const pointLineList: any[] = [];
    const len = batteryTrackInfoList.length;
    trackMap.removeOverlay(polyline);
    trackMap.removeOverlay(startMarker);
    trackMap.removeOverlay(endMarker);
    polyline = null;
    startMarker = null;
    endMarker = null;

    if (!len) {
      console.log(111111, polyline, startMarker, endMarker);
      return;
    }
    const endPoint = {
      lng: batteryTrackInfoList[0].batteryLongitude,
      lat: batteryTrackInfoList[0].batteryLatitude,
    };
    let startPoint = null;
    if (len >= 2) {
      startPoint = {
        lng: batteryTrackInfoList[len - 1].batteryLongitude,
        lat: batteryTrackInfoList[len - 1].batteryLatitude,
      };
    }
    batteryTrackInfoList.forEach(point => {
      pointLineList.push(new BMapGL.Point(point.batteryLongitude, point.batteryLatitude));
    });
    trackMap.centerAndZoom(
      new BMapGL.Point(
        batteryTrackInfoList[0].batteryLongitude,
        batteryTrackInfoList[0].batteryLatitude,
      ),
      15,
    );
    polyline = new BMapGL.Polyline(pointLineList, {
      strokeColor: '#0091FF',
      strokeWeight: 16,
      strokeOpacity: 1,
    });
    if (startPoint) {
      startMarker = renderMarker({
        ...startPoint,
        content: `<img src="${iconStart}" style="height:30px; width:30px" alt="" />`,
        offset: [-15, -30],
      });
      trackMap.addOverlay(startMarker); // 起点
    }
    endMarker = renderMarker({
      ...endPoint,
      content: `<img src="${iconEnd}" style="height:30px; width:30px" alt="" />`,
      offset: [-15, -30],
    });
    trackMap.addOverlay(endMarker); // 终点
    trackMap.addOverlay(polyline); // 增加折线
  };

  useEffect(() => {
    refreshMapLine();
    return () => {};
  }, [batteryTrackInfoList]);

  const handleShowStartTimePicker = () => {
    setShowStartTimePicker(true);
  };

  const handleHideStartTimePicker = () => {
    setShowStartTimePicker(false);
  };

  const handleShowEndTimePicker = () => {
    setShowEndTimePicker(true);
  };

  const handleHideEndTimePicker = () => {
    setShowEndTimePicker(false);
  };

  const handleStartPickerOk = (val: Date) => {
    console.log(val);
    handleHideStartTimePicker();
    setStartTime(val);
    const params = {
      ...queryParams,
      startTime: moment(val).format(reqDateFormat),
    };
    setQueryParams(params);
    queryBatteryTackInfo(params);
  };

  const handleEndPickerOk = (val: Date) => {
    handleHideEndTimePicker();
    setEndTime(val);
    const params = {
      ...queryParams,
      endTime: moment(val).format(reqDateFormat),
    };
    setQueryParams(params);
    queryBatteryTackInfo(params);
  };

  return (
    <div className={styles.movingTrack}>
      <DatePicker
        visible={showStartTimePicker}
        // value={new Date(moment(startTime.replace(/[.]/g, '/')).format('YYYY/MM/DD HH:mm:00'))}
        value={startTime}
        onOk={handleStartPickerOk}
        onDismiss={handleHideStartTimePicker}
        maxDate={endTime}
      />
      <DatePicker
        visible={showEndTimePicker}
        // value={new Date(endTime.replace(/[.]/g, '/'))}
        onOk={handleEndPickerOk}
        value={endTime}
        onDismiss={handleHideEndTimePicker}
        minDate={startTime}
      />
      <div className={styles.container}>
        <div className={styles.topWrap}>
          <div className={styles.timePicker}>
            <div className={styles.timeItem} onClick={handleShowStartTimePicker}>
              <span>{moment(startTime).format(dateFormat)}</span>
              <img className={styles.iconPicker} src={iconTimePicker} alt="" />
            </div>
            <div className={styles.interval}>~</div>
            <div className={styles.timeItem} onClick={handleShowEndTimePicker}>
              <span>{moment(endTime).format(dateFormat)}</span>
              <img className={styles.iconPicker} src={iconTimePicker} alt="" />
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div id="batteryTrackMap" className={styles.trackMap} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ myBattery }: { myBattery: MyBatteryModelState }) => ({ myBattery });

export default connect(mapStateToProps)(MovingTrack);
