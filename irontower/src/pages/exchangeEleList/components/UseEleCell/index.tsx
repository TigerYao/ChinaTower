import React, { FC } from 'react';
import styles from './index.less';
interface EleListCellProps {
  onClick?: () => void;
  data?: object;
  dealClick?: (e: any) => void;
}

const EleListCell: FC<EleListCellProps> = ({ onClick = () => {}, data = {}, dealClick = (e: any) => {} }) => {
  const {
    // bsExchangeRecord = {},
    // borrowBsCabinetInfo = {},
  } = data;
  return (
    <div className={styles.eleList} onClick={onClick} >
      <div className={styles.eleHd}>
        <div className={styles.eleTitle}>电池编号: {data ? data.batteryId : ''}</div>
        <div className={styles.eleStatus}>正在使用</div>
      </div>
      <div className={styles.eleBd}>
        <div className={styles.eleInfo}>
          <div className={styles.eleLine}>电柜编码：{data ? data.outCabinetId : ''}</div>
          <div className={styles.eleLine}>电柜名称：{data ? data.cabinetName : ''}</div>
        </div>
        <div className={styles.eleBtn} onClick={dealClick}>退还</div>
      </div>
      <div className={styles.footer}>
        <div className={styles.startTime}>{data ? data.borrowTime : ''}</div>
        <div className={styles.endTime} style={{display:'none'}}>{data ? data.rerurnTime : ''}</div>
      </div>
    </div>
  );
};

export default EleListCell;
