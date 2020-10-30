/* eslint-disable no-unused-expressions */
import React, { FC, useEffect, useState } from 'react';
import {
  EleCabinetDetailModelState,
  ConnectProps,
  connect,
  setPageNavBar,
  history,
  router,
} from 'alita';
import { Carousel, Toast } from 'antd-mobile';
import moment from 'moment';
import IconEleHome from '@/assets/images/home-ele-icon.png';
import IconArrowRight from '@/assets/images/arrowright.png';

import DefaultImg from '@/assets/images/default-img.png';
import { openMapApp, playMedia } from '@/utils/cordovapluigs';
import ImagePreview from '@/components/ImagePreview';
import LineChart from './components/LineChart/index';

import styles from './index.less';
const dateFormat = 'YYYY-MM-DD';
const inDate = moment().format(dateFormat);

interface PageProps extends ConnectProps {
  eleCabinetDetail: EleCabinetDetailModelState;
}

const EleCabinetDetailPage: FC<PageProps> = ({ eleCabinetDetail, dispatch, location }) => {
  const [stationObj, setstationObj] = useState();
  const [picObj, setPicObj] = useState();
  const [locationData, setLocationData] = useState({ item: {} });
  const [yesterdayExchangeInfo, setYesterdayExchangeInfo] = useState();

  // 这里发起了初始化请求
  useEffect(() => {
    // setPageNavBar({
    //   pagePath: '/eleCabinetDetail',
    //   navBar: {
    //     rightContent: (
    //       <div
    //         onClick={() => {
    //           history.push({
    //             pathname: '/cabinetDoorInfo',
    //             query: {
    //               cabinetId: location.query.cabinetId,
    //             },
    //           });
    //         }}
    //         style={{ color: 'rgba(0, 191, 131, 1)' }}
    //       >
    //         柜门列表
    //       </div>
    //     ),
    //   },
    // });
    console.log(location);
    setLocationData({
      item: JSON.parse(location.query.item),
    });
    dispatch!({
      type: 'index/queryCabinetBatteryInfo',
      payload: {
        cabinetId: location.query.cabinetId,
        callback: re => {
          if (re && re.caibinetPic) {
            dispatch!({
              type: 'eleCabinetDetail/batchQueryFileInfoByIds',
              payload: {
                fileIds: re.caibinetPic,
                callback: res => {
                  if (res.length) {
                    setPicObj(res);
                  } else {
                    setPicObj([{ fileUrl: DefaultImg }]);
                  }
                },
              },
            });
          } else {
            setPicObj([{ fileUrl: DefaultImg }]);
          }

          setstationObj(re);
        },
      },
    });
    dispatch!({
      type: 'eleCabinetDetail/queryDayCabinetExchangeStatistics',
      payload: {
        cabinetId: location.query.cabinetId,
        //cabinetId: 'CHZD08KPD0200526008', //location.query.cabinetId
        // inDate: '2020-09-23',
        callback: res => {
          setYesterdayExchangeInfo(res);
        },
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);

  // const renderEleView = () => (
  //   <div className={styles.chargeEle}>
  //     <div className={styles.eleTitle}>电池充电情况</div>
  //     <div className={styles.eleBd}>
  //       <div className={styles.eleHd}>
  //         <div className={styles.countEle}>
  //           <span style={{ fontSize: '0.60rem' }}>{stationObj.fullCount}</span>块
  //         </div>
  //         <div className={styles.eleDes}>可用电池</div>
  //       </div>
  //       <div className={styles.eleFt}>
  //         <div className={styles.countEle}>
  //           <span className={styles.charging}>{stationObj.notFullCount}</span>块
  //         </div>
  //         <div className={styles.eleDes}>正在充电电池</div>
  //       </div>
  //     </div>
  //   </div>
  // );

  const renderEleView = () => (
    <div className={styles.chargeEle}>
      <div className={styles.eleTitle}>电池充电情况</div>
      <div className={styles.eleBd}>
        <div className={styles.eleEachBg}>
          <div className={styles.eleBdtitle}>48V</div>
          <div className={styles.eleBdContent}>
            <div>
              <span style={{ color: '#00BF83', fontSize: 48 }}>{stationObj.fullCount48}</span>块
              <div>可用</div>
            </div>

            <div style={{ marginLeft: 20 }}>
              <span style={{ color: '#FF7040', fontSize: 48 }}>{stationObj.notFullCount48}</span>块
              <div>充电</div>
            </div>
          </div>
        </div>
        <div className={styles.eleEachBg}>
          <div className={styles.eleBdtitle}>60V</div>
          <div className={styles.eleBdContent}>
            <div>
              <span style={{ color: '#00BF83', fontSize: 48 }}>{stationObj.fullCount60}</span>块
              <div>可用</div>
            </div>
            <div style={{ marginLeft: 20 }}>
              <span style={{ color: '#FF7040', fontSize: 48 }}>{stationObj.notFullCount60}</span>块
              <div>充电</div>
            </div>
          </div>
        </div>

        {console.log(locationData)}
        {location.query.type === 'return' && (
          <>
            <div className={styles.eleBdtitle}>机柜仓数</div>
            <div className={styles.eleBdContent}>
              <div>
                总仓数<span style={{ color: 'blue' }}>{locationData.item.cabinCount}</span>
              </div>
              <div>
                空仓数
                <span style={{ color: 'orange' }}>
                  {Number(locationData.item.cabinCount) -
                    Number(locationData.item.fullCount) -
                    Number(locationData.item.notFullCount)}
                </span>
                {/* 块 */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderEleCell = ({ title = '', value = '', extra = { text: '', onClick: () => {} } }) => {
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

  let imageSet;
  const getImageSet = () => {
    imageSet =
      picObj &&
      picObj.map(item => {
        return { src: item.fileUrl, alt: item.fileUrl };
      });

    return imageSet;
  };
  const [isOpen, setOpen] = useState(false);

  // const { name } = eleCabinetDetail;
  return stationObj && picObj ? (
    <div className={styles.detailPage}>
      <div className={styles.bannerBox}>
        {picObj && picObj.length > 1 ? (
          <Carousel autoplay infinite>
            {picObj.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <img
                src={item.fileUrl}
                alt=""
                key={index}
                onClick={() => {
                  router.push({
                    pathname: '/ImagePreview',
                    query: {
                      picObj: JSON.stringify(picObj),
                      selectedIndex: index,
                    },
                  });
                  // ImagePreview.preview({ visible :{ isOpen }, images : getImageSet(),activeIndex:index,zIndex:index});
                }}
              />
            ))}
          </Carousel>
        ) : (
          <img
            src={picObj[0].fileUrl}
            alt=""
            onClick={() => {
              router.push({
                pathname: '/ImagePreview',
                query: {
                  picObj: JSON.stringify(picObj),
                  selectedIndex: 0,
                },
              });
              // ImagePreview.preview({ visible :{ isOpen }, images : getImageSet(),activeIndex:index,zIndex:index});
            }}
          />
        )}
      </div>
      <div className={styles.mainWrapper}>
        <div className={styles.title}>
          <div className={styles.cabinetAddress}>
            <div className={styles.address}>{stationObj.cabinetName}</div>
            <div className={styles.subAddress}>{stationObj.cabinetAddress}</div>
          </div>
          <div
            className={styles.navMap}
            onClick={() => {
              openMapApp({
                name: stationObj.cabinetAddress,
                lat: stationObj.cabinetLatitude,
                lng: stationObj.cabinetLongitude,
                origin: '我的位置',
                mode: 'riding',
              });

              /**
               * 119.280473,26.068227
               */
              /**
               *  name: selectObj.name,
              lat: selectObj.stationLatitude,
              lng: selectObj.stationLongitude,
              origin: '我的位置',
              mode: 'riding',
              addr: selectObj.addr,
               */
            }}
          >
            导航
          </div>
        </div>
        {renderEleView()}
        <div
          className={styles.eleCell}
          onClick={() => {
            history.push({
              pathname: '/cabinetDoorInfo',
              query: {
                cabinetId: location.query.cabinetId,
              },
            });
          }}
        >
          <div className={`${styles.cellHd}  ${styles.eleTitle}`}>机柜信息</div>
          <div className={styles.cellBd_}>
            <div className={styles.cellBDA}>
              <div>机柜名称：{stationObj.cabinetName}</div>
              <div>机柜编码：{stationObj.cabinetId}</div>
            </div>
            <div className={styles.arrowRight}>
              <img src={IconArrowRight} alt="" />
            </div>
          </div>
        </div>

        <div className={styles.eleCell}>
          <div className={`${styles.cellHd}  ${styles.eleTitle}`}>昨日换电情况</div>

          <div className={styles.exchangeInfo}>
            <div className={styles.infoLeft}>
              <div className={styles.infoTitle}>昨日换电总次数</div>
              <div className={styles.infoContent}>
                {yesterdayExchangeInfo && yesterdayExchangeInfo.totalExchangeCount
                  ? yesterdayExchangeInfo.totalExchangeCount
                  : '0'}
                次
              </div>
            </div>
            <div className={styles.infoRoght}>
              <div className={styles.infoTitle}>换电峰值</div>
              <div className={styles.infoContent}>
                {yesterdayExchangeInfo && yesterdayExchangeInfo.topHoure
                  ? yesterdayExchangeInfo.topHoure
                  : '0'}
                点
              </div>
            </div>
          </div>

          <div className={styles.exchangeInfo}>
            <div className={styles.infoLeft}>
              <div className={styles.infoTitle}>昨日总换电人数</div>
              <div className={styles.infoContent}>
                {yesterdayExchangeInfo && yesterdayExchangeInfo.totalUserCount
                  ? yesterdayExchangeInfo.totalUserCount
                  : '0'}
                人
              </div>
            </div>
            <div className={styles.infoRoght}>
              <div className={styles.infoTitle}>峰值换电次数</div>
              <div className={styles.infoContent}>
                {yesterdayExchangeInfo && yesterdayExchangeInfo.topHoureTimes
                  ? yesterdayExchangeInfo.topHoureTimes
                  : '0'}
                次
              </div>
            </div>
          </div>
          <div>
            {yesterdayExchangeInfo && yesterdayExchangeInfo.countHourList ? (
              <LineChart
                porjTotal={5}
                title="近一周趋势"
                colors={[
                  'rgb(127, 207, 250)',
                  'rgb(234, 173, 102)',
                  'rgb(69, 137, 231)',
                  'rgb(237, 104, 99)',
                ]}
                data={yesterdayExchangeInfo.countHourList}
                unit=""
                id="ictProjAnalysis1"
              />
            ) : (
              ''
            )}
          </div>
        </div>

        {/* {renderEleCell({
          title: '机柜名称',
          value: stationObj.cabinetName,
        })}
        {renderEleCell({
          title: '电柜编号',
          value: stationObj.cabinetId,
          extra: {
            text: '复制',
            onClick: () => {
              copy(stationObj.cabinetId);
              Toast.info('已复制');
            },
          },
        })} */}
        {renderEleCell({
          title: '营业时间',
          value: stationObj.businessHours,
        })}
        {renderEleCell({
          title: '联系电话',
          value: '10096',
          extra: {
            text: <a href={`tel:${stationObj.contactNumber}`}>拨打</a>,
            onClick: () => {},
          },
        })}
        {renderEleCell({
          title: '电柜地址',
          value: stationObj.cabinetAddress,
        })}
      </div>
    </div>
  ) : (
    ''
  );
};

export default connect(
  ({ eleCabinetDetail }: { eleCabinetDetail: EleCabinetDetailModelState }) => ({
    eleCabinetDetail,
  }),
)(EleCabinetDetailPage);
