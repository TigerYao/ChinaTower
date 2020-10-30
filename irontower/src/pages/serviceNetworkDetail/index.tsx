import React, { FC, useEffect, useState } from 'react';
import { ServiceNetworkDetailModelState, ConnectProps, connect } from 'alita';
import { Carousel } from 'antd-mobile';
import DefaultImg from '@/assets/images/default-img.png';
import { openMapApp } from '@/utils/cordovapluigs';
import styles from './index.less';

interface PageProps extends ConnectProps {
  serviceNetworkDetail: ServiceNetworkDetailModelState;
}

const ServiceNetworkDetailPage: FC<PageProps> = ({ serviceNetworkDetail, dispatch, location }) => {
  const { networkDetail = {}, fileList } = serviceNetworkDetail;
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'serviceNetworkDetail/queryNetworkInfo',
      payload: {
        nodeId: location.query.nodeId,
        callback: res => {
          dispatch!({
            type: 'serviceNetworkDetail/batchQueryFileInfoByIds',
            payload: {
              fileIds: res.nodePic,
            },
          });
        },
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  const renderEleCell = ({
    title = '',
    value = '',
    extra = { text: '', onClick: () => {} },
  }: any) => {
    const { text, onClick = () => {} } = extra;
    return (
      <div className={`${styles.eleCell} `}>
        <div className={`${styles.cellHd} ${styles.eleTitle}`}>{title}</div>
        <div className={styles.cellBd}>
          <span>{value}</span>
          {extra.text && (
            <span onClick={onClick} className={styles.extraBtn}>
              {text}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.serviceNetworkDetailPage}>
      <div className={styles.detailPage}>
        <div className={styles.bannerBox}>
          {fileList && fileList.length > 1 ? (
            <Carousel autoplay infinite>
              {fileList.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <img src={item.fileUrl} alt="" key={index} />
              ))}
            </Carousel>
          ) : (
            <img src={fileList[0].fileUrl} alt="" />
          )}
        </div>
        <div className={styles.mainWrapper}>
          {networkDetail && (
            <div className={styles.title}>
              <div className={styles.address}>{networkDetail.nodeAddress}</div>
              <div
                className={styles.navMap}
                onClick={() => {
                  openMapApp({
                    name: networkDetail.nodeAddress,
                    lat: networkDetail.nodeLatitude,
                    lng: networkDetail.nodeLongitude,
                    origin: '我的位置',
                    mode: 'riding',
                  });
                }}
              >
                导航
              </div>
            </div>
          )}
          {renderEleCell({
            title: '经纬度',
            value: (
              <span>
                {`经度：${networkDetail.nodeLongitude || ''}`}
                &nbsp;&nbsp;&nbsp;&nbsp;
                {`纬度：${networkDetail.nodeLatitude || ''}`}
              </span>
            ),
          })}

          {renderEleCell({
            title: '营业时间',
            value: `${networkDetail.openTime}-${networkDetail.closeTime}`,
          })}
          {renderEleCell({
            title: '联系电话',
            value: networkDetail.operatorPhone,
            extra: {
              text: <a href={`tel:${networkDetail.operatorPhone}`}>拨打</a>,
              onClick: () => {},
            },
          })}
          {renderEleCell({
            title: '网点地址',
            value: networkDetail.nodeAddress,
          })}
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ serviceNetworkDetail }: { serviceNetworkDetail: ServiceNetworkDetailModelState }) => ({
    serviceNetworkDetail,
  }),
)(ServiceNetworkDetailPage);
