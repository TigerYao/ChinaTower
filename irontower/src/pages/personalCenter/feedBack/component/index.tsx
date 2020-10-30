import React, { FC, useState } from 'react';
import styles from './index.less';

export interface CardProps {
  value?: number;
  label: string;
  click: () => void;
}
interface cardDate {
  cardDate: CardProps;
  // ref:[]
  click: () => void;
  currentCount: number;
  style?: boolean;
}

const Card: FC<cardDate> = props => {
  const { cardDate, click, currentCount, style } = props;
  const { label, value } = cardDate;
  // const [style, setStyle] = useState(false);
  // const change = () => {
  //   if (style === false) {
  //     console.log(currentCount);
  //     if (currentCount <= 2) {
  //       setStyle(true);
  //     }
  //   } else {
  //     setStyle(false);
  //   }
  // };
  return (
    <div className={styles.Card}>
      <div
        className={style ? styles.green : styles.gray}
        onClick={() => {
          click(value);
          // change();
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default Card;
