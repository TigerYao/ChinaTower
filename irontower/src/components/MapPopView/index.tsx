import React, { FC, useEffect, useState } from 'react';
import { Modal } from 'antd-mobile';
import classnames from 'classnames';
import { openMapApp } from '@/utils/cordovapluigs';
import { getCustomerTel } from '@/utils';
import styles from './index.less';

interface MapItemProps {
  eleCount: string | number;
  eleText: string;
  address: string;
  detailAddr: string;
  id: string;
  type: string;
}

interface MapPopViewProps {
  list: Array<MapItemProps>;
  show: boolean;
  onClick: (res: any, index: number) => void;
  onDetailHandle: (res: any, index: number) => void;
  onClose: () => void;
  navigationOptions: any;
  type: string;
}
const MapPopView: FC<MapPopViewProps> = ({
  list = [],
  show,
  onClick = () => {},
  onClose = () => {},
  navigationOptions = {},
  onDetailHandle = () => {},
  type = '',
}) => {
  console.log('-=====', list);
  useEffect(() => () => {}, []);

  // 换电站
  const renderBatteryStation = (data, index) => (
    <>
      <div className={styles.eleCount}>
        <div className={styles.count}>{data.eleCount}</div>
        <div className={styles.eleText}>{data.eleText}</div>
      </div>
      <div className={styles.address}>
        <div className={styles.mainTitle}>{data.address}</div>
        <div className={styles.subAddress}>{data.detailAddr}</div>
        <div className={styles.eleSection}>
          <div className={styles.sectionTitle}>60V</div>
          <div className={styles.sectionBody}>
            <div>
              满电
              <span style={{ color: 'rgba(0, 191, 131, 1)', fontSize: '0.36rem' }}>
                {data.fullCount60 || 0}
              </span>
              块
            </div>
            <div>充电中{data.notFullCount60 || 0}块 </div>
          </div>
        </div>
        <div className={styles.eleSection}>
          <div className={styles.sectionTitle}>48V</div>
          <div className={styles.sectionBody}>
            <div>
              满电
              <span style={{ color: 'rgba(0, 191, 131, 1)', fontSize: '0.36rem' }}>
                {data.fullCount48 || 0}
              </span>
              块
            </div>
            <div>充电中{data.notFullCount48 || 0}块</div>
          </div>
        </div>
      </div>
      {console.log('cabinetStatus ==>', data.cabinetStatus === '1')}
      {data.cabinetStatus !== '1' ? (
        <a
          className={styles.telBtn}
          style={{
            color: '#fff',
            background: '#ccc',
            boxShadow: ' 0 0.08rem 0.16rem 0 rgba(179, 179, 179, 0.3)',
            border: '1px solid rgba(179, 179, 179, 0.3)',
          }}
          onClick={() => {
            onClose();
            // onDetailHandle();
            onClick({ ...data, type }, index);
          }}
        >
          离线
        </a>
      ) : (
        <a
          className={styles.telBtn}
          onClick={() => {
            onClose();
            // onDetailHandle();
            onClick({ ...data, type }, index);
          }}
        >
          详情
        </a>
      )}
    </>
  );

  // 退电指引
  const renderReturnStation = (data, index) => (
    <>
      <div className={styles.eleCount}>
        <div className={styles.count}>{data.eleCount}</div>
        <div className={styles.eleText}>{data.eleText}</div>
      </div>
      <div className={styles.address}>
        <div className={styles.mainTitle}>{data.address}</div>
        <div className={styles.subAddress}>{data.detailAddr}</div>
        <div className={styles.eleSection}>
          <div className={styles.sectionTitle}>60V</div>
          <div className={styles.sectionBody}>
            <div>
              满电
              <span style={{ color: 'rgba(0, 191, 131, 1)', fontSize: '0.36rem' }}>
                {data.fullCount60 || 0}
              </span>
              块
            </div>
            <div>充电中{data.notFullCount60 || 0}块 </div>
          </div>
        </div>
        <div className={styles.eleSection}>
          <div className={styles.sectionTitle}>48V</div>
          <div className={styles.sectionBody}>
            <div>
              满电
              <span style={{ color: 'rgba(0, 191, 131, 1)', fontSize: '0.36rem' }}>
                {data.fullCount48 || 0}
              </span>
              块
            </div>
            <div>充电中{data.notFullCount48 || 0}块</div>
          </div>
        </div>
      </div>
      {console.log('cabinetStatus ==>', data.cabinetStatus === '1')}
      {data.cabinetStatus !== '1' ? (
        <a
          className={styles.telBtn}
          style={{
            color: '#fff',
            background: '#ccc',
            boxShadow: ' 0 0.08rem 0.16rem 0 rgba(179, 179, 179, 0.3)',
            border: '1px solid rgba(179, 179, 179, 0.3)',
          }}
        >
          离线
        </a>
      ) : (
        <a
          className={styles.telBtn}
          onClick={() => {
            onClose();
            // onDetailHandle();
            onClick(data, index);
          }}
        >
          详情
        </a>
      )}
    </>
  );

  const renderServiceNetwork = (data, index) => (
    <>
      <div className={styles.address}>
        <div className={styles.mainTitle}>{data.address}</div>
        <div className={styles.subAddress}>{data.detailAddr}</div>
      </div>
      <a
        className={styles.telBtn}
        onClick={() => {
          onClose();
          // onDetailHandle();
          onClick(data, index);
        }}
      >
        详情
      </a>
    </>
  );

  const renderContent = (data, index) => {
    let dom = null;
    switch (type) {
      case 'batteryStation':
        dom = renderBatteryStation({ ...data, type }, index);
        break;
      case 'serviceNetwork':
        dom = renderServiceNetwork({ ...data, type }, index);
        break;
      case 'return':
        dom = renderReturnStation({ ...data, type }, index);
        break;
      default:
        break;
    }
    return dom;
  };

  const renderListView = () => (
    <div className={styles.listView}>
      {list.map((res, index) => (
        <div
          key={res.id}
          className={styles.listViewCell}
          onClick={e => {
            e.stopPropagation();

            // onClose();
          }}
        >
          {renderContent(res, index)}
        </div>
      ))}
    </div>
  );
  const renderFt = () => (
    <div className={styles.ftView}>
      <a
        className={styles.telBtn}
        onClick={() => {
          onClose();
          onDetailHandle();
        }}
      >
        详情
      </a>
      <a
        className={styles.navigationBtn}
        onClick={() => {
          onClose();
          //   请求入参
          openMapApp(navigationOptions);
        }}
      >
        导航
      </a>
    </div>
  );
  return (
    <div className={classnames(styles.popViewContent, show && styles.showCon)}>
      {renderListView()}
      {/* {renderFt()} */}
    </div>
  );
};

export default MapPopView;
