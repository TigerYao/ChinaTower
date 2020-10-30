import { connect } from 'alita';
import React, { FC, useState, useEffect } from 'react';
import styles from './index.less';

interface AddresPickerProps {
  onChange: (e: any[]) => void;
  onClose: () => void;
  show: boolean;
  title?: string;
  placeholderList?: string[];
}

const AddresPicker: FC<AddresPickerProps> = props => {
  const {
    dispatch,
    realNameAuth,
    onChange = () => {},
    show = false,
    onClose = () => {},
    title = '注册地区',
    placeholderList = ['请选择省', '请选择市'],
  } = props;
  const [selectList, setSelectList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { cityList } = realNameAuth;

  const getActiveText = () => {
    if (selectList.length === 0 && placeholderList.length > 0) {
      return placeholderList[0];
    }
    if (selectList.length >= placeholderList.length) {
      return '';
    }
    return placeholderList[activeIndex];
  };

  const requestPronvie = () => {
    dispatch!({
      type: 'realNameAuth/selectPronvieOrCity',
      payload: {
        areaLevel: 2,
        areaParentCode: '110000',
      },
    });
  };

  const requestCity = (areaParentCode: any, callback = () => {}) => {
    dispatch!({
      type: 'realNameAuth/selectPronvieOrCity',
      payload: {
        areaLevel: 3,
        areaParentCode,
        callback,
      },
    });
  };

  const submit = (selectListTemp: any[]) => {
    setActiveIndex(selectListTemp.length);
    const resultObj = {
      label: selectListTemp.map(item => {
        return item.label;
      }),
      value: selectListTemp.map(item => {
        return item.value;
      }),
    };
    onClose();
    onChange(resultObj);
  };

  useEffect(() => {
    if (show) {
      requestPronvie();
      setSelectList([]);
      setActiveIndex(0);
    }
    return () => {};
  }, [show]);

  const NavBar = () => (
    <div className={styles.navBar}>
      <div
        className={styles.ampickerpopupheaderleft}
        onClick={() => {
          onClose();
        }}
      >
        {' '}
      </div>
      <div className={styles.ampickerpopuptitle}>{title}</div>
      <div
        className={styles.ampickerpopupheaderright}
        onClick={() => {
          submit(selectList);
        }}
      >
        确定
      </div>
    </div>
  );

  const SelectArea = () => (
    <div className={styles.didChoose}>
      {selectList.map((item, index) => {
        return (
          <span
            key={item.value}
            className={`${styles.item}`}
            onClick={() => {
              if (index === 0) {
                requestPronvie();
                setActiveIndex(index);
                const tempSelectList = selectList.filter((item, i) => i < index);
                setSelectList(tempSelectList);
              }
            }}
          >
            {item.value.split(',')[2]}
          </span>
        );
      })}
      <span className={`${styles.item} ${styles.active}`} hidden={getActiveText()?.length === 0}>
        {getActiveText()}
      </span>
    </div>
  );
  const CityList = () => (
    <div className={styles.cityList}>
      {cityList.map(item => {
        return (
          <div
            className={styles.cityItem}
            key={item.value}
            onClick={() => {
              const selectListTemp = selectList.concat([item]);
              setSelectList(selectListTemp);
              requestCity(item.value.split(',')[0], (list = []) => {
                if (list.length === 0) {
                  submit(selectListTemp);
                }
              });
            }}
          >
            <div className={styles.cityName}>{item.label}</div>
            <div className={styles.tick} hidden={!selectList.includes(item.value)}></div>
          </div>
        );
      })}
    </div>
  );
  return (
    <div>
      <div
        hidden={!show}
        className={styles.addressPickerModal}
        onClick={() => {
          onClose();
        }}
      ></div>
      <div className={`${styles.addressPicker} ${show ? styles.show : ''}`}>
        <NavBar />
        <SelectArea />
        <CityList />
      </div>
    </div>
  );
};

export default connect(({ realNameAuth }: { realNameAuth: RealNameAuthModelState }) => ({
  realNameAuth,
}))(AddresPicker);
