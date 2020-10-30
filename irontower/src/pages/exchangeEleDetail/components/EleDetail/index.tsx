import React, { FC, useEffect, useState } from 'react';
import classnames from 'classnames';
import styles from './index.less';
import { history } from 'alita';

interface EleDetailProps {
  data?: object;
  dealClick?: (e: any) => void;
  status?: string;
}

const EleDetail: FC<EleDetailProps> = props => {
  const [show, setShow] = useState(false);
  const { data = {}, dealClick = () => {}, status = '' } = props;
  useEffect(() => {
    setShow(true);
    return () => {
      setShow(false);
    };
  }, []);
  const {
    
     } = data;
  return (
    <div className={classnames(styles.eleDetail, show && styles.show)}>
      <div className={styles.detailHd}>
        <div className={styles.detailTitle}>
          电池编码：{data ? data.batteryId : ''}
        </div>
        <div
          className={styles.detailStatus}
          style={{ color: status === '1' ? '#00BF8F' : '#FB602D' }}
        >
          {status === '1' ? '正在使用中' : '已完成'}
        </div>
      </div>
      <div className={styles.eleInfo}>
        <div className={styles.eleLine}>
          电柜名称：{data ? data.cabinetName : ''}
        </div>
        <div
          className={styles.openDetail}
          onClick={() => {
            history.push({
              pathname: '/eleCabinetDetail',
              query: {
                item: JSON.stringify(data),
                // stationId: borrowBsCabinetInfo ? borrowBsCabinetInfo.stationId : '',
                cabinetId: data ? data.cabinetId : '',
              },
            });
          }}
          style={{ marginRight: status === '1' ? '55px' : '0px' }}
        >
          查看电柜
        </div>
      </div>
      <div className={styles.eleCId} style={{ marginRight: status === '1' ? '55px' : '0px' }}>
        电柜编码：{data ? data.outCabinetId : ''}
      </div>
      <div className={styles.footer}>
        <div className={styles.startTime}>
          {data ? data.borrowTime : ''}
        </div>
        <div className={styles.endTime} style={{ display: status === '1' ? 'none' : 'block' }}>
          {data ? data.rerurnTime : ''}
        </div>
      </div>
      <div
        className={styles.sendBack}
        style={{ display: status === '1' ? 'block' : 'none' }}
        onClick={dealClick}
      >
        退还
      </div>
    </div>
  );
};

export default EleDetail;
