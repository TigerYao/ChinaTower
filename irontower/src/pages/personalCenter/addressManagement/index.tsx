import React, { FC, useEffect } from 'react';
import { AddressManagementModelState, ConnectProps, connect, router } from 'alita';
import PersonItem from "@/components/PersonItem";
import LoginBtn from "@/components/LoginBtn";
import {getUserInfo} from "@/utils/index";
import { Toast, WhiteSpace } from 'antd-mobile';
import arrowIcon from '@/assets/images/arrow_img.png';
import styles from './index.less';

interface PageProps extends ConnectProps {
  addressManagement: AddressManagementModelState;
}

const AddressManagementPage: FC<PageProps> = ({ addressManagement, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'addressManagement/query',
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  const { detailedAddress, realName, phoneNumber, cityName = "", provinceName = "", cityId } = getUserInfo();

  const pNumber = phoneNumber && phoneNumber.length ? `${phoneNumber.substr(0,3)  }****${  phoneNumber.substr(7)}` : '';
  const formData = {
    key: 1,// 头部是几个 1是一个，2是两个
    name: realName,
    number: pNumber,
    content: detailedAddress ? (`${provinceName  } ${  cityName  } ${  detailedAddress}`) : (`${provinceName  } ${  cityName}`),
  }
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = addressManagement;
  const arrowImg = () => <img src={arrowIcon} style={{ width: '.32rem', height: '.32rem' }} />;
  const isEmpty = (str: string | any[]) => {
    if (!str) {
      return true;
    }
    if (str.length === 0) {
      return true;
    }
    return false;
  };

  const formsData = [
    {
      type: 'input',
      fieldProps: 'cityswitch',
      required: false,
      title: '修改使用地',
      editable: false,
      placeholder: isEmpty(getUserInfo().cityName) ? '' : `当前城市：${getUserInfo().cityName}`,
      extra: arrowImg(),
      onClick: () => {
        if (getUserInfo().ifPayDeposit === '1' && !getUserInfo().packageId) {
          Toast.info('如需修改城市使用地，请先退回押金及服务费！');
        } else {
          router.push({
            pathname: '/personalCenter/searchAddress',
          });
        }
      },
    },
  ] as IFormItemProps[];

  const submit = () => {
    
    if (getUserInfo().ifPayDeposit === '1' && getUserInfo().packageId) {
      Toast.info('如需修改使用地，请先退回押金及服务费！');
    } else {
      router.push({
        pathname: '/personalCenter/searchAddress',
      });
    }
  };

  return (
    <div className={styles.addressManagement}>
      { cityId ? <PersonItem formData={formData} /> : "" }
      {/* <WhiteSpace size="sm" /> */}
      {
        // formsData.map(res => {
          // return (
          //   <div
          //     key={res.fieldProps}
          //     className={styles.formsData}
          //     onClick={() => {
          //       if (res.onClick) {
          //         res.onClick();
          //       }
          //     }}
          //   >
          //     <div>{res.title}</div>
          //     <div className={styles.placeholder}>
          //       {/* <span>{res.placeholder}</span> */}
          //       {arrowImg()}
          //     </div>
          //   </div>
          // );
        // })
      }

      <div className={styles.bottomBox} >
        <LoginBtn title="修改使用地" styleS={{ background: 'rgba(0,191,131,1)' }} click={submit} />
      </div>
    </div>
  )
};

export default connect(({ addressManagement }:{ addressManagement: AddressManagementModelState; }) => ({ addressManagement }))(AddressManagementPage);
