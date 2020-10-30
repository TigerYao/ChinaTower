import React, { FC, useEffect, useState } from 'react';
import { CarManageModelState, ConnectProps, connect, setPageNavBar, router } from 'alita';
import { Toast, Modal, Button, Flex, List, Accordion, Icon } from 'antd-mobile'; 
import noCarPic from '@/assets/images/noCar.png';
import rentCarPic from '@/assets/images/rentCar.png';
import iconRentCar from '@/assets/images/icon-rentCar-set.png';
import { getQrcodeStr, getUserInfo, getLoginInfo } from '@/utils';

import styles from './index.less';

interface PageProps extends ConnectProps {
  carManage: CarManageModelState;
}

const CarManagePage: FC<PageProps> = ({ carManage, dispatch }) => {
  const { myCar } = carManage;
  const [ showNoCar, setShowNoCar ] = useState(true);
  const [ showExtend, setShowExtend ] = useState(false)
  // 这里发起了初始化请求
  useEffect(() => {
    getUserInfo();
    if( getUserInfo().driverId ) {
      dispatch!({
        type: 'carManage/query',
        payload: {
          // driverId: "13486cdb847844c6b5bc611e6df84f53",
          driverId: getUserInfo()?.driverId
        }
      });
    }
   
    setPageNavBar({
      pagePath: '/carManage',
      navBar: {
        rightContent: (
          <div
            style={{ color: '#00BF83' }}
            onClick={() => {
              router.push({
                pathname: '/rentCarList',
              });
            }}
          >
            租车记录
          </div>
        ),
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  useEffect(() => {
    if( myCar && myCar.ecarNo ){
      setShowNoCar(false);
    } else {
      setShowNoCar(true);
    }
  }, [ myCar ])

  //去租车
  const onRent = () => {
    if(getUserInfo()?.certification !== '1') {
      Modal.alert('温馨提示', '您尚未实名认证,是否实名认证?', [
        {
          text: '取消',
          onPress: () => {},
        },
        {
          text: '确认',
          onPress: () => {
            router.push({
              pathname: '/realNameAuth',
            });
          },
        },
      ]);
    } else if (getUserInfo()?.driverType === '1' || getUserInfo()?.ifPayDeposit === '1') {
      router.push({
        pathname: '/myWallet/packageList'
      })
    } else {
      router.push({
        pathname: '/myWallet/depositType'
      })
    }
  }
  //解绑
  const onReSetBind = () => {

  }
  // 车辆品牌、型号、电池类型、颜色、重量、电压、最高时速、款式（两轮、三轮）
  const infoShow = [
    {
      key:'licenceNo',
      title: '车牌号',
      value: myCar?.licenceNo ? myCar?.licenceNo : '无'
    },
    {
      key:'brand',
      title: '车辆品牌',
      value: myCar?.brand ? myCar?.brand : '无'
    },
    {
      key:'model',
      title: '车辆型号',
      value: myCar?.model ? myCar?.model : '无'
    },
    
    {
      key:'batteryModel',
      title: '电池类型',
      value: myCar?.batteryModel ? myCar?.batteryModel : '无'
    },
    {
      key:'category',
      title: '车辆类型',
      value: myCar?.category === '1' ? '合作运营' : '自购车辆'
    },
    {
      key: 'cooperativeOperatingName',
      title: '合作运营单位',
      value: myCar?.cooperativeOperatingName ? myCar?.cooperativeOperatingName : '无'
    },
    {
      key: 'lastBindTime',
      title: '租车时间',
      value: myCar?.lastBindTime ? myCar?.lastBindTime : '无'
    },
  ]
  const infoExtend = [

    {
      key: 'ecarFrameNo',
      title: '车架号',
      value: myCar?.ecarFrameNo ? myCar?.ecarFrameNo : '无'
    },
    {
      key: 'color',
      title: '车辆颜色',
      value: myCar?.color ? myCar?.color : '无'
    },
    {
      key: 'weight',
      title: '车辆重量',
      value: myCar?.weight ? `${myCar.weight}kg` : '无',
    },
    {
      key: 'voltage',
      title: '车辆电压',
      value: myCar?.voltage ? `${myCar.voltage}v` : '无',
    },
    {
      key: 'topSpeed',
      title: '最高时速',
      value: myCar?.topSpeed ? `${myCar.topSpeed}km/h` : '无',
    },
    {
      key: 'style',
      title: '车辆款式',
      value: myCar?.style ? myCar?.style : '无'
    },
  ]
  // 未租车页面渲染
  const noCarRender = () => {
    const { ifPayDeposit, driverType } = getUserInfo();
    return (
      <div className={ styles.noCar }>
        <img src={noCarPic}/>
        <div className={ styles.tip }>您当未租用电动车</div>
        {
          ((ifPayDeposit === '0' && driverType !== '3') ||
          driverType === '1' || (ifPayDeposit === '1' && driverType !== '2')) && (
            <Button className={ styles.rentBtn } onClick={ onRent }>去租电动车</Button>
          )
        }
      </div>
    );
  }
  // 租车中界面渲染
  const rentCarRender = () => {
    return (
      <Flex.Item className={ styles.rentCar } direction={'column'} >
        <Flex.Item>
          <img src={ rentCarPic }/>
        </Flex.Item>
        <Flex.Item>
          <span className={ styles.rentTip }>守护中...</span>
        </Flex.Item>
        <Flex.Item style={{ width: '100%' }}>
          {/* <Accordion defaultActiveKey="info-accordion" className={ styles.info_accordion }>
            <Accordion.Panel header="" key={ 'info-accordion' } className={ styles.info_header }>
              { infoShow.map(info => (
                  <div className={ styles.content_item } key={ info.key }>
                    { `${ info.title }：${ info.value }` }
                  </div>
                )) }
            </Accordion.Panel>
          </Accordion> */}
          <div className={styles.infoDiv}>
            <div className={styles.infoBox}>
              {infoShow.map((info, index) => (
                <div className={styles.content_item} key={info.key}>
                  {`${info.title}：${info.value}`}
                  {index === 0 && (
                    <Icon
                      className={styles.extendIcon}
                      type={showExtend ? 'up' : 'down'}
                      onClick={() => {
                        setShowExtend(!showExtend);
                      }}
                    />)}
                </div>
              ))}
              {
                showExtend && (
                  infoExtend.map(info => (
                    <div className={styles.content_item} key={info.key}>
                      {`${info.title}：${info.value}`}
                    </div>
                  ))
                )
              }
            </div>
          </div>
        </Flex.Item>
        <Flex.Item style={{ width:'100%' }}>
          <div className={ styles.setIcon_div }>
            {/* <img src={ iconRentCar } className={ styles.setIcon } onClick={ onReSetBind }/>
            <div className={ styles.setText }>解绑</div> */}
          </div>
        </Flex.Item>
      </Flex.Item>
    );
  }
  return (
    <Flex className={ styles.center }>
      { showNoCar ? noCarRender() : rentCarRender() }
    </Flex>
  );
};

export default connect(({ carManage }:{ carManage: CarManageModelState; }) => ({ carManage }))(CarManagePage);
