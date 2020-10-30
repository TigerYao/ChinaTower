import React, { FC } from 'react';
import styles from './index.less';

export interface PageProps {
  id: string;
  letter: string;
  city: Array<any>;
}

interface PageDate {
  pageDate: PageProps;
  onClick: (e: any) => void;
}

const ListPage: FC<PageDate> = props => {
  const { pageDate, onClick = () => {} } = props;
  const { letter, city, id } = pageDate;

  return (
    <div className={styles.ListPage}>

      <div className={styles.letter} id={id}>
        {letter}
      </div>
      {city.map(item => {
        // console.log(item);
        return (
          <div
            key={item.areaCode}
            className={styles.city}
            onClick={e => {
              e.stopPropagation();
              onClick(item);
            }}
          >
            {item.areaName}
          </div>
        );
      })}

      {/* <div className={styles.location}>{letter}</div> */}
    </div>
  );
};

export default ListPage;
