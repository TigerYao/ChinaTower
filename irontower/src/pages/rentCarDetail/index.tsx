import React, { FC, useEffect } from 'react';
import { RentCarDetailModelState, ConnectProps, connect } from 'alita';
import { Flex, List } from 'antd-mobile'; 
import styles from './index.less';
import { getUserInfo, } from '@/utils';

interface PageProps extends ConnectProps {
  rentCarDetail: RentCarDetailModelState;
}

const RentCarDetailPage: FC<PageProps> = ({ rentCarDetail, dispatch, location }) => {
  const { renCarDetailInfo } = rentCarDetail;
  const { driverId } = getUserInfo();
  const { id = '' } = location.query;
  // 这里发起了初始化请求POST /bussiness/personal/getMyECarRecordDet
  useEffect(() => {
    dispatch!({
      type: 'rentCarDetail/getMyECarRecordDet',
      payload: {
        driverId,
        id,
      }
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const detailForm = [
    {
      key: 'ecarNo',
      title: '车辆编号',
      value: renCarDetailInfo?.ecarNo ? renCarDetailInfo?.ecarNo : '无',
    },
    {
      key: 'licenceNo',
      title: '车牌号',
      value: renCarDetailInfo?.licenceNo ? renCarDetailInfo?.licenceNo : '无',
    },
    {
      key: 'model',
      title: '车牌型号',
      value: renCarDetailInfo?.model ? renCarDetailInfo?.model : '无',
    },
    {
      key: 'category',
      title: '车辆类型',
      value: renCarDetailInfo?.category === '1' ? '合作运营' : '自购车辆',
    },
    {
      key: 'cooperativeOperatingName',
      title: '合作运营单位',
      value: renCarDetailInfo?.cooperativeOperatingName ? renCarDetailInfo?.cooperativeOperatingName : '无',
    },
    {
      key: 'ecarFrameNo',
      title: '车架号',
      value: renCarDetailInfo?.ecarFrameNo ? renCarDetailInfo?.ecarFrameNo : '无',
    },
    {
      key: 'batteryModel',
      title: '电池类型',
      value: renCarDetailInfo?.batteryModel ? renCarDetailInfo?.batteryModel : '无',
    },
    {
      key: 'color',
      title: '车辆颜色',
      value: renCarDetailInfo?.color ? renCarDetailInfo?.color : '无',
    },
    {
      key: 'weight',
      title: '车辆重量',
      value: renCarDetailInfo?.weight ? `${renCarDetailInfo?.weight}kg` : '无',
    },
    {
      key: 'voltage',
      title: '车辆电压',
      value: renCarDetailInfo?.voltage ? `${renCarDetailInfo?.voltage}v` : '无',
    },
    {
      key: 'topSpeed',
      title: '最高时速',
      value: renCarDetailInfo?.topSpeed ? `${renCarDetailInfo?.topSpeed}km/h` : '无',
    },
    {
      key: 'style',
      title: '车辆款式',
      value: renCarDetailInfo?.style ? renCarDetailInfo?.style : '无',
    },
    {
      key: 'borrowTime',
      title: '租车时间',
      value: renCarDetailInfo?.borrowTime ? renCarDetailInfo?.borrowTime : '无',
    },
    {
      key: 'outNetNodeName',
      title: '租车网点',
      value: renCarDetailInfo?.outNetNodeName ? renCarDetailInfo?.outNetNodeName : '无',
    },
    {
      key: 'returnTime',
      title: '还车时间',
      value: renCarDetailInfo?.returnTime ? renCarDetailInfo?.returnTime : '无',
    },
    {
      key: 'putNetNodeName',
      title: '还车网点',
      value: renCarDetailInfo?.putNetNodeName ? renCarDetailInfo?.putNetNodeName : '无',
    },
  ]
  return (
    <Flex direction="column" justify="start" className={ styles.center }>
      <Flex.Item className={ styles.infoItem }>
        <List className={ styles.infoList }>
          {detailForm.map((item, index) => (
            <List.Item className={ styles.listItem } key={item.key} >
              <div className={ index === 0 ? styles.textLeftEm : styles.textLeft }>
                {item.title}
              </div>
              <div className={ index === 0 ? styles.textRightEm : styles.textRight }>
                { item.value }
              </div>
            </List.Item>
          ))}
        </List>
      </Flex.Item>
      <Flex.Item className={ styles.buttomFlex }>
        <div className={ styles.buttomDiv }/>
      </Flex.Item>
    </Flex>
  );
};

export default connect(({ rentCarDetail }:{ rentCarDetail: RentCarDetailModelState; }) => ({ rentCarDetail }))(RentCarDetailPage);
