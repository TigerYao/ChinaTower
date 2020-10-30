import React, { FC, useState, useEffect } from 'react';
import classnames from 'classnames';
import styles from './index.less';
import IconPayClose from '@/assets/images/pay-close.png';
import IconNoCheck from '@/assets/images/non-check.png';
import IconChecked from '@/assets/images/checked.png';

interface PayTypePopViewItem {
  onClick?: () => void;
  title: string;
  key: string | number;
}

interface PayTypesProps {
  icon: string;
  text: string;
  key: string;
}

interface PayTypePopViewnProps {
  visiable: boolean;
  onClose?: () => void;
  payTypes?: Array<PayTypesProps>;
  amount: number | string;
  feeType: string;
  onOk: (e: string) => void;
}

const PayTypePopView: FC<PayTypePopViewnProps> = ({
  visiable,
  payTypes = [],
  onClose = () => {},
  amount = '0',
  feeType = '',
  onOk = () => {},
}) => {
  const [selectKey, setSelectKey] = useState('');
  useEffect(() => {
    if (payTypes.length > 0) {
      setSelectKey(payTypes[0].key);
    }
    return () => {};
  }, []);

  const renderPayCell = (item: PayTypesProps) => (
    <div
      key={item.key}
      className={styles.payCellBox}
      onClick={() => {
        setSelectKey(item.key);
      }}
    >
      <div className={styles.leftIcon}>
        <img src={item.icon} alt="" />
        <span>{item.text}</span>
      </div>
      <div className={styles.radio}>
        <img src={selectKey !== item.key ? IconNoCheck : IconChecked} alt="" />
      </div>
    </div>
  );
  return (
    <>
      <div
        onClick={onClose}
        hidden={!visiable}
        className={classnames({
          [styles.modal]: true,
        })}
      ></div>
      <div
        className={classnames({
          [styles.wrapper]: true,
          [styles.show]: visiable,
        })}
      >
        <div className={styles.wrapperTitle}>
          <span>确认支付</span>
          <img src={IconPayClose} onClick={onClose} alt="" />
        </div>
        
        <div className={styles.price}>
          
          ¥<span>{amount}</span>
          <span className={styles.moneyType}>{feeType}</span>
        </div>
        <div className={styles.payType}>{payTypes.map(item => renderPayCell(item))}</div>
        <div
          className={styles.payBtn}
          onClick={() => {
            onClose();
            onOk(selectKey);
          }}
        >
          立即支付
        </div>
      </div>
    </>
  );
};

export default PayTypePopView;
