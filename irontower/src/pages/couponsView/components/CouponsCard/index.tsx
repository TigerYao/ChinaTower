import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import styles from './index.less';

import IconArrowBottom from '@/assets/images/arrow-bottom.png';
import IconArrowTop from '@/assets/images/arrow-top.png';
import IconEnableCard from '@/assets/images/enable-card.png';
import IconEnableNotUsedCard from '@/assets/images/enable-not-used-card.png';
import IconDisableCard from '@/assets/images/disable-card.png';
import IconEnableGetCard from '@/assets/images/enable-get-card.png';
import { couponsTypeDict } from '@/utils/constant';

const dateFormat = 'YYYY-MM-DD';
interface CouponsCardProps {
  isEnable?: boolean;
  onUseClick?: () => void;
  item?: any;
}

const CouponsCard: FC<CouponsCardProps> = props => {
  const { isEnable = false, onUseClick = () => {}, item } = props;
  const [isAppend, setIsAppend] = useState(false);

  const getRightBgItem = () => {
    // 0未启用未使用 1未启用已过期 2已启用未使用 3已启用使用中 4已启用已过期 立即领取、等待生效中、生效中、已过期
    if (item.useStatus === '0') {
      return IconEnableGetCard;
    }
    if (item.useStatus === '1') {
      return IconDisableCard;
    }
    if (item.useStatus === '2') {
      return IconEnableNotUsedCard;
    }
    if (item.useStatus === '3') {
      return IconEnableCard;
    }
    return IconDisableCard;
  };

  return (
    <>
      <div
        className={`${styles.couponsCard} ${isAppend && styles.shadow}`}
        style={{ backgroundImage: `url(${getRightBgItem()})` }}
      >
        {/* <img className={styles.couponsBgView} src={IconEnableCard} alt="" /> */}
        <div className={styles.leftContent}>
          <div className={styles.title}>{item.couponName}</div>
          <div className={styles.time}>
            {
              (item.useStatus === '2' || item.useStatus === '3') ? 
                `生效期：${moment(item.startTime).format(dateFormat)}~${moment(item.expireTime).format(dateFormat)}`
                : `有效期：${item.validTime}~${item.invalidTime}`
            }
          </div>
          <div
            className={styles.detail}
            onClick={() => {
              setIsAppend(!isAppend);
            }}
          >
            <div>详情信息</div>
            <div>
              <img
                className={styles.arrowBottomIcon}
                src={isAppend ? IconArrowTop : IconArrowBottom}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.cardReason}>
            <span>{item.couponType === '1' ? item.couponDays : item.couponTimes}</span>
            {/* 1天  2次 */}
            {item.couponType === '1' ? '天' : '次'}
          </div>
          <div hidden={item.useStatus !== '0'} className={styles.cardBtn} onClick={onUseClick}>
            立即领取
          </div>
          <div
            hidden={item.useStatus === '0'}
            style={{ color: '#888888' }}
            className={styles.cardBtn}
          >
            {couponsTypeDict[item.useStatus]}
          </div>
        </div>
      </div>
      <div hidden={!isAppend} className={styles.couponsCardDetail}>
        <div>优惠券编码: {item.couponNo}</div>
        <div>订单号: {item.orderId}</div>
      </div>
    </>
  );
};

export default CouponsCard;
